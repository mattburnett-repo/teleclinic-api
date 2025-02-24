import { Router } from 'express'
import { 
  getAvailableDoctors, 
  getDoctorAvailability,
  bookTimeSlot,
  findMatchingDoctor
} from '../services/doctor.js'
import { ApiError } from '../middleware/errorHandler.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { speciality } = req.query
    const doctors = await getAvailableDoctors(speciality as string)
    res.json(doctors)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const doctor = await getAvailableDoctors(req.params.id)
    if (!doctor) {
      throw new ApiError(404, 'Doctor not found')
    }
    res.json(doctor[0])
  } catch (err) {
    next(err)
  }
})

router.get('/:id/availability', async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, 'Doctor ID is required')
    }
    try {
      const availability = await getDoctorAvailability(req.params.id)
      res.json(availability)
    } catch (err) {
      throw new ApiError(404, 'Doctor not found')
    }
  } catch (err) {
    next(err)
  }
})

router.post('/:id/book', async (req, res, next) => {
  try {
    const { timeSlot } = req.body
    if (!timeSlot) {
      throw new ApiError(400, 'Time slot is required')
    }
    try {
      const booking = await bookTimeSlot(req.params.id, timeSlot)
      res.json(booking)
    } catch (err) {
      throw new ApiError(400, 'Invalid time slot')
    }
  } catch (err) {
    next(err)
  }
})

router.post('/match', async (req, res, next) => {
  try {
    const { symptoms } = req.body
    if (!symptoms) {
      throw new ApiError(400, 'Symptoms are required')
    }
    const match = await findMatchingDoctor({ symptoms })
    res.json(match)
  } catch (err) {
    next(err)
  }
})

export default router 