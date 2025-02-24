import { Router } from 'express'
import { getPatientRecord, getPatientVisits } from '../services/patientRecord.js'
import { ApiError } from '../middleware/errorHandler.js'

const router = Router()

router.get('/:name/records', async (req, res, next) => {
  try {
    if (!req.params.name) {
      throw new ApiError(400, 'Patient name is required')
    }
    const record = await getPatientRecord(req.params.name)
    res.json(record)
  } catch (err) {
    next(err)
  }
})

router.get('/:name/visits', async (req, res, next) => {
  try {
    if (!req.params.name) {
      throw new ApiError(400, 'Patient name is required')
    }
    const visits = await getPatientVisits(req.params.name)
    res.json(visits)
  } catch (err) {
    next(err)
  }
})

export default router 