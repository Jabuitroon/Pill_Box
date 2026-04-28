/*
  Warnings:

  - Added the required column `intake_time` to the `tbl_prescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbl_prescription" ADD COLUMN     "intake_time" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
