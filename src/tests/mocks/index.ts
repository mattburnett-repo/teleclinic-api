import { jest } from '@jest/globals'
import type { HealthInquiry, DoctorMatch } from '../../types'

// Single source of mock data
export const mockData = {
  patient: {
    name: 'Anna Mueller',
    inquiry: {
      symptoms: 'Headache',
      urgency: 'medium' as const
    }
  },
  healthInquiry: {
    id: '123',
    patientName: 'Anna Mueller',
    symptoms: 'Headache',
    urgency: 'medium' as const,
    status: 'pending' as const
  },
  doctor: {
    id: 'd1',
    name: 'Dr. Smith',
    speciality: 'Neurology',
    availability: ['2024-03-20T10:00:00Z']
  }
};

// Service mocks with proper return types
export const mockServices = {
  createInquiry: jest.fn<(patientName: string, symptoms: string) => Promise<HealthInquiry>>()
    .mockResolvedValue(mockData.healthInquiry as HealthInquiry),
  matchDoctorToInquiry: jest.fn<(inquiryId: string) => Promise<DoctorMatch>>()
    .mockResolvedValue({
      doctorId: mockData.doctor.id,
      inquiryId: mockData.healthInquiry.id
    } as DoctorMatch)
}; 