import { utils, testData } from '../shared';

describe('Appointments', () => {
  it('should schedule appointment after doctor match', async () => {
    const inquiry = await utils.createTestInquiry();
    
    const match = await utils.matchDoctorToInquiry(inquiry.id);
    const appointment = await utils.scheduleAppointment(match.doctorId, inquiry.id);
    
    expect(appointment.id).toBeDefined();
    expect(appointment.doctorId).toBe(match.doctorId);
    expect(appointment.inquiryId).toBe(inquiry.id);
    expect(appointment.status).toBe('scheduled');
  });

  it('should list available time slots for doctor', async () => {
    const doctorId = testData.doctor.id;
    const slots = await utils.getDoctorTimeSlots(doctorId);
    
    expect(Array.isArray(slots)).toBe(true);
    expect(slots[0]).toHaveProperty('time');
    expect(slots[0]).toHaveProperty('available');
  });

  it('should confirm appointment booking', async () => {
    const doctorId = testData.doctor.id;
    const slots = await utils.getDoctorTimeSlots(doctorId);
    const appointment = await utils.bookTimeSlot(doctorId, slots[0].time);
    
    expect(appointment.confirmed).toBe(true);
    expect(appointment.time).toBe(slots[0].time);
  });
}); 