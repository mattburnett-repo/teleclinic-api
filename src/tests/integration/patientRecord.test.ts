import { 
  getPatientRecord,
  getPatientVisits
} from '../../services/patientRecord'
import { createInquiry } from '../../services/healthInquiry'
import { scheduleAppointment } from '../../services/appointment'
import { PrismaClient } from '@prisma/client'
import {
  createTestDoctor,
  getTestDoctor,
  createTestInquiry,
  createTestDoctorMatch,
  TEST_PATIENT_NAME,
  TEST_SYMPTOMS,
  TEST_DOCTOR_NAME
} from '../shared'

const prisma = new PrismaClient()

describe('Patient Record Integration', () => {
  beforeEach(async () => {
    await createTestDoctor()
  })

  describe('Patient Inquiries', () => {
    it('should get patient record with inquiries', async () => {
      const inquiry1 = await createTestInquiry(TEST_PATIENT_NAME, TEST_SYMPTOMS.HEADACHE)
      const inquiry2 = await createTestInquiry(TEST_PATIENT_NAME, TEST_SYMPTOMS.FEVER)

      await createTestDoctorMatch(inquiry1.id)
      await createTestDoctorMatch(inquiry2.id)

      const record = await getPatientRecord(TEST_PATIENT_NAME)
      
      expect(record.patientName).toBe(TEST_PATIENT_NAME)
      expect(record.inquiries).toHaveLength(2)
      expect(record.medicalHistory).toHaveLength(2)
      expect(record.medicalHistory[0]).toHaveProperty('symptoms', TEST_SYMPTOMS.HEADACHE)
    })

    it('should handle patients with no records', async () => {
      const record = await getPatientRecord('New Patient')
      
      expect(record.patientName).toBe('New Patient')
      expect(record.inquiries).toHaveLength(0)
      expect(record.medicalHistory).toHaveLength(0)
      expect(record.lastVisit).toBeNull()
    })
  })

  describe('Doctor Interactions', () => {
    it('should include doctor matches in medical history', async () => {
      const inquiry = await createTestInquiry()
      await createTestDoctorMatch(inquiry.id)

      const record = await getPatientRecord(TEST_PATIENT_NAME)
      expect(record.medicalHistory[0].doctorName).toBe('Dr. Smith')
    })
  })
}) 