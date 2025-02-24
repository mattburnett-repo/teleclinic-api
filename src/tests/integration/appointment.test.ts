import { 
  scheduleAppointment,
  getDoctorTimeSlots,
  confirmAppointment,
  getAppointment
} from '../../services/appointment'
import { createInquiry } from '../../services/healthInquiry'
import { PrismaClient } from '@prisma/client'
import { createTestDoctor, TEST_DOCTOR_ID, TEST_TIME_SLOTS, getTestDoctor, createTestInquiry, TEST_SYMPTOMS } from '../shared'

const prisma = new PrismaClient()

describe('Appointment Integration', () => {
  beforeEach(async () => {
    await createTestDoctor()
  })

  describe('Appointment Creation', () => {
    it('should schedule an appointment', async () => {
      const doctor = await getTestDoctor()
      
      const inquiry = await createTestInquiry()
      const appointment = await scheduleAppointment(doctor.id, inquiry.id, TEST_TIME_SLOTS[0])
      
      expect(appointment.doctorId).toBe(doctor.id)
      expect(appointment.inquiryId).toBe(inquiry.id)
      expect(appointment.status).toBe('scheduled')
      expect(appointment.confirmed).toBe(false)
      
      // Verify appointment was created in database
      const savedAppointment = await prisma.appointment.findUnique({
        where: { id: appointment.id }
      })
      expect(savedAppointment).toBeDefined()
    })

    it('should fail when no time slots available', async () => {
      const doctor = await getTestDoctor()
      
      const inquiry1 = await createTestInquiry('Patient 1', TEST_SYMPTOMS.HEADACHE)
      const inquiry2 = await createTestInquiry('Patient 2', TEST_SYMPTOMS.MIGRAINE)
      
      await scheduleAppointment(doctor.id, inquiry1.id, TEST_TIME_SLOTS[0])
      await scheduleAppointment(doctor.id, inquiry2.id, TEST_TIME_SLOTS[1])
      
      const inquiry3 = await createInquiry('Patient 3', 'Headache')
      await expect(scheduleAppointment(doctor.id, inquiry3.id, TEST_TIME_SLOTS[0]))
        .rejects
        .toThrow('No available time slots')
    })
  })

  describe('Appointment Management', () => {
    it('should confirm appointment', async () => {
      const doctor = await getTestDoctor()
      
      const inquiry = await createTestInquiry()
      const appointment = await scheduleAppointment(doctor.id, inquiry.id, TEST_TIME_SLOTS[0])
      
      const confirmed = await confirmAppointment(appointment.id)
      expect(confirmed.confirmed).toBe(true)
    })

    it('should list available time slots', async () => {
      const doctor = await getTestDoctor()
      
      const slots = await getDoctorTimeSlots(doctor.id)
      
      expect(slots.map(s => s.time)).toEqual(TEST_TIME_SLOTS)
      expect(slots[0]).toHaveProperty('time')
      expect(slots[0]).toHaveProperty('available')
    })

    it('should remove booked time slot from availability', async () => {
      const doctor = await getTestDoctor()
      
      const inquiry = await createInquiry('Test Patient', 'Headache')
      const appointment = await scheduleAppointment(doctor.id, inquiry.id, TEST_TIME_SLOTS[0])
      
      const slots = await getDoctorTimeSlots(doctor.id)
      expect(slots.map(s => s.time)).toEqual([TEST_TIME_SLOTS[1]])
    })
  })
}) 