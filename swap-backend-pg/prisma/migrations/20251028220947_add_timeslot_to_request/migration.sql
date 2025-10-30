-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "timeSlotId" TEXT;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
