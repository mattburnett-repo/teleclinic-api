import { Router } from 'express'
import { createInquiry, getInquiry, getPatientInquiries } from '../services/healthInquiry.js'
import { ApiError } from '../middleware/errorHandler.js'

const router = Router()

router.post('/', async (req, res, next) => {
  try {
    const { patientName, symptoms } = req.body
    if (!patientName || !symptoms) {
      throw new ApiError(400, 'Patient name and symptoms are required')
    }
    const inquiry = await createInquiry(patientName, symptoms)
    res.json(inquiry)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, 'Inquiry ID is required')
    }
    try {
      const inquiry = await getInquiry(req.params.id)
      res.json(inquiry)
    } catch (err) {
      throw new ApiError(404, 'Inquiry not found')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/patient/:name', async (req, res, next) => {
  try {
    if (!req.params.name) {
      throw new ApiError(400, 'Patient name is required')
    }
    const inquiries = await getPatientInquiries(req.params.name)
    res.json(inquiries)
  } catch (err) {
    next(err)
  }
})

export default router 