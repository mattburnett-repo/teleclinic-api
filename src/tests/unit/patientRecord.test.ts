import { utils, testData } from '../shared';

describe('Patient Health Records', () => {
  it('should get patient health record', async () => {
    const patientName = testData.patient.name;
    const record = await utils.getPatientRecord(patientName);
    
    expect(record.patientName).toBe(patientName);
    expect(record.medicalHistory).toBeDefined();
  });

  it('should update record with new health inquiry', async () => {
    const inquiry = await utils.createTestInquiry();
    
    const record = await utils.getPatientRecord(inquiry.patientName);
    
    expect(record.inquiries).toContainEqual(expect.objectContaining({
      id: inquiry.id,
      symptoms: inquiry.symptoms
    }));
  });

  it('should list past doctor visits', async () => {
    const patientName = testData.patient.name;
    const visits = await utils.getPatientVisits(patientName);
    
    expect(Array.isArray(visits)).toBe(true);
    expect(visits[0]).toHaveProperty('doctorName');
    expect(visits[0]).toHaveProperty('date');
  });
}); 