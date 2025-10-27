import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as crypto from "crypto";
// Use CommonJS import to match pdf-parse's export shape (with our local d.ts)
import pdfParse = require("pdf-parse");

type ParsedCourse = { 
  code: string; 
  title?: string; 
  grade: "A+" | "A" | "A-" | string;
  confidence: "high" | "medium" | "low";
};

type ExtractionResult = {
  eligible: ParsedCourse[];
  nonEligible: Array<{
    code: string;
    title?: string;
    grade: string;
    reason: string;
  }>;
};

// Accept A/A+ by default. Set TRANSCRIPT_MIN_GRADE=A- to include A-.
const MIN_GRADE = (process.env.TRANSCRIPT_MIN_GRADE || "A-").toUpperCase();

@Injectable()
export class TranscriptsService {
  private readonly logger = new Logger(TranscriptsService.name);
  
  constructor(private prisma: PrismaService) {}

  private sha256(buf: Buffer) {
    return crypto.createHash("sha256").update(buf).digest("hex");
  }

  /**
   * Clean OCR artifacts and normalize special characters
   */
  private cleanOcrText(text: string): string {
    return text
      .replace(/['']/g, "'")      // normalize single quotes
      .replace(/[""]/g, '"')       // normalize double quotes
      .replace(/\u00A0/g, ' ')     // non-breaking space → regular space
      .replace(/\u2013|\u2014/g, '-') // en-dash/em-dash → hyphen
      .replace(/\s{2,}/g, ' ')     // collapse multiple spaces
      .trim();
  }

  private isEligibleAUI(grade: string) {
    const g = grade.trim().toUpperCase();
    if (MIN_GRADE === "A-") return g === "A+" || g === "A" || g === "A-";
    return g === "A+" || g === "A";
  }

  /**
   * Enhanced AUI-specific extractor with better error handling and validation:
   *   CODE  TITLE…  LG <LETTER> …
   * - Ignores NG/PF/TR/WIP lines
   * - Handles suffixes: -L, -SL
   * - Collapses noisy PDF spaces
   * - Better validation of course codes and grades
   * - Adds confidence scoring
   * - Returns both eligible and non-eligible courses for summary
   */
  private extractCoursesFromText(text: string): ExtractionResult {
    const result: ExtractionResult = {
      eligible: [],
      nonEligible: [],
    };

    if (!text || text.length < 10) {
      return result;
    }

    // Clean OCR artifacts before processing
    const cleanedText = this.cleanOcrText(text);

    const lines = cleanedText
      .split(/\r?\n/)
      .map((l) => l.replace(/\s{2,}/g, " ").trim()) // collapse multi-spaces
      .filter(Boolean);

    this.logger.log(`Processing ${lines.length} lines from transcript`);
    
    // Log first 10 lines that look like course lines (start with letters+numbers)
    const sampleLines = lines.filter(l => /^[A-Z]{2,6}\d{3,4}/.test(l)).slice(0, 10);
    if (sampleLines.length > 0) {
      this.logger.log(`Sample course lines found: ${sampleLines.length}`);
      this.logger.log(`First sample: "${sampleLines[0]}"`);
      if (sampleLines.length > 1) this.logger.log(`Second sample: "${sampleLines[1]}"`);
    } else {
      this.logger.warn(`No lines matching course pattern found!`);
    }

    // The PDF extracts text with course code on one line, then details on next line
    // Example: 
    // Line 1: "ARB1241"
    // Line 2: "Arabic LiteratureLGA-2.002.007.342.00"
    // We need to combine consecutive lines
    const combinedLines: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      // If line starts with course code pattern
      if (/^[A-Z]{2,6}\d{3,4}(?:-[A-Z]{1,2})?$/.test(lines[i])) {
        // Combine with next line if it exists
        if (i + 1 < lines.length) {
          combinedLines.push(`${lines[i]} ${lines[i + 1]}`);
          i++; // Skip the next line since we combined it
        }
      }
    }

