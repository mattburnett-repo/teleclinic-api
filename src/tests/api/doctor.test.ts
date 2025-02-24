import request from 'supertest'
import express from 'express'
import routes from '../../routes'
import { createTestDoctor, TEST_DOCTOR_ID, TEST_SYMPTOMS, TEST_TIME_SLOTS } from '../shared'

const app = express()
app.use(express.json())
app.use(routes)

describe('Doctor API', () => {
  beforeEach(async () => {
    await createTestDoctor()
  })

  describe('GET /api/doctors', () => {
    it('should list available doctors', async () => {
      const response = await request(app)
        .get('/api/doctors')
        .expect(200)

      expect(response.body).toHaveLength(1)
      expect(response.body[0].id).toBe(TEST_DOCTOR_ID)
    })
  })

  describe('GET /api/doctors/:id/availability', () => {
    it('should get doctor availability', async () => {
      const response = await request(app)
        .get(`/api/doctors/${TEST_DOCTOR_ID}/availability`)
        .expect(200)

      expect(response.body).toEqual(TEST_TIME_SLOTS)
    })

    it('should return 404 for non-existent doctor', async () => {
      await request(app)
        .get('/api/doctors/non-existent/availability')
        .expect(404)
    })
  })

  describe('POST /api/doctors/:id/book', () => {
    it('should book a time slot', async () => {
      const response = await request(app)
        .post(`/api/doctors/${TEST_DOCTOR_ID}/book`)
        .send({ timeSlot: TEST_TIME_SLOTS[0] })
        .expect(200)

      expect(response.body.confirmed).toBe(true)
    })

    it('should return 400 for invalid time slot', async () => {
      await request(app)
        .post(`/api/doctors/${TEST_DOCTOR_ID}/book`)
        .send({ timeSlot: 'invalid-time' })
        .expect(400)
    })
  })

  describe('POST /api/doctors/match', () => {
    it('should match doctor based on symptoms', async () => {
      const response = await request(app)
        .post('/api/doctors/match')
        .send({ symptoms: TEST_SYMPTOMS.HEADACHE })
        .expect(200)

      expect(response.body).toHaveProperty('doctorId')
      expect(response.body).toHaveProperty('speciality')
    })

    it('should return 400 when symptoms missing', async () => {
      await request(app)
        .post('/api/doctors/match')
        .send({})
        .expect(400)
    })
  })
}) 