export interface Resume {
  id: string;
  title: string;
  url: string;
  updatedAt: string;
}

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  salary: string;
  url: string;
  location: string;
}

export interface FilterSettings {
  keywords: string;
  excludeKeywords: string;
  searchInDescription: boolean;
  salaryFrom: number;
  salaryNotImportant: boolean;
  experience: 'noExperience' | 'between1And3' | 'between3And6' | 'moreThan6';
  employment: 'full' | 'part' | 'project' | 'volunteer' | 'probation';
  schedule: 'fullDay' | 'shift' | 'flexible' | 'remote' | 'flyInFlyOut';
  applicationLimit: number;
}

export type CoverLetterMode = 'none' | 'template' | 'ai';
export type AiTone = 'professional' | 'enthusiastic' | 'formal' | 'friendly';

export interface AiSettings {
  tone: AiTone;
}

export interface CoverLetterConfig {
  mode: CoverLetterMode;
  template: string;
  aiSettings: AiSettings;
}


export interface ApplicationLog {
  id: string;
  vacancy: Vacancy;
  resume: Resume;
  status: 'Applied' | 'Viewed' | 'Invitation';
  appliedAt: Date;
  coverLetter: string;
  coverLetterMode: CoverLetterMode;
}

export interface ChartData {
    name: string;
    applications: number;
}

export interface Subscription {
  status: 'active' | 'inactive' | 'trial';
  planName: string;
  expiresAt: Date;
}

export interface PaymentMethod {
  type: 'card';
  last4: string;
  expires: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  subscription: Subscription;
  paymentMethod: PaymentMethod;
  coverLetterConfig: CoverLetterConfig;
  accessToken?: string;
  resumes?: Resume[];
  applications?: ApplicationLog[];
}