    this.logger.log(`Combined ${combinedLines.length} course line pairs`);
    if (combinedLines.length > 0) {
      this.logger.log(`First combined line: "${combinedLines[0]}"`);
    }

    // Pattern matches: "ARB1241 Arabic LiteratureLGA-2.00..."
    // The title ends right before LG/CR/PF/NG/TR/LC
    const CODE = `([A-Z]{2,6}\\d{3,4}(?:-[A-Z]{1,2})?)`;
    const TITLE = `(.+?)`; // title - captured non-greedy
    const TYPE = `(LG|CR|PF|NG|TR|LC)`; // grade-type column
    // Grade pattern - must handle A+, A, A- properly (the hyphen in A- needs escaping in character class)
    const GRADE = `(A\\+|A-|A|B\\+|B-|B|C\\+|C-|C|D\\+|D-|D|F|P|NG|TR|WIP|IP)`;

    // Match: CODE TITLE+TYPE+GRADE (no spaces between TITLE and TYPE)
    // Use lookahead to ensure TYPE is followed by valid grade
    const rowRegex = new RegExp(`^${CODE}\\s+${TITLE}(?=${TYPE}${GRADE})${TYPE}${GRADE}`, "i");

    const seenEligible = new Map<string, ParsedCourse>(); // keep best duplicate (A+ > A > A-)
    const seenNonEligible = new Map<string, { code: string; title?: string; grade: string; reason: string }>();

    let matchedLines = 0;
    for (const raw of combinedLines) {
      const line = raw.replace(/\u00A0/g, " "); // NBSP → space (extra safety)
      const m = line.match(rowRegex);
      if (!m) continue;
      
      matchedLines++;
      const [, codeRaw, titleRaw, typeRaw, gradeRaw] = m;
      const type = typeRaw.toUpperCase();
      const grade = gradeRaw.toUpperCase();
      
      // Log first match for debugging
      if (matchedLines === 1) {
        this.logger.log(`First match - Code: ${codeRaw}, Title: ${titleRaw}, Type: ${type}, Grade: ${grade}`);
      }
      
      // Clean and validate course code
      const code = codeRaw.replace(/\s+/g, "").toUpperCase();
      const title = titleRaw.replace(/\s{2,}/g, " ").trim();

      // Check eligibility and track reasons for rejection
      if (type !== "LG") {
        if (!seenNonEligible.has(code)) {
          seenNonEligible.set(code, { code, title, grade, reason: `Not letter-graded (type: ${type})` });
        }
        continue;
      }

      if (!this.isValidCourseCode(code)) {
        if (!seenNonEligible.has(code)) {
          seenNonEligible.set(code, { code, title, grade, reason: 'Invalid course code format' });
        }
        continue;
      }

      if (!this.isEligibleAUI(grade)) {
        if (!seenNonEligible.has(code)) {
          seenNonEligible.set(code, { code, title, grade, reason: `Grade ${grade} below minimum (requires A-, A, or A+)` });
        }
        continue;
      }

      // Course is eligible - calculate confidence score
      const confidence = this.calculateConfidence(code, title, grade);

      // prefer better grade on duplicates
      const rank = this.getGradeRank(grade);
      const prev = seenEligible.get(code);
      if (!prev) {
        seenEligible.set(code, { code, title, grade, confidence });
      } else {
        const prevRank = this.getGradeRank(prev.grade);
        if (rank > prevRank) seenEligible.set(code, { code, title, grade, confidence });
      }
    }

    this.logger.log(`Regex matched ${matchedLines} lines from ${combinedLines.length} combined lines`);
    this.logger.log(`Found ${seenEligible.size} eligible and ${seenNonEligible.size} non-eligible courses`);

    result.eligible = Array.from(seenEligible.values());
    result.nonEligible = Array.from(seenNonEligible.values());

