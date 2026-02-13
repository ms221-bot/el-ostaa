
export type UserRole = 'customer' | 'technician' | 'admin';
export type AdminAccessRole = 'manager' | 'staff_admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string; // تم إضافة هذا الحقل
  role: UserRole;
  location?: string;
  profileImage?: string;
  status?: 'available' | 'busy' | 'pending';
  profession?: string;
  experience?: number;
  isBlocked?: boolean;
}

export type RequestStatus = 'pending' | 'accepted' | 'completed' | 'rejected' | 'execution_error' | 'deleted';

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  category: string;
  description: string;
  location: string;
  preferredTime: string;
  status: RequestStatus;
  technicianId?: string;
  technicianName?: string;
  createdAt: string;
  notes?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Complaint {
  id: string;
  fromUserId: string;
  fromUserName: string;
  subject: string;
  details: string;
  date: string;
  status: 'new' | 'resolved';
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface AppNotification {
  id: string;
  targetRole: UserRole | 'all';
  title: string;
  message: string;
  date: string;
}
