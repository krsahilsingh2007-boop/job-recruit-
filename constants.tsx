
import { Job, Company } from './types';

export const COLORS = {
  primary: '#2563eb',
  secondary: '#1e40af',
  background: '#f8fafc',
  textMain: '#1e293b',
  textMuted: '#64748b'
};

export const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Google', logo: 'https://picsum.photos/seed/google/100/100', rating: '4.5', reviews: '12k+', industry: 'Internet', activeJobs: 450, description: 'Global leader in search and cloud technology.' },
  { id: '2', name: 'Amazon', logo: 'https://picsum.photos/seed/amazon/100/100', rating: '4.2', reviews: '25k+', industry: 'E-commerce', activeJobs: 820, description: 'Worlds largest online retailer and cloud service provider.' },
  { id: '3', name: 'Microsoft', logo: 'https://picsum.photos/seed/msft/100/100', rating: '4.4', reviews: '18k+', industry: 'Software', activeJobs: 310, description: 'Leading technology company in operating systems and productivity software.' },
  { id: '4', name: 'Meta', logo: 'https://picsum.photos/seed/meta/100/100', rating: '4.1', reviews: '9k+', industry: 'Social Media', activeJobs: 120, description: 'Building the future of social connection and the metaverse.' },
  { id: '5', name: 'Netflix', logo: 'https://picsum.photos/seed/netflix/100/100', rating: '4.6', reviews: '5k+', industry: 'Entertainment', activeJobs: 65, description: 'Streaming entertainment service with millions of paid memberships.' },
  { id: '6', name: 'Flipkart', logo: 'https://picsum.photos/seed/flipkart/100/100', rating: '4.2', reviews: '15k+', industry: 'E-commerce', activeJobs: 340, description: 'Indias leading e-commerce marketplace.' },
  { id: '7', name: 'TCS', logo: 'https://picsum.photos/seed/tcs/100/100', rating: '3.8', reviews: '100k+', industry: 'IT Services', activeJobs: 1200, description: 'Global leader in IT services, digital and business solutions.' },
  { id: '8', name: 'Infosys', logo: 'https://picsum.photos/seed/infosys/100/100', rating: '3.9', reviews: '85k+', industry: 'IT Services', activeJobs: 950, description: 'A global leader in next-generation digital services and consulting.' },
  { id: '9', name: 'Zomato', logo: 'https://picsum.photos/seed/zomato/100/100', rating: '3.9', reviews: '7k+', industry: 'Food Delivery', activeJobs: 180, description: 'Better food for more people.' },
  { id: '10', name: 'Swiggy', logo: 'https://picsum.photos/seed/swiggy/100/100', rating: '4.2', reviews: '8k+', industry: 'Food Delivery', activeJobs: 210, description: 'Order from your favorite restaurants & get it delivered.' },
  { id: '11', name: 'Reliance Jio', logo: 'https://picsum.photos/seed/jio/100/100', rating: '4.0', reviews: '30k+', industry: 'Telecom', activeJobs: 560, description: 'Digitizing India with high-speed 4G/5G data services.' },
  { id: '12', name: 'HDFC Bank', logo: 'https://picsum.photos/seed/hdfc/100/100', rating: '4.1', reviews: '40k+', industry: 'Banking', activeJobs: 780, description: 'Indias leading private sector bank.' },
  { id: '13', name: 'Razorpay', logo: 'https://picsum.photos/seed/razorpay/100/100', rating: '4.4', reviews: '2k+', industry: 'FinTech', activeJobs: 145, description: 'The new standard for online payments.' },
  { id: '14', name: 'BYJUS', logo: 'https://picsum.photos/seed/byjus/100/100', rating: '3.5', reviews: '10k+', industry: 'EdTech', activeJobs: 320, description: 'The worlds most valuable EdTech company.' },
  { id: '15', name: 'PhonePe', logo: 'https://picsum.photos/seed/phonepe/100/100', rating: '4.3', reviews: '5k+', industry: 'FinTech', activeJobs: 190, description: 'Indias leading UPI and payments app.' },
  { id: '16', name: 'Uber', logo: 'https://picsum.photos/seed/uber/100/100', rating: '4.0', reviews: '15k+ text-slate-400', industry: 'Transportation', activeJobs: 240, description: 'Redefining the way the world moves.' },
  { id: '17', name: 'HCLTech', logo: 'https://picsum.photos/seed/hcl/100/100', rating: '3.7', reviews: '45k+', industry: 'IT Services', activeJobs: 670, description: 'Global technology company that helps enterprises reimagine business.' },
  { id: '18', name: 'Paytm', logo: 'https://picsum.photos/seed/paytm/100/100', rating: '3.6', reviews: '12k+', industry: 'FinTech', activeJobs: 280, description: 'Indias largest payments and financial services company.' },
  { id: '19', name: 'Freshworks', logo: 'https://picsum.photos/seed/fresh/100/100', rating: '4.3', reviews: '1k+', industry: 'SaaS', activeJobs: 90, description: 'Fresh software for better customer engagement.' },
  { id: '20', name: 'Zoho', logo: 'https://picsum.photos/seed/zoho/100/100', rating: '4.5', reviews: '3k+', industry: 'SaaS', activeJobs: 150, description: 'Operating system for business.' },
  { id: '21', name: 'Wipro', logo: 'https://picsum.photos/seed/wipro/100/100', rating: '3.8', reviews: '60k+', industry: 'IT Services', activeJobs: 840, description: 'Ambition is the fuel for success.' },
  { id: '22', name: 'Airtel', logo: 'https://picsum.photos/seed/airtel/100/100', rating: '3.9', reviews: '20k+', industry: 'Telecom', activeJobs: 410, description: 'Connecting millions through mobile and broadband.' },
  { id: '23', name: 'ICICI Bank', logo: 'https://picsum.photos/seed/icici/100/100', rating: '4.0', reviews: '35k+', industry: 'Banking', activeJobs: 620, description: 'Hum Hai Na - Trusted banking partner.' },
  { id: '24', name: 'Ola', logo: 'https://picsum.photos/seed/ola/100/100', rating: '3.4', reviews: '18k+', industry: 'Mobility', activeJobs: 130, description: 'Moving the world to sustainable mobility.' }
];

