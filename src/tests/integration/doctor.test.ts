import { scheduleAppointment } from '../../services/appointment'
import { 
  getAvailableDoctors,
  findMatchingDoctor,
  bookTimeSlot,
  getDoctorAvailability
} from '../../services/doctor'
import { PrismaClient } from '@prisma/client'
import { 
  createTestDoctor, 
  TEST_DOCTOR_ID, 
  TEST_TIME_SLOTS,
  TEST_SYMPTOMS,
  TEST_SPECIALITY 
} from '../shared'

const prisma = new PrismaClient()

describe('Doctor Integration', () => {
  beforeEach(async () => {
    await createTestDoctor()
  })

  describe('Doctor Availability', () => {
    it('should list available doctors', async () => {
      const doctors = await getAvailableDoctors()
      expect(doctors).toHaveLength(1)
      expect(doctors[0].id).toBe(TEST_DOCTOR_ID)
      expect(doctors[0].name).toBe('Dr. Smith')
    })

    it('should book and remove time slot', async () => {
      const doctor = await createTestDoctor()
      const timeSlot = TEST_TIME_SLOTS[0]
      const booking = await bookTimeSlot(doctor.id, timeSlot)
      
      expect(booking.confirmed).toBe(true)
      const availability = await getDoctorAvailability(doctor.id)
      expect(availability).toEqual([TEST_TIME_SLOTS[1]])
    })
  })

  describe('Doctor Matching', () => {
    it('should match doctor based on symptoms', async () => {
      const inquiry = {
        symptoms: TEST_SYMPTOMS.HEADACHE
      }
      
      const match = await findMatchingDoctor(inquiry)
      
      expect(match.speciality).toBe(TEST_SPECIALITY)
    })
  })

  it('should fail when booking unavailable time slot', async () => {
    const doctor = await createTestDoctor()
    
    const timeSlot = 'invalid-time'
    
    await expect(bookTimeSlot(doctor.id, timeSlot))
      .rejects
      .toThrow('Time slot not available')
  })
}) 