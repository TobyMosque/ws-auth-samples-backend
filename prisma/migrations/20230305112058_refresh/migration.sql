-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "refreshId" UUID;

-- CreateIndex
CREATE INDEX "Session_refreshId_idx" ON "Session"("refreshId");
