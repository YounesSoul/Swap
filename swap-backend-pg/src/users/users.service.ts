import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SkillLevel } from '@prisma/client';

const toSlug = (s: string) => s.trim().toLowerCase();

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async upsertByEmail(
    email: string,
    name?: string,
    university?: string,
    timezone?: string,
    image?: string,
  ) {
    return this.prisma.user.upsert({
      where: { email },
      update: { name, university, timezone, image },
      create: {
        email, name, university, timezone, image,
        // initial token
        tokenLedger: { create: { tokens: 1, reason: 'initial_grant' } },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async profile(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        userSkills: { include: { skill: true } },
        userCourses: true,
      },
    });
  }

  async onboarding(params: {
    email: string;
    name?: string;
    skills: { name: string; level?: SkillLevel }[];
    courses: { code: string; grade?: string }[];
  }) {
    const { email, name, skills, courses } = params;

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email },
        update: { name },
        create: {
          email,
          name,
          tokenLedger: { create: { tokens: 1, reason: 'initial_grant' } },
        },
      });

      // upsert skills
      for (const s of skills) {
        const skillSlug = toSlug(s.name); // avoid shadowing
        const skill = await tx.skill.upsert({
          where: { slug: skillSlug },
          update: {},
          create: { slug: skillSlug, name: s.name },
        });
        await tx.userSkill.upsert({
          where: { userId_skillId: { userId: user.id, skillId: skill.id } },
          update: { level: s.level ?? 'ADVANCED' },
          create: { userId: user.id, skillId: skill.id, level: s.level ?? 'ADVANCED' },
        });
      }

      // upsert A-grade courses
      for (const c of courses) {
        const code = c.code.toUpperCase();
        const grade = c.grade ?? 'A';
        await tx.userCourse.upsert({
          where: { userId_courseCode: { userId: user.id, courseCode: code } },
          update: { grade },
          create: { userId: user.id, courseCode: code, grade },
        });
      }

      await tx.user.update({ where: { id: user.id }, data: { isOnboarded: true } });

      return tx.user.findUnique({
        where: { id: user.id },
        include: { userSkills: { include: { skill: true } }, userCourses: true },
      });
    });
  }

  async addSkill(email: string, name: string, level: SkillLevel = 'ADVANCED') {
    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, tokenLedger: { create: { tokens: 1, reason: 'initial_grant' } } },
    });

    const skill = await this.prisma.skill.upsert({
      where: { slug: toSlug(name) },
      update: {},
      create: { slug: toSlug(name), name },
    });

    await this.prisma.userSkill.upsert({
      where: { userId_skillId: { userId: user.id, skillId: skill.id } },
      update: { level },
      create: { userId: user.id, skillId: skill.id, level },
    });

    return this.profile(email);
  }

  async removeSkill(email: string, name: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return this.profile(email);

    const skill = await this.prisma.skill.findUnique({ where: { slug: toSlug(name) } });
    if (!skill) return this.profile(email);

    await this.prisma.userSkill.deleteMany({ where: { userId: user.id, skillId: skill.id } });
    return this.profile(email);
  }

  async addCourse(email: string, code: string, grade = 'A') {
    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, tokenLedger: { create: { tokens: 1, reason: 'initial_grant' } } },
    });

    const upper = code.toUpperCase();
    await this.prisma.userCourse.upsert({
      where: { userId_courseCode: { userId: user.id, courseCode: upper } },
      update: { grade },
      create: { userId: user.id, courseCode: upper, grade },
    });

    return this.profile(email);
  }

  async removeCourse(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return this.profile(email);

    await this.prisma.userCourse.deleteMany({
      where: { userId: user.id, courseCode: code.toUpperCase() },
    });

    return this.profile(email);
  }
}
