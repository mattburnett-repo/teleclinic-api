import { Router } from 'express'
import { 
  scheduleAppointment, 
  confirmAppointment,
  getAppointment,
  getDoctorTimeSlots
} from '../services/appointment.js'
import { ApiError } from '../middleware/errorHandler.js'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post('/', async (req, res, next) => {
  try {
    const { doctorId, inquiryId, time } = req.body
    if (!doctorId || !inquiryId) {
      throw new ApiError(400, 'Doctor ID and inquiry ID are required')
    }

    // First check if both exist
    const [doctor, inquiry] = await Promise.all([
      prisma.doctor.findUnique({ where: { id: doctorId } }),
      prisma.healthInquiry.findUnique({ where: { id: inquiryId } })
    ])
    
    if (!doctor || !inquiry) {
      throw new ApiError(404, 'Doctor or inquiry not found')
    }

    // Check if doctor has any available slots
    const slots = await getDoctorTimeSlots(doctorId)
    if (slots.length === 0) {
      throw new ApiError(400, 'No available time slots')
    }

    try {
      const appointment = await scheduleAppointment(doctorId, inquiryId, time)
      res.json(appointment)
    } catch (err: any) {
      if (err.message === 'Time slot already booked') {
        throw new ApiError(400, 'Time slot already booked')
      }
      throw err
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, 'Appointment ID is required')
    }
    try {
      const appointment = await getAppointment(req.params.id)
      if (!appointment) {
        throw new ApiError(404, 'Appointment not found')
      }
      res.json(appointment)
    } catch (err) {
      throw new ApiError(404, 'Appointment not found')
    }
  } catch (err) {
    next(err)
  }
})

router.put('/:id/confirm', async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, 'Appointment ID is required')
    }
    const appointment = await confirmAppointment(req.params.id)
    res.json(appointment)
  } catch (err) {
    next(err)
  }
})

router.get('/doctor/:id/slots', async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, 'Doctor ID is required')
    }
    const slots = await getDoctorTimeSlots(req.params.id)
    res.json(slots)
  } catch (err) {
    next(err)
  }
})

export default router 