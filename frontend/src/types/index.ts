export type Role = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
};

export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
};

export type UpdateUserDTO = {
  id: string;
  name?: string;
  role?: Role;
  phone?: string;
  isActive?: boolean;
};

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  medicalNotes?: string;
  customerId: string;
};

export type CreatePetDTO = {
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  medicalNotes?: string;
  customerId: string;
};

export type UpdatePetDTO = {
  id: string;
  name?: string;
  species?: string;
  breed?: string;
  age?: number;
  weight?: number;
  medicalNotes?: string;
  customerId?: string;
};

export type ScheduleStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ServiceType = 'BATH' | 'GROOMING' | 'BATH_GROOMING';

export type Schedule = {
  id: string;
  serviceType: ServiceType;
  status: ScheduleStatus;
  scheduledAt: string;
  notes?: string;
  price?: number;
  customerId: string;
  petId: string;
  staffId?: string;
  pet?: Pet;
  customer?: User;
};

export type CreateScheduleDTO = {
  serviceType: ServiceType;
  scheduledAt: string;
  notes?: string;
  price?: number;
  customerId: string;
  petId: string;
  staffId?: string;
};
