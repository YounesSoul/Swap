-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('ONLINE', 'FACE_TO_FACE');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "meetingLink" TEXT,
ADD COLUMN     "sessionType" "SessionType";

-- AlterTable
ALTER TABLE "TimeSlot" ADD COLUMN     "sessionType" "SessionType" NOT NULL DEFAULT 'ONLINE';
