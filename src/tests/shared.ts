import type { HealthInquiry } from '../types';
import { mockData } from './mocks';
import { PrismaClient } from '@prisma/client'
import { createInquiry } from '../services/healthInquiry'

const prisma = new PrismaClient()

// Test Constants
export const TEST_DOCTOR_ID = 'test-doctor'
export const TEST_TIME_SLOTS = ['2024-03-21T10:00:00Z', '2024-03-22T10:00:00Z']
export const TEST_PATIENT_NAME = 'Test Patient'
export const TEST_DOCTOR_NAME = 'Dr. Smith'
export const TEST_SPECIALITY = 'Neurology'
export const TEST_SYMPTOMS = {
  HEADACHE: 'Headache',
  FEVER: 'Fever',
  MIGRAINE: 'Migraine'
}

// Database Helpers
export async function getTestDoctor() {
  const doctor = await prisma.doctor.findUnique({ where: { id: TEST_DOCTOR_ID } })
  if (!doctor) throw new Error('Test doctor not found')
  return doctor
}

export async function createTestDoctor() {
  // Delete related records first
  await prisma.$transaction(async (tx) => {
    await tx.doctorMatch.deleteMany({
      where: { doctorId: TEST_DOCTOR_ID }
    })
    await tx.appointment.deleteMany({
      where: { doctorId: TEST_DOCTOR_ID }
    })
    await tx.healthInquiry.deleteMany({
      where: { patientName: TEST_PATIENT_NAME }
    })
    await tx.doctor.deleteMany({
      where: { id: TEST_DOCTOR_ID }
    })
  })

  return await prisma.doctor.create({
    data: {
      id: TEST_DOCTOR_ID,
      name: TEST_DOCTOR_NAME,
      speciality: TEST_SPECIALITY,
      availability: TEST_TIME_SLOTS,
      rating: 4.8,
      experience: 10
    }
  })
}

export async function createTestInquiry(patientName = TEST_PATIENT_NAME, symptoms = TEST_SYMPTOMS.HEADACHE) {
  return await createInquiry(patientName, symptoms)
}

export async function createTestDoctorMatch(inquiryId: string) {
  const doctor = await getTestDoctor()
  return await prisma.doctorMatch.create({
    data: {
      doctorId: doctor.id,
      inquiryId
    }
  })
}

// Mock Data & Utils (for unit tests)
export const utils = {
  createTestInquiry: async (): Promise<HealthInquiry> => {
    return mockData.healthInquiry;
  },
  
  matchDoctorToInquiry: async (inquiryId: string) => {
    return {
      doctorId: mockData.doctor.id,
      inquiryId
    };
  },

  getPatientInquiries: async (patientName: string) => {
    return [mockData.healthInquiry];
  },

  getInquiry: async (id: string) => {
    return {
      ...mockData.healthInquiry,
      id,
      status: 'matched'
    };
  },

  getAvailableDoctors: async () => {
    return [mockData.doctor];
  },

  findMatchingDoctor: async (inquiry: HealthInquiry) => {
    // Map symptoms to specialities like the real service
    const specialityMap: Record<string, string> = {
      'Headache': 'Neurology',
      'Back Pain': 'Orthopedics',
      'Fever': 'Internal Medicine',
      'Anxiety': 'Psychiatry'
    };

    const speciality = specialityMap[inquiry.symptoms] || 'General Practice';

    return {
      doctorId: mockData.doctor.id,
      speciality
    };
  },

  bookTimeSlot: async (doctorId: string, timeSlot: string) => {
    // Update mock data to remove the booked slot
    mockData.doctor.availability = mockData.doctor.availability.filter(
      slot => slot !== timeSlot
    );
    
    return {
      doctorId,
      time: timeSlot,
      confirmed: true
    };
  },

  getDoctorAvailability: async (doctorId: string) => {
    return mockData.doctor.availability;
  },

  getPatientRecord: async (patientName: string) => {
    return {
      patientName,
      medicalHistory: [],
      lastVisit: null,
      inquiries: [mockData.healthInquiry]
    };
  },

  getPatientVisits: async (patientName: string) => {
    return [{
      doctorName: mockData.doctor.name,
      date: '2024-03-20T10:00:00Z',
      reason: 'Headache'
    }];
  },

  scheduleAppointment: async (doctorId: string, inquiryId: string) => {
    return {
      id: 'apt1',
      doctorId,
      inquiryId,
      time: '2024-03-20T10:00:00Z',
      status: 'scheduled',
      confirmed: true
    };
  },

  getDoctorTimeSlots: async (doctorId: string) => {
    return [{
      time: '2024-03-20T10:00:00Z',
      available: true
    }];
  }
};

export const testData = mockData; 