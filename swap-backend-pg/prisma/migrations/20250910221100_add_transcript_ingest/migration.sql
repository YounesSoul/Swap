-- CreateTable
CREATE TABLE "TranscriptIngest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileHash" TEXT NOT NULL,
    "parsedJson" JSONB NOT NULL,
    "addedCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranscriptIngest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TranscriptIngest_userId_createdAt_idx" ON "TranscriptIngest"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "TranscriptIngest" ADD CONSTRAINT "TranscriptIngest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
