-- CreateTable
CREATE TABLE "tbl_recordatorio" (
    "rec_id" TEXT NOT NULL,
    "prescription_id" TEXT NOT NULL,
    "scheduled_time" TEXT NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_recordatorio_pkey" PRIMARY KEY ("rec_id")
);

-- CreateTable
CREATE TABLE "tbl_prescription_time" (
    "id" TEXT NOT NULL,
    "prescription_id" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "tbl_prescription_time_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tbl_recordatorio_prescription_id_idx" ON "tbl_recordatorio"("prescription_id");

-- CreateIndex
CREATE INDEX "tbl_recordatorio_scheduled_time_idx" ON "tbl_recordatorio"("scheduled_time");

-- AddForeignKey
ALTER TABLE "tbl_recordatorio" ADD CONSTRAINT "tbl_recordatorio_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "tbl_prescription"("prescription_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_prescription_time" ADD CONSTRAINT "tbl_prescription_time_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "tbl_prescription"("prescription_id") ON DELETE RESTRICT ON UPDATE CASCADE;
