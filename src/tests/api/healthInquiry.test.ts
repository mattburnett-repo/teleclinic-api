import request from 'supertest'
import express from 'express'
import routes from '../../routes'
import { TEST_PATIENT_NAME, TEST_SYMPTOMS } from '../shared'

const app = express()
app.use(express.json())
app.use(routes)

describe('Health Inquiry API', () => {
  beforeEach(async () => {
  })

  describe('POST /api/inquiries', () => {
    it('should create a new health inquiry', async () => {
      const response = await request(app)
        .post('/api/inquiries')
        .send({
          patientName: TEST_PATIENT_NAME,
          symptoms: TEST_SYMPTOMS.HEADACHE
        })
        .expect(200)

      expect(response.body).toHaveProperty('id')
      expect(response.body.patientName).toBe(TEST_PATIENT_NAME)
      expect(response.body.symptoms).toBe(TEST_SYMPTOMS.HEADACHE)
    })

    it('should return 400 when missing required fields', async () => {
      await request(app)
        .post('/api/inquiries')
        .send({
          patientName: TEST_PATIENT_NAME
          // missing symptoms
        })
        .expect(400)
    })
  })

  describe('GET /api/inquiries/:id', () => {
    it('should get an inquiry by id', async () => {
      // First create an inquiry
      const createRes = await request(app)
        .post('/api/inquiries')
        .send({
          patientName: TEST_PATIENT_NAME,
          symptoms: TEST_SYMPTOMS.HEADACHE
        })

      // Then fetch it
      const response = await request(app)
        .get(`/api/inquiries/${createRes.body.id}`)
        .expect(200)

      expect(response.body.id).toBe(createRes.body.id)
      expect(response.body.patientName).toBe(TEST_PATIENT_NAME)
    })

    it('should return 404 for non-existent inquiry', async () => {
      await request(app)
        .get('/api/inquiries/non-existent-id')
        .expect(404)
    })
  })
}) 