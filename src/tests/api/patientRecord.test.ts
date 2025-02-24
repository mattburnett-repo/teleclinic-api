import request from 'supertest'
import express from 'express'
import routes from '../../routes'
import { 
  createTestDoctor, 
  createTestInquiry,
  createTestDoctorMatch,
  TEST_PATIENT_NAME,
  TEST_DOCTOR_ID,
  TEST_TIME_SLOTS
} from '../shared'

const app = express()
app.use(express.json())
app.use(routes)

describe('Patient Record API', () => {
  beforeEach(async () => {
    await createTestDoctor()
  })

  describe('GET /api/patients/:name/records', () => {
    it('should get patient medical record', async () => {
      const inquiry = await createTestInquiry()
      await createTestDoctorMatch(inquiry.id)

      const response = await request(app)
        .get(`/api/patients/${TEST_PATIENT_NAME}/records`)
        .expect(200)

      expect(response.body.patientName).toBe(TEST_PATIENT_NAME)
      expect(response.body.inquiries).toHaveLength(1)
      expect(response.body.medicalHistory).toHaveLength(1)
    })

    it('should handle non-existent patient', async () => {
      const response = await request(app)
        .get('/api/patients/non-existent/records')
        .expect(200)  // Returns empty record rather than 404

      expect(response.body.inquiries).toHaveLength(0)
      expect(response.body.medicalHistory).toHaveLength(0)
    })
  })

  describe('GET /api/patients/:name/visits', () => {
    it('should get patient visits', async () => {
      const inquiry = await createTestInquiry()
      await createTestDoctorMatch(inquiry.id)

      const response = await request(app)
        .get(`/api/patients/${TEST_PATIENT_NAME}/visits`)
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })

    it('should show visits with confirmed appointments', async () => {
      const inquiry = await createTestInquiry()
      const appointmentRes = await request(app)
        .post('/api/appointments')
        .send({
          doctorId: TEST_DOCTOR_ID,
          inquiryId: inquiry.id,
          time: TEST_TIME_SLOTS[0]
        })
        .expect(200)

      await request(app)
        .put(`/api/appointments/${appointmentRes.body.id}/confirm`)
        .expect(200)

      const response = await request(app)
        .get(`/api/patients/${TEST_PATIENT_NAME}/visits`)
        .expect(200)

      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toHaveProperty('doctorName')
    })

    it('should not show unconfirmed appointments as visits', async () => {
      const inquiry = await createTestInquiry()
      await createTestDoctorMatch(inquiry.id)
      
      await request(app)
        .post('/api/appointments')
        .send({
          doctorId: TEST_DOCTOR_ID,
          inquiryId: inquiry.id,
          time: TEST_TIME_SLOTS[0]
        })

      const response = await request(app)
        .get(`/api/patients/${TEST_PATIENT_NAME}/visits`)
        .expect(200)

      expect(response.body).toHaveLength(0)
    })

    it('should return empty array for patient with no visits', async () => {
      const response = await request(app)
        .get('/api/patients/no-visits-patient/visits')
        .expect(200)

      expect(response.body).toHaveLength(0)
    })
  })
}) 