    return result;
  }

  /**
   * Validate course code format with flexible pattern matching
   */
  private isValidCourseCode(code: string): boolean {
    // Course code should be letters followed by numbers, optionally with suffix
    const codePattern = /^[A-Z]{2,6}\d{3,4}(?:-[A-Z]{1,3})?$/;
    return codePattern.test(code);
  }

  /**
   * Calculate confidence score based on pattern match quality
   */
  private calculateConfidence(code: string, title: string, grade: string): "high" | "medium" | "low" {
    let score = 0;
    
    // Strong course code pattern (exact format)
    if (/^[A-Z]{3}\d{4}$/.test(code)) score += 3;
    else if (/^[A-Z]{2,6}\d{3,4}$/.test(code)) score += 2;
    else score += 1;
    
    // Title has reasonable length and content
    if (title && title.length > 5 && title.length < 100) score += 2;
    else if (title) score += 1;
    
    // Grade is clean and standard
    if (['A+', 'A', 'A-'].includes(grade)) score += 2;
    else score += 1;
    
    if (score >= 6) return "high";
    if (score >= 4) return "medium";
    return "low";
  }

  /**
   * Get numeric rank for grade comparison
   */
  private getGradeRank(grade: string): number {
    const gradeRanks: Record<string, number> = {
      'A+': 4,
      'A': 3,
      'A-': 2,
      'B+': 1,
      'B': 0,
    };
    return gradeRanks[grade] || 0;
  }

  /**
   * Process a PDF transcript:
   * - parse text
   * - extract A/A+ (or A-) LG courses
   * - upsert into UserCourse
   * - write TranscriptIngest audit row
   */
  async processPdfTranscript(email: string, file: Express.Multer.File) {
    this.logger.log(`Processing transcript for user: ${email}, file: ${file.originalname}`);
    
    // defensive checks
    if (!file || !file.buffer) {
      throw new Error('Uploaded file buffer is missing. Ensure the upload uses memoryStorage.');
    }

    // Check file size and type
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // 1) ensure user exists
    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Calculate file hash for audit trail
    const fileHash = this.sha256(file.buffer);

    // Commented out duplicate check for testing - you can re-enable later
    /*
    const existingIngest = await this.prisma.transcriptIngest.findFirst({
      where: { 
        userId: user.id, 
        fileHash: fileHash 
      }
    });

    if (existingIngest) {
      this.logger.warn(`Duplicate file upload detected for user ${email}: ${file.originalname}`);
      return { 
        ok: false, 
        message: "This transcript has already been processed.", 
        existing: true 
      };
    }
    */

    // 2) parse PDF
    let parsed: any;
    try {
      parsed = await pdfParse(file.buffer);
    } catch (err) {
      this.logger.error(`PDF parsing failed for ${file.originalname}: ${(err as any)?.message}`);
      throw new Error('Failed to parse PDF transcript: ' + (err as any)?.message);
    }
    
    const text = parsed?.text || "";
    if (!text || text.length < 20) {
      this.logger.warn(`Insufficient text extracted from ${file.originalname} (${text.length} chars)`);
      return { ok: false, message: "Could not read transcript text. Please upload a text-based PDF." };
    }

    // Log extracted text info for debugging
    this.logger.log(`Extracted ${text.length} characters from PDF`);
    this.logger.log(`First 300 chars: ${text.substring(0, 300).replace(/\n/g, '\\n')}`);

    // 3) extract courses (AUI-specific)
    const extractionResult = this.extractCoursesFromText(text);
    const { eligible, nonEligible } = extractionResult;
    
    // Log confidence distribution for debugging
    const confidenceStats = {
      high: eligible.filter(c => c.confidence === 'high').length,
      medium: eligible.filter(c => c.confidence === 'medium').length,
      low: eligible.filter(c => c.confidence === 'low').length,
    };
    this.logger.log(`Extracted ${eligible.length} eligible courses from transcript (confidence: ${confidenceStats.high} high, ${confidenceStats.medium} medium, ${confidenceStats.low} low)`);
    this.logger.log(`Found ${nonEligible.length} non-eligible courses`);

    if (eligible.length === 0) {
      return { 
        ok: false, 
        message: "No eligible courses found. Please ensure this is a valid AUI transcript with letter-graded courses (A+, A, or A-).",
        summary: {
          totalCourses: nonEligible.length,
          eligible: 0,
          nonEligible: nonEligible.length,
          nonEligibleCourses: nonEligible.slice(0, 10), // Show first 10
        }
      };
    }

    // 4) audit record (courses will be added later when user selects them)
    await this.prisma.transcriptIngest.create({
      data: {
        userId: user.id,
        fileName: file.originalname,
        fileHash: fileHash,
        parsedJson: { 
          eligible,
          nonEligible,
          textLength: text.length,
          processedAt: new Date().toISOString()
        }, // store what we recognized
        addedCount: 0, // Courses not auto-added anymore
      },
    });

    this.logger.log(`Successfully processed transcript for ${email}: found ${eligible.length} eligible courses`);

    // 5) return comprehensive summary with confidence information
    return {
      ok: true,
      added: 0, // Courses not auto-added anymore
      updated: 0,
      total: 0,
      summary: {
        totalCourses: eligible.length + nonEligible.length,
        eligible: eligible.length,
        nonEligible: nonEligible.length,
        confidenceBreakdown: {
          high: confidenceStats.high,
          medium: confidenceStats.medium,
          low: confidenceStats.low,
        },
      },
      eligibleCourses: eligible.map((c) => ({ 
        code: c.code, 
        grade: c.grade, 
        title: c.title,
        confidence: c.confidence 
      })),
      nonEligibleCourses: nonEligible.map((c) => ({
        code: c.code,
        grade: c.grade,
        title: c.title,
        reason: c.reason,
      })),
    };
  }

  /**
   * Get transcript upload history for a user
   */
  async getTranscriptHistory(email: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { email },
      select: { id: true }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.prisma.transcriptIngest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        addedCount: true,
        createdAt: true,
        parsedJson: true,
      },
    });
  }

  /**
   * Get all courses for a user (from their transcripts)
   */
  async getUserCourses(email: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { email },
      select: { id: true }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.prisma.userCourse.findMany({
      where: { userId: user.id },
      orderBy: { courseCode: 'asc' },
      select: {
        courseCode: true,
        grade: true,
        createdAt: true,
      },
    });
  }

  /**
   * Add selected courses from transcript to user's profile
   */
  async addSelectedCourses(email: string, courses: { code: string; grade: string }[]) {
    const user = await this.prisma.user.findUnique({ 
      where: { email },
      select: { id: true }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let addedCount = 0;
    let updatedCount = 0;
    
    for (const c of courses) {
      const code = c.code.toUpperCase();
      const grade = c.grade.toUpperCase();
      
      try {
        const existing = await this.prisma.userCourse.findUnique({
          where: { userId_courseCode: { userId: user.id, courseCode: code } }
        });

        if (existing) {
          if (this.getGradeRank(grade) > this.getGradeRank(existing.grade)) {
            await this.prisma.userCourse.update({
              where: { userId_courseCode: { userId: user.id, courseCode: code } },
              data: { grade }
            });
            updatedCount++;
            this.logger.log(`Updated grade for ${code} from ${existing.grade} to ${grade}`);
          }
        } else {
          await this.prisma.userCourse.create({
            data: { userId: user.id, courseCode: code, grade }
          });
          addedCount++;
          this.logger.log(`Added new course ${code} with grade ${grade}`);
        }
      } catch (error) {
        this.logger.error(`Failed to process course ${code}: ${(error as any)?.message}`);
        // Continue processing other courses
      }
    }

    this.logger.log(`Added ${addedCount} new courses, updated ${updatedCount} for ${email}`);

    return {
      ok: true,
      added: addedCount,
      updated: updatedCount,
      total: addedCount + updatedCount,
    };
  }
}
