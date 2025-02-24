import { 
  createInquiry, 
  matchDoctorToInquiry, 
  getPatientInquiries,
  getInquiry 
} from '../../services/healthInquiry'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Health Inquiry Integration', () => {
  beforeEach(async () => {
    // Clear test data
    await prisma.doctorMatch.deleteMany()
    await prisma.healthInquiry.deleteMany()
    await prisma.doctor.deleteMany()
  })

  it('should create and retrieve a health inquiry', async () => {
    const inquiry = await createInquiry('Test Patient', 'Headache')
    
    expect(inquiry.id).toBeDefined()
    expect(inquiry.patientName).toBe('Test Patient')
    expect(inquiry.status).toBe('pending')

    const retrieved = await getInquiry(inquiry.id)
    expect(retrieved).toEqual(inquiry)
  })

  it('should match doctor to inquiry', async () => {
    // Create test doctor first
    await prisma.doctor.create({
      data: {
        id: 'd1',
        name: 'Dr. Smith',
        speciality: 'Neurology',
        availability: ['2024-03-20T10:00:00Z'],
        rating: 4.8,
        experience: 10
      }
    })

    const inquiry = await createInquiry('Test Patient', 'Headache')
    const match = await matchDoctorToInquiry(inquiry.id)

    expect(match.doctorId).toBe('d1')
    expect(match.inquiryId).toBe(inquiry.id)
  })

  it('should list all inquiries for a patient', async () => {
    await createInquiry('Test Patient', 'Headache')
    await createInquiry('Test Patient', 'Fever')

    const inquiries = await getPatientInquiries('Test Patient')

    expect(inquiries).toHaveLength(2)
    expect(inquiries[0].patientName).toBe('Test Patient')
  })

  // Add more integration tests...
}) 