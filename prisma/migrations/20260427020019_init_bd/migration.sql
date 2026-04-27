-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'PHYSIOTHERAPIST', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatusEnum" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TimeOfDay" AS ENUM ('MORNING', 'AFTERNOON', 'NIGHT');

-- CreateTable
CREATE TABLE "tbl_user" (
    "user_id" TEXT NOT NULL,
    "usu_name" TEXT NOT NULL,
    "usu_last_name" TEXT NOT NULL,
    "usu_phone" TEXT,
    "usu_email" TEXT NOT NULL,
    "usu_password" TEXT NOT NULL,
    "usu_role" "UserRole" NOT NULL DEFAULT 'PATIENT',
    "usu_avatar" TEXT,
    "status" "UserStatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "emailConfirm" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnable" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "physiotherapist_id" TEXT,

    CONSTRAINT "tbl_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "tbl_pill" (
    "pill_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "tbl_pill_pkey" PRIMARY KEY ("pill_id")
);

-- CreateTable
CREATE TABLE "tbl_prescription" (
    "prescription_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "pill_id" TEXT NOT NULL,
    "pres_schedule" "TimeOfDay" NOT NULL,
    "times_per_day" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_prescription_pkey" PRIMARY KEY ("prescription_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_usu_email_key" ON "tbl_user"("usu_email");

-- CreateIndex
CREATE INDEX "tbl_user_usu_email_idx" ON "tbl_user"("usu_email");

-- CreateIndex
CREATE INDEX "tbl_user_created_at_idx" ON "tbl_user"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_pill_name_key" ON "tbl_pill"("name");

-- AddForeignKey
ALTER TABLE "tbl_user" ADD CONSTRAINT "tbl_user_physiotherapist_id_fkey" FOREIGN KEY ("physiotherapist_id") REFERENCES "tbl_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_prescription" ADD CONSTRAINT "tbl_prescription_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "tbl_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_prescription" ADD CONSTRAINT "tbl_prescription_pill_id_fkey" FOREIGN KEY ("pill_id") REFERENCES "tbl_pill"("pill_id") ON DELETE RESTRICT ON UPDATE CASCADE;
