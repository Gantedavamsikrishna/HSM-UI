import { User, Patient, Doctor, Appointment, Treatment, LabTest, Bill, DoctorSchedule } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hospital.com',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Admin',
    role: 'admin',
    phone: '+1234567890',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    email: 'dr.smith@hospital.com',
    password: 'doctor123',
    firstName: 'Sarah',
    lastName: 'Smith',
    role: 'doctor',
    phone: '+1234567891',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    email: 'reception@hospital.com',
    password: 'reception123',
    firstName: 'Mary',
    lastName: 'Johnson',
    role: 'reception',
    phone: '+1234567892',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    email: 'lab@hospital.com',
    password: 'lab123',
    firstName: 'David',
    lastName: 'Lab',
    role: 'lab',
    phone: '+1234567893',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@email.com',
    phone: '+1234567894',
    dateOfBirth: '1990-05-15',
    gender: 'female',
    address: '123 Main St, City, State 12345',
    emergencyContact: 'Bob Williams',
    emergencyPhone: '+1234567895',
    medicalHistory: 'No significant medical history',
    allergies: 'None known',
    bloodGroup: 'A+',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@email.com',
    phone: '+1234567896',
    dateOfBirth: '1985-08-22',
    gender: 'male',
    address: '456 Oak Ave, City, State 12345',
    emergencyContact: 'Susan Brown',
    emergencyPhone: '+1234567897',
    medicalHistory: 'Hypertension, Type 2 Diabetes',
    allergies: 'Penicillin',
    bloodGroup: 'B-',
    createdAt: '2024-01-16T00:00:00.000Z',
    updatedAt: '2024-01-16T00:00:00.000Z',
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    userId: '2',
    specialization: 'Cardiology',
    licenseNumber: 'MD123456',
    experience: 10,
    consultationFee: 200,
    schedule: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '15:00', isAvailable: true },
    ],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    dateTime: '2024-01-20T10:00:00.000Z',
    status: 'scheduled',
    reason: 'Regular checkup',
    notes: 'Patient requested early morning appointment',
    createdAt: '2024-01-18T00:00:00.000Z',
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '1',
    dateTime: '2024-01-20T14:00:00.000Z',
    status: 'completed',
    reason: 'Follow-up consultation',
    notes: 'Diabetes management review',
    createdAt: '2024-01-18T00:00:00.000Z',
  },
];

export const mockTreatments: Treatment[] = [
  {
    id: '1',
    patientId: '2',
    doctorId: '1',
    appointmentId: '2',
    diagnosis: 'Type 2 Diabetes Mellitus - Well controlled',
    prescription: 'Metformin 500mg twice daily, continue current regimen',
    notes: 'Blood sugar levels stable. Continue current medication.',
    followUpDate: '2024-02-20',
    createdAt: '2024-01-20T14:30:00.000Z',
  },
];

export const mockLabTests: LabTest[] = [
  {
    id: '1',
    patientId: '2',
    doctorId: '1',
    testName: 'HbA1c',
    testType: 'Blood Test',
    status: 'completed',
    results: '6.8%',
    normalRanges: '< 7.0% for diabetics',
    technician: 'Lab Technician',
    completedAt: '2024-01-19T15:00:00.000Z',
    createdAt: '2024-01-18T00:00:00.000Z',
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '1',
    testName: 'Complete Blood Count',
    testType: 'Blood Test',
    status: 'pending',
    createdAt: '2024-01-20T00:00:00.000Z',
  },
];

export const mockBills: Bill[] = [
  {
    id: '1',
    patientId: '2',
    doctorId: '1',
    items: [
      {
        id: '1',
        description: 'Consultation Fee - Cardiology',
        quantity: 1,
        unitPrice: 200,
        totalPrice: 200,
        type: 'consultation',
      },
      {
        id: '2',
        description: 'HbA1c Test',
        quantity: 1,
        unitPrice: 75,
        totalPrice: 75,
        type: 'test',
      },
    ],
    totalAmount: 275,
    paidAmount: 275,
    status: 'paid',
    paymentMethod: 'Credit Card',
    createdAt: '2024-01-20T15:00:00.000Z',
  },
];

// Local storage utilities
export const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(`hms_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(`hms_${key}`, JSON.stringify(data));
};

// Initialize data on first load
export const initializeData = () => {
  if (!localStorage.getItem('hms_patients')) {
    setStoredData('patients', mockPatients);
    setStoredData('doctors', mockDoctors);
    setStoredData('appointments', mockAppointments);
    setStoredData('treatments', mockTreatments);
    setStoredData('labTests', mockLabTests);
    setStoredData('bills', mockBills);
  }
};