export const MOCK_JOBS: Job[] = [
  // --- Google ---
  {
    id: 'g-1',
    title: 'Senior Frontend Engineer',
    company: 'Google',
    logo: 'https://picsum.photos/seed/google/100/100',
    location: 'Bangalore, India',
    salary: '₹35L - ₹60L PA',
    minSalary: 35,
    maxSalary: 60,
    experience: '5-10 Yrs',
    description: 'Build scalable UIs for Google Cloud using React and TypeScript.',
    skills: ['React', 'TypeScript', 'Google Cloud', 'Jest', 'Tailwind CSS', 'Redux'],
    workMode: 'Hybrid',
    postedAt: '2 days ago',
    type: 'Full-time',
    applicantsCount: 342
  },
  {
    id: 'g-2',
    title: 'Product Manager, AI',
    company: 'Google',
    logo: 'https://picsum.photos/seed/google/100/100',
    location: 'Hyderabad, India',
    salary: '₹40L - ₹75L PA',
    minSalary: 40,
    maxSalary: 75,
    experience: '6-12 Yrs',
    description: 'Lead the vision for next-gen AI search features.',
    skills: ['Product Strategy', 'ML', 'Analytics', 'Agile', 'Roadmapping'],
    workMode: 'On-site',
    postedAt: '1 day ago',
    type: 'Full-time',
    applicantsCount: 89
  },

  // --- Amazon ---
  {
    id: 'a-1',
    title: 'Software Development Engineer II',
    company: 'Amazon',
    logo: 'https://picsum.photos/seed/amazon/100/100',
    location: 'Bangalore, India',
    salary: '₹28L - ₹50L PA',
    minSalary: 28,
    maxSalary: 50,
    experience: '3-7 Yrs',
    description: 'Work on highly distributed systems for Amazon Retail.',
    skills: ['Java', 'AWS', 'Microservices', 'Distributed Systems', 'DynamoDB'],
    workMode: 'On-site',
    postedAt: 'Just now',
    type: 'Full-time',
    applicantsCount: 412
  },
  {
    id: 'a-2',
    title: 'Operations Manager',
    company: 'Amazon',
    logo: 'https://picsum.photos/seed/amazon/100/100',
    location: 'Gurgaon, India',
    salary: '₹18L - ₹32L PA',
    minSalary: 18,
    maxSalary: 32,
    experience: '4-8 Yrs',
    description: 'Optimize fulfillment center operations and logistics.',
    skills: ['Logistics', 'Six Sigma', 'Team Management', 'Supply Chain'],
    workMode: 'On-site',
    postedAt: '3 days ago',
    type: 'Full-time',
    applicantsCount: 156
  },

  // --- Microsoft ---
  {
    id: 'ms-1',
    title: 'Cloud Solutions Architect',
    company: 'Microsoft',
    logo: 'https://picsum.photos/seed/msft/100/100',
    location: 'Hyderabad, India',
    salary: '₹45L - ₹85L PA',
    minSalary: 45,
    maxSalary: 85,
    experience: '10-15 Yrs',
    description: 'Design complex enterprise cloud architectures on Azure.',
    skills: ['Azure', 'Security', 'Cloud Strategy', 'DevOps', 'ARM Templates'],
    workMode: 'Hybrid',
    postedAt: '1 week ago',
    type: 'Full-time',
    applicantsCount: 45
  },
  {
    id: 'ms-2',
    title: 'Data Scientist II',
    company: 'Microsoft',
    logo: 'https://picsum.photos/seed/msft/100/100',
    location: 'Bangalore, India',
    salary: '₹30L - ₹55L PA',
    minSalary: 30,
    maxSalary: 55,
    experience: '4-8 Yrs',
    description: 'Apply ML techniques to improve Windows and Office telemetry.',
    skills: ['Python', 'Azure ML', 'Statistics', 'SQL', 'PyTorch'],
    workMode: 'Remote',
    postedAt: '2 days ago',
    type: 'Full-time',
    applicantsCount: 234
  },

  // --- Meta ---
  {
    id: 'm-1',
    title: 'Content Policy Manager',
    company: 'Meta',
    logo: 'https://picsum.photos/seed/meta/100/100',
    location: 'Gurgaon, India',
    salary: '₹25L - ₹45L PA',
    minSalary: 25,
    maxSalary: 45,
    experience: '5-9 Yrs',
    description: 'Shape the policies that govern content on FB and Instagram.',
    skills: ['Policy', 'Public Affairs', 'Risk Management', 'Stakeholder Management'],
    workMode: 'Hybrid',
    postedAt: '4 days ago',
    type: 'Full-time',
    applicantsCount: 67
  },

  // --- TCS ---
  {
    id: 'tcs-1',
    title: 'Java Full Stack Developer',
    company: 'TCS',
    logo: 'https://picsum.photos/seed/tcs/100/100',
    location: 'Chennai, India',
    salary: '₹6L - ₹15L PA',
    minSalary: 6,
    maxSalary: 15,
    experience: '2-5 Yrs',
    description: 'Join our banking digital transformation team.',
    skills: ['Java 17', 'Spring Boot', 'Angular', 'Oracle', 'JPA'],
    workMode: 'On-site',
    postedAt: '5 hours ago',
    type: 'Full-time',
    applicantsCount: 1200
  },
  {
    id: 'tcs-2',
    title: 'Business Analyst',
    company: 'TCS',
    logo: 'https://picsum.photos/seed/tcs/100/100',
    location: 'Pune, India',
    salary: '₹8L - ₹18L PA',
    minSalary: 8,
    maxSalary: 18,
    experience: '3-6 Yrs',
    description: 'Gather requirements for global retail clients.',
    skills: ['Agile', 'Jira', 'Business Communication', 'UML', 'User Stories'],
    workMode: 'Hybrid',
    postedAt: 'Yesterday',
    type: 'Full-time',
    applicantsCount: 450
  },

  // --- Zomato ---
  {
    id: 'z-1',
    title: 'Growth Marketing Lead',
    company: 'Zomato',
    logo: 'https://picsum.photos/seed/zomato/100/100',
    location: 'Gurgaon, India',
    salary: '₹20L - ₹38L PA',
    minSalary: 20,
    maxSalary: 38,
    experience: '5-8 Yrs',
    description: 'Drive user acquisition and retention through data-driven campaigns.',
    skills: ['Digital Marketing', 'SQL', 'A/B Testing', 'Retention', 'Google Ads'],
    workMode: 'On-site',
    postedAt: '2 days ago',
    type: 'Full-time',
    applicantsCount: 178
  },
  {
    id: 'z-2',
    title: 'SDE III, Backend',
    company: 'Zomato',
    logo: 'https://picsum.photos/seed/zomato/100/100',
    location: 'Gurgaon, India',
    salary: '₹40L - ₹65L PA',
    minSalary: 40,
    maxSalary: 65,
    experience: '6-10 Yrs',
    description: 'Design the core checkout and logistics engine.',
    skills: ['Golang', 'Redis', 'Kafka', 'System Design', 'PostgreSQL'],
    workMode: 'On-site',
    postedAt: 'Just now',
    type: 'Full-time',
    applicantsCount: 56
  }
];

export const TOP_COMPANIES = MOCK_COMPANIES.slice(0, 5);
