import { Router } from 'express'
import healthInquiryRoutes from './healthInquiry.js'
import doctorRoutes from './doctor.js'
import appointmentRoutes from './appointment.js'
import patientRecordRoutes from './patientRecord.js'
import { errorHandler } from '../middleware/errorHandler.js'

const router = Router()

router.use('/api/inquiries', healthInquiryRoutes)
router.use('/api/doctors', doctorRoutes)
router.use('/api/appointments', appointmentRoutes)
router.use('/api/patients', patientRecordRoutes)

// Error handling middleware
router.use(errorHandler)

export default router 