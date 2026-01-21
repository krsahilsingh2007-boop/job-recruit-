
import { Job, User, Application, Company } from './types';
import { MOCK_JOBS, MOCK_COMPANIES } from './constants';

/**
 * MOCK MONGODB SERVICE - FULL BACKEND SIMULATION
 * Handles Jobs, Users, and Applications with persistence.
 */

class MockMongoDB {
  private STORAGE_KEYS = {
    JOBS: 'mongodb_jobs',
    USERS: 'mongodb_users',
    APPLICATIONS: 'mongodb_applications',
    COMPANIES: 'mongodb_companies'
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      // Init Jobs
      const existingJobs = localStorage.getItem(this.STORAGE_KEYS.JOBS);
      let jobsNeededInit = true;
      if (existingJobs) {
        try {
          const parsed = JSON.parse(existingJobs);
          if (Array.isArray(parsed) && parsed.length >= 1000) {
            jobsNeededInit = false;
          }
        } catch (e) {
          console.warn("Corrupted job data in storage, resetting...");
        }
      }
      
      if (jobsNeededInit) {
        localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(this.generateMassiveDataset()));
      }
      
      // Init Companies
      if (!localStorage.getItem(this.STORAGE_KEYS.COMPANIES)) {
        localStorage.setItem(this.STORAGE_KEYS.COMPANIES, JSON.stringify(MOCK_COMPANIES));
      }

      // Init Applications
      if (!localStorage.getItem(this.STORAGE_KEYS.APPLICATIONS)) {
        localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
      }

      // Init Users
      if (!localStorage.getItem(this.STORAGE_KEYS.USERS)) {
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify([]));
      }
    } catch (err) {
      console.error("Critical failure during MockDB initialization", err);
    }
  }

  private generateMassiveDataset(): Job[] {
    const titles = ['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'HR Generalist'];
    const locations = ['Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Remote'];
    const jobs: Job[] = [...MOCK_JOBS];
    const companies = MOCK_COMPANIES;
    let idCounter = 1;

    while (jobs.length < 1100) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const minSal = Math.floor(Math.random() * 30) + 5;
      const maxSal = minSal + 15;
      
      jobs.push({
        id: `gen-${idCounter++}`,
        title: `${Math.random() > 0.8 ? 'Senior ' : ''}${title}`,
        company: company.name,
        logo: company.logo,
        location: `${location}, India`,
        salary: `₹${minSal}L - ₹${maxSal}L PA`,
        minSalary: minSal,
        maxSalary: maxSal,
        experience: `${Math.floor(Math.random() * 10)} Yrs`,
        description: `Join ${company.name} as a ${title}. We are looking for passionate individuals.`,
        skills: ['React', 'Node.js', 'SQL'],
        workMode: Math.random() > 0.5 ? 'Hybrid' : 'Remote',
        postedAt: '3 days ago',
        type: 'Full-time',
        applicantsCount: Math.floor(Math.random() * 100)
      });
    }
    return jobs;
  }

  private delay(ms: number = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --- COLLECTIONS ---

  jobs = {
    find: async (query: any = {}) => {
      await this.delay();
      try {
        const all: Job[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.JOBS) || '[]');
        return all.filter(j => {
          if (query.text && !j.title.toLowerCase().includes(query.text.toLowerCase()) && !j.company.toLowerCase().includes(query.text.toLowerCase())) return false;
          if (query.skills && query.skills.length > 0 && !query.skills.some((s: string) => j.skills.includes(s))) return false;
          if (query.workMode && query.workMode.length > 0 && !query.workMode.includes(j.workMode)) return false;
          if (query.salaryMin && (j.maxSalary || 0) < query.salaryMin) return false;
          return true;
        });
      } catch (e) {
        return [];
      }
    },
    findOne: async (id: string) => {
      try {
        const all: Job[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.JOBS) || '[]');
        return all.find(j => j.id === id) || null;
      } catch (e) {
        return null;
      }
    },
    count: async () => {
      try {
        const all: Job[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.JOBS) || '[]');
        return all.length;
      } catch (e) {
        return 0;
      }
    }
  };

  users = {
    findOne: async (email: string) => {
      await this.delay(100);
      try {
        const all: User[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]');
        return all.find(u => u.email === email) || null;
      } catch (e) {
        return null;
      }
    },
    insertOne: async (user: User) => {
      await this.delay(200);
      try {
        const all: User[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]');
        if (all.find(u => u.email === user.email)) return user;
        all.push(user);
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(all));
        return user;
      } catch (e) {
        return user;
      }
    },
    updateOne: async (id: string, updates: Partial<User>) => {
      await this.delay(200);
      try {
        const all: User[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]');
        const index = all.findIndex(u => u.id === id);
        if (index !== -1) {
          all[index] = { ...all[index], ...updates };
          localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(all));
          return all[index];
        }
        return null;
      } catch (e) {
        return null;
      }
    }
  };

  applications = {
    find: async (query: { candidateId?: string, jobId?: string } = {}) => {
      await this.delay(300);
      try {
        const all: Application[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.APPLICATIONS) || '[]');
        return all.filter(app => {
          if (query.candidateId && app.candidateId !== query.candidateId) return false;
          if (query.jobId && app.jobId !== query.jobId) return false;
          return true;
        });
      } catch (e) {
        return [];
      }
    },
    insertOne: async (application: Omit<Application, 'id' | 'appliedAt' | 'status'>) => {
      await this.delay(400);
      try {
        const all: Application[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.APPLICATIONS) || '[]');
        
        // Check if already applied
        if (all.find(a => a.candidateId === application.candidateId && a.jobId === application.jobId)) {
          throw new Error("Already applied to this job");
        }

        const newApp: Application = {
          ...application,
          id: `app-${Date.now()}`,
          status: 'Applied',
          appliedAt: new Date().toISOString()
        };
        
        all.push(newApp);
        localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify(all));

        // Atomic Update: Increment applicant count on the job
        const allJobs: Job[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.JOBS) || '[]');
        const jobIdx = allJobs.findIndex(j => j.id === application.jobId);
        if (jobIdx !== -1) {
          allJobs[jobIdx].applicantsCount += 1;
          localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(allJobs));
        }

        return newApp;
      } catch (e) {
        throw e;
      }
    }
  };
}

export const db = new MockMongoDB();
