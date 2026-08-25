export type EventCategory = 'music' | 'theatre' | 'dance' | 'art' | 'literary' | 'stage';
export type EventType = 'individual' | 'group';

export interface EventSpecificField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  helperText?: string;
}

export interface EventData {
  id: string;
  name: string;
  category: string;
  type: EventType;
  min_team_size: number | null;
  max_team_size: number | null;
  description: string;
  rules: string[];
  date: string;
  time_start: string;
  time_end: string;
  venue_or_platform: string;
  submission_type: 'live' | 'submission';
  specific_fields?: EventSpecificField[];
}

export type RegistrationState = 'IDLE' | 'FORM' | 'SUBMITTING' | 'SUCCESS' | 'ERROR' | 'ALREADY_REGISTERED';

export interface TeamMember {
  name: string;
  reg_number: string;
}

export interface UserProfile {
  id: string;
  name: string;
  fullName: string;
  email: string;
  phone?: string;
  contactNumber?: string;
  institute?: string;
  rollNumber?: string;
  roll_number?: string;
  department?: string;
  emailVerified?: boolean;
  email_verified?: boolean;
}

export interface UserRegistrationItem {
  id: string;
  eventId: string;
  status: string;
  createdAt: string;
  event: {
    id: string;
    name: string;
    category: string;
    type: EventType;
    min_team_size?: number | null;
    max_team_size?: number | null;
    date: string;
    time_start: string;
    time_end: string;
    submission_type?: 'live' | 'submission';
    description: string;
  };
  teamMembers: TeamMember[];
  eventSpecificResponses: Record<string, any>;
}

export interface AccountResponseData {
  user: UserProfile;
  registrations: UserRegistrationItem[];
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  contactNumber: string;
  organizationInstitute: string;
  rollNumber?: string;
  teamMembers: TeamMember[];
  eventSpecificResponses: Record<string, any>;
}

export interface RegistrationFormErrors {
  fullName?: string;
  email?: string;
  contactNumber?: string;
  organizationInstitute?: string;
  teamMembers?: string;
  general?: string;
  [key: string]: string | undefined;
}

export interface RegistrationResult {
  registration_id: string;
  reg_id?: string;
  event_id?: string;
  event_name?: string;
  full_name?: string;
  email?: string;
  status: string;
  created_at?: string;
  email_sent?: boolean;
}

export interface RegistrationResponse {
  registration_id: string;
  reg_id?: string;
  event_name?: string;
  full_name?: string;
  status: string;
  created_at?: string;
  event?: EventData;
  email_sent?: boolean;
}

