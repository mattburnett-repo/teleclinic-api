import { PrismaClient } from '@prisma/client'
import type { HealthInquiry, DoctorMatch } from '../types'

const prisma = new PrismaClient()

export async function createInquiry(patientName: string, symptoms: string): Promise<HealthInquiry> {
  const inquiry = await prisma.healthInquiry.create({
    data: {
      patientName,
      symptoms,
      urgency: 'medium',
      status: 'pending'
    }
  })
  return inquiry as HealthInquiry
}

export async function matchDoctorToInquiry(inquiryId: string): Promise<DoctorMatch> {
  const match = await prisma.doctorMatch.create({
    data: {
      inquiryId,
      doctorId: 'd1', // We'll implement proper matching logic later
    }
  })
  return match as DoctorMatch
}

export async function getPatientInquiries(patientName: string): Promise<HealthInquiry[]> {
  const inquiries = await prisma.healthInquiry.findMany({
    where: { patientName }
  })
  return inquiries as HealthInquiry[]
}

export async function getInquiry(id: string): Promise<HealthInquiry> {
  const inquiry = await prisma.healthInquiry.findUnique({
    where: { id }
  })
  if (!inquiry) throw new Error('Inquiry not found')
  return inquiry as HealthInquiry
} 