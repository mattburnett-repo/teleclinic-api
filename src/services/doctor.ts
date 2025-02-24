import { PrismaClient } from '@prisma/client'
import type { Doctor, TimeSlot } from '../types'

const prisma = new PrismaClient()

const SYMPTOM_SPECIALITY_MAP: Record<string, string> = {
  headache: 'Neurology',
  migraine: 'Neurology',
  backpain: 'Orthopedics',
  jointpain: 'Orthopedics',
  fever: 'Internal Medicine',
  cough: 'Internal Medicine',
  anxiety: 'Psychiatry',
  depression: 'Psychiatry',
  default: 'General Practice'
};

function determineSpeciality(symptoms: string): string {
  const normalizedSymptoms = symptoms.toLowerCase().replace(/\s+/g, '');
  return SYMPTOM_SPECIALITY_MAP[normalizedSymptoms] || SYMPTOM_SPECIALITY_MAP.default;
}

export async function getAvailableDoctors(speciality?: string) {
  return prisma.doctor.findMany({
    where: speciality ? {
      OR: [
        { speciality: speciality },
        { id: speciality }
      ],
      availability: {
        isEmpty: false
      }
    } : {
      availability: {
        isEmpty: false
      }
    }
  })
}

export async function findMatchingDoctor(inquiry: { symptoms: string }): Promise<{ doctorId: string; speciality: string }> {
  const requiredSpeciality = determineSpeciality(inquiry.symptoms);
  
  const doctor = await prisma.doctor.findFirst({
    where: {
      speciality: requiredSpeciality,
      availability: {
        isEmpty: false
      }
    }
  })
  
  if (!doctor) throw new Error('No available doctors found')
  
  return {
    doctorId: doctor.id,
    speciality: doctor.speciality
  }
}

export async function bookTimeSlot(doctorId: string, timeSlot: string): Promise<{ confirmed: boolean }> {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId }
  })
  
  if (!doctor) throw new Error('Time slot not available')
  if (!doctor.availability.includes(timeSlot)) throw new Error('Time slot not available')
  
  await prisma.doctor.update({
    where: { id: doctorId },
    data: {
      availability: {
        set: doctor.availability.filter(slot => slot !== timeSlot)
      }
    }
  })
  
  return { confirmed: true }
}

export async function getDoctorAvailability(doctorId: string): Promise<string[]> {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId }
  })
  
  if (!doctor) throw new Error('No available time slots')
  return doctor.availability
} 