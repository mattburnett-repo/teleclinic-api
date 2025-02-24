import { utils, testData } from '../shared';
import type { Doctor, HealthInquiry } from '../../types';

describe('Doctor', () => {
  it('should list available doctors', async () => {
    const doctors = await utils.getAvailableDoctors();
    
    expect(Array.isArray(doctors)).toBe(true);
    expect(doctors[0]).toHaveProperty('id');
    expect(doctors[0]).toHaveProperty('speciality');
    expect(doctors[0]).toHaveProperty('availability');
  });

   it('should match doctor based on symptoms', async () => {
    const cases = [
      { symptoms: 'Headache', expectedSpeciality: 'Neurology' },
      { symptoms: 'Back Pain', expectedSpeciality: 'Orthopedics' },
      { symptoms: 'Fever', expectedSpeciality: 'Internal Medicine' },
      { symptoms: 'Anxiety', expectedSpeciality: 'Psychiatry' },
      { symptoms: 'Unknown Symptom', expectedSpeciality: 'General Practice' }
    ];

    for (const { symptoms, expectedSpeciality } of cases) {
      const inquiry: HealthInquiry = {
        id: '123',
        patientName: 'Test Patient',
        symptoms,
        urgency: 'medium',
        status: 'pending'
      };
      
      const match = await utils.findMatchingDoctor(inquiry);
      expect(match.speciality).toBe(expectedSpeciality);
    }
  });

  it('should match doctor based on speciality', async () => {
    const inquiry: HealthInquiry = {
      id: '123',
      patientName: 'Test Patient',
      symptoms: 'Headache',
      urgency: 'medium',
      status: 'pending'
    };
    
    const match = await utils.findMatchingDoctor(inquiry);
    
    expect(match.doctorId).toBeDefined();
    expect(match.speciality).toBeDefined();
  });

  it('should update doctor availability after booking', async () => {
    const doctorId = testData.doctor.id;
    const timeSlot = '2024-03-20T10:00:00Z';
    
    await utils.bookTimeSlot(doctorId, timeSlot);
    const availability = await utils.getDoctorAvailability(doctorId);
    
    expect(availability).not.toContain(timeSlot);
  });
}); 