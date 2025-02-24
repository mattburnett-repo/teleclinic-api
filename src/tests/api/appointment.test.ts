import request from 'supertest'
import express from 'express'
import routes from '../../routes'
import { 
  createTestDoctor, 
  createTestInquiry,
  TEST_DOCTOR_ID,
  TEST_TIME_SLOTS
} from '../shared'

const app = express()
app.use(express.json())
app.use(routes)

describe('Appointment API', () => {
  beforeEach(async () => {
    await createTestDoctor()
  })

  describe('POST /api/appointments', () => {
    it('should schedule an appointment', async () => {
      const inquiry = await createTestInquiry()

      const response = await request(app)
        .post('/api/appointments')
        .send({
          doctorId: TEST_DOCTOR_ID,
          inquiryId: inquiry.id,
          time: TEST_TIME_SLOTS[0]
        })
        .expect(200)

      expect(response.body).toHaveProperty('id')
      expect(response.body.doctorId).toBe(TEST_DOCTOR_ID)
      expect(response.body.inquiryId).toBe(inquiry.id)
    })

    it('should return 400 when missing required fields', async () => {
      await request(app)
        .post('/api/appointments')
        .send({
          doctorId: TEST_DOCTOR_ID
          // missing inquiryId
        })
        .expect(400)
    })

    it('should return 404 for non-existent doctor', async () => {
      const inquiry = await createTestInquiry()
      await request(app)
        .post('/api/appointments')
        .send({
          doctorId: 'non-existent-doctor',
          inquiryId: inquiry.id
        })
        .expect(404)
    })

    it('should return 404 for non-existent inquiry', async () => {
      await request(app)
        .post('/api/appointments')
        .send({
          doctorId: TEST_DOCTOR_ID,
          inquiryId: 'non-existent-inquiry'
        })
        .expect(404)
    })
  })

  describe('GET /api/appointments/:id', () => {
    it('should get appointment details', async () => {
      const inquiry = await createTestInquiry()
      const createRes = await request(app)
        .post('/api/appointments')
        .send({
          doctorId: TEST_DOCTOR_ID,
          inquiryId: inquiry.id,
          time: TEST_TIME_SLOTS[0]
        })

      const response = await request(app)
        .get(`/api/appointments/${createRes.body.id}`)
        .expect(200)

      expect(response.body.id).toBe(createRes.body.id)
    })

    it('should return 404 for non-existent appointment', async () => {
      await request(app)
        .get('/api/appointments/non-existent')
        .expect(404)
    })
  })

  describe('PUT /api/appointments/:id/confirm', () => {
    it('should confirm appointment', async () => {
      const inquiry = await createTestInquiry()
      const createRes = await request(app)
        .post('/api/appointments')
        .send({
          doctorId: TEST_DOCTOR_ID,
          inquiryId: inquiry.id,
          time: TEST_TIME_SLOTS[0]
        })

      const response = await request(app)
        .put(`/api/appointments/${createRes.body.id}/confirm`)
        .expect(200)

      expect(response.body.confirmed).toBe(true)
    })
  })
}) 