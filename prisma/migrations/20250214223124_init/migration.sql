-- CreateTable
CREATE TABLE "HealthInquiry" (
    "id" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "urgency" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "speciality" TEXT NOT NULL,
    "availability" TEXT[],
    "imageUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL,
    "experience" INTEGER NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorMatch" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,

    CONSTRAINT "DoctorMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorMatch_inquiryId_key" ON "DoctorMatch"("inquiryId");

-- AddForeignKey
ALTER TABLE "DoctorMatch" ADD CONSTRAINT "DoctorMatch_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorMatch" ADD CONSTRAINT "DoctorMatch_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "HealthInquiry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
