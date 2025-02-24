import type { HealthInquiry, DoctorMatch, Appointment, TimeSlot, Doctor } from '../types';

const testData = {
  patient: {
    name: 'Anna Mueller',
    inquiry: {
      symptoms: 'Headache',
      urgency: 'medium' as const
    }
  },
  doctor: {
    id: 'd1',
    name: 'Dr. Smith',
    speciality: 'Neurology',
    availability: ['2024-03-20T10:00:00Z']
  }
};

module.exports = {
  testData
}; 