export interface HealthInquiry {
  id: string;
  patientName: string;
  symptoms: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'matched' | 'scheduled';
}

export interface DoctorMatch {
  doctorId: string;
  inquiryId: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  inquiryId: string;
  time: string;
  status: 'scheduled' | 'completed';
  confirmed: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  availability: string[];
}

export type PatientRecord = {
  patientName: string;
  medicalHistory: Array<{
    date: Date;
    symptoms: string;
    doctorName?: string;
  }>;
  lastVisit: string | null;
  inquiries: HealthInquiry[];
};

export type PatientVisit = {
  doctorName: string;
  date: string;
  reason: string;
}; 