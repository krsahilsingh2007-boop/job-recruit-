
export type UserRole = 'CANDIDATE' | 'RECRUITER';

export interface CompanyProfile {
  name: string;
  logo: string;
  description: string;
  industry: string;
  website?: string;
  location: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  rating: string;
  reviews: string;
  industry: string;
  activeJobs: number;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  profilePic?: string;
  resumeName?: string;
  companyProfile?: CompanyProfile;
  // New profile completion fields
  designation?: string;
  education?: string;
  skills?: string[];
  location?: string;
  completionPercentage?: number;
  jobAlerts?: JobAlertPreferences;
  savedJobIds?: string[]; // IDs of jobs saved for later
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string; // Display string
  minSalary?: number; // Numeric value in Lakhs
  maxSalary?: number; // Numeric value in Lakhs
  experience: string;
  description: string;
  skills: string[];
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  postedAt: string;
  type: 'Full-time' | 'Contract' | 'Part-time';
  applicantsCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'Applied' | 'Reviewed' | 'Interviewing' | 'Accepted' | 'Rejected';
  appliedAt: string;
}

export interface JobAlertPreferences {
  skills: string[];
  location: string;
  minSalary: string;
}

export interface FilterState {
  search: string;
  location: string;
  experience: string;
  salary: string;
  workMode: string[];
}
