-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "joinedAt" TIMESTAMP(3),
ADD COLUMN     "leftAt" TIMESTAMP(3);
