import { PrismaClient } from '@prisma/client'
import type { PatientRecord, PatientVisit } from '../types'

const prisma = new PrismaClient()

export async function getPatientRecord(patientName: string): Promise<PatientRecord> {
  // Get all inquiries for patient
  const inquiries = await prisma.healthInquiry.findMany({
    where: { patientName },
    include: {
      doctorMatch: {
        include: {
          doctor: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // Get all appointments through inquiries
  const appointments = await prisma.appointment.findMany({
    where: {
      inquiryId: {
        in: inquiries.map(i => i.id)
      }
    },
    orderBy: {
      time: 'desc'
    }
  })

  return {
    patientName,
    medicalHistory: inquiries.map(i => ({
      date: i.createdAt,
      symptoms: i.symptoms,
      doctorName: i.doctorMatch?.doctor?.name
    })),
    lastVisit: appointments.length > 0 ? appointments[0].time : null,
    inquiries: inquiries.map(i => ({
      id: i.id,
      patientName: i.patientName,
      symptoms: i.symptoms,
      urgency: i.urgency as 'low' | 'medium' | 'high',
      status: i.status as 'pending' | 'matched' | 'scheduled'
    }))
  }
}

export async function getPatientVisits(patientName: string): Promise<PatientVisit[]> {
  const inquiries = await prisma.healthInquiry.findMany({
    where: { patientName },
    include: {
      doctorMatch: {
        include: {
          doctor: true
        }
      }
    }
  })

  const appointments = await prisma.appointment.findMany({
    where: {
      inquiryId: {
        in: inquiries.map(i => i.id)
      },
      confirmed: true
    }
  })

  return appointments.map(apt => {
    const inquiry = inquiries.find(i => i.id === apt.inquiryId)
    return {
      doctorName: inquiry?.doctorMatch?.doctor.name || 'Unknown Doctor',
      date: apt.time,
      reason: inquiry?.symptoms || 'Unknown'
    }
  })
} 