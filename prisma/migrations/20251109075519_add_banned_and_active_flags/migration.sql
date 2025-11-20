-- AlterTable
ALTER TABLE "ServiceOffer" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
