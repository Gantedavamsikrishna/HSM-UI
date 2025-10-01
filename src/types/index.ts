
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'reception' | 'lab';
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory?: string;
  allergies?: string;
  bloodGroup?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  userId: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  consultationFee: number;
  schedule: DoctorSchedule[];
}

export interface DoctorSchedule {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
  followUpDate?: string;
  createdAt: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  doctorId: string;
  testName: string;
  testType: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  results?: string;
  resultFile?: string;
  normalRanges?: string;
  technician?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Bill {
  id: string;
  patientId: string;
  doctorId?: string;
  items: BillItem[];
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'partial' | 'paid' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: 'consultation' | 'medicine' | 'test' | 'procedure' | 'other';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingTests: number;
  totalRevenue: number;
}