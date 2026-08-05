/*
  Warnings:

  - You are about to drop the column `jobCardId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `jobCardId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `jobCardId` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the `JobCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobCardService` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobId` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_jobCardId_fkey";

-- DropForeignKey
ALTER TABLE "JobCard" DROP CONSTRAINT "JobCard_customerId_fkey";

-- DropForeignKey
ALTER TABLE "JobCard" DROP CONSTRAINT "JobCard_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "JobCardService" DROP CONSTRAINT "JobCardService_jobCardId_fkey";

-- DropForeignKey
ALTER TABLE "JobCardService" DROP CONSTRAINT "JobCardService_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_jobCardId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_jobCardId_fkey";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "jobCardId",
ADD COLUMN     "jobId" TEXT NOT NULL,
ADD COLUMN     "paidTo" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "jobCardId",
ADD COLUMN     "jobId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "jobCardId",
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "jobId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "JobCard";

-- DropTable
DROP TABLE "JobCardService";

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "jobNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL,
    "estimatedTotal" DOUBLE PRECISION NOT NULL,
    "advanceAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expenseAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDeliveryAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobService" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "quotedPrice" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,

    CONSTRAINT "JobService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobNumber_key" ON "Job"("jobNumber");

-- CreateIndex
CREATE INDEX "Job_customerId_idx" ON "Job"("customerId");

-- CreateIndex
CREATE INDEX "Job_vehicleId_idx" ON "Job"("vehicleId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Vehicle_customerId_idx" ON "Vehicle"("customerId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobService" ADD CONSTRAINT "JobService_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobService" ADD CONSTRAINT "JobService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
