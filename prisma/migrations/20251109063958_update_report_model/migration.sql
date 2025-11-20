/*
  Warnings:

  - You are about to drop the column `reportedPostId` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `ServiceCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reportedId` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reporterId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "reportedPostId",
ADD COLUMN     "reportedId" TEXT NOT NULL,
ADD COLUMN     "reporterId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_name_key" ON "ServiceCategory"("name");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedId_fkey" FOREIGN KEY ("reportedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
