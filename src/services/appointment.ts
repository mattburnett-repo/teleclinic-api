import { PrismaClient } from '@prisma/client'
import type { Appointment, TimeSlot } from '../types'

const prisma = new PrismaClient()

export async function scheduleAppointment(doctorId: string, inquiryId: string, time: string): Promise<Appointment> {
  // Get doctor's first available slot
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId }
  })
  if (!doctor || doctor.availability.length === 0) {
    throw new Error('No available time slots')
  }

  // Check for existing appointments in this time slot
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      doctorId,
      time: doctor.availability[0]
    }
  })

  if (existingAppointment) {
    throw new Error('Time slot already booked')
  }

  return await prisma.$transaction(async (tx) => {
    // Create appointment with first available time slot
    const appointment = await tx.appointment.create({
      data: {
        doctorId,
        inquiryId,
        time,
        status: 'scheduled',
        confirmed: false
      }
    })
    
    // Update doctor availability
    await tx.doctor.update({
      where: { id: doctorId },
      data: {
        availability: {
          set: doctor.availability.filter(slot => slot !== time)
        }
      }
    })
    
    return appointment as Appointment
  })
}

export async function getDoctorTimeSlots(doctorId: string): Promise<TimeSlot[]> {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId }
  })
  
  if (!doctor) throw new Error('Doctor not found')
  
  return doctor.availability.map(time => ({
    time,
    available: true
  }))
}

export async function confirmAppointment(appointmentId: string): Promise<Appointment> {
  const appointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { confirmed: true }
  })
  
  return appointment as Appointment
}

export async function getAppointment(appointmentId: string): Promise<Appointment> {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId }
  })
  
  if (!appointment) throw new Error('Appointment not found')
  return appointment as Appointment
} 