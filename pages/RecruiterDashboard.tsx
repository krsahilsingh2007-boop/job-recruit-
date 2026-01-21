import React, { useState, useRef } from 'react';
import { User, Job, CompanyProfile } from '../types';
import { generateJobDescription } from '../geminiService';

interface RecruiterDashboardProps {
  user: User;
  jobs: Job[];
  onPostJob: (job: Job) => void;
  onUpdateUser?: (user: User) => void;
}

const MOCK_APPLICANTS = [
  { name: "Arjun Mehta", experience: "5 Years", currentRole: "Senior React Dev", score: 95, status: 'New' },
  { name: "Priya Sharma", experience: "3 Years", currentRole: "Frontend Developer", score: 88, status: 'Shortlisted' },
  { name: "Rohan Gupta", experience: "6 Years", currentRole: "Full Stack Engineer", score: 92, status: 'New' },
  { name: "Ananya Iyer", experience: "2 Years", currentRole: "Junior UI Developer", score: 75, status: 'New' },
  { name: "Vikram Singh", experience: "8 Years", currentRole: "UI Architect", score: 98, status: 'Shortlisted' },
  { name: "Sanya Malhotra", experience: "4 Years", currentRole: "Software Engineer", score: 82, status: 'Rejected' },
];

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ user, jobs, onPostJob, onUpdateUser }) => {
  const myJobs = jobs.filter(j => j.company === (user.companyProfile?.name || user.company) || j.id.startsWith('new-'));
  const [activeTab, setActiveTab] = useState<'listings' | 'profile'>('listings');
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<Job | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [applicantSearch, setApplicantSearch] = useState('');
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  const initialFormState = {
    title: '',
    company: user.companyProfile?.name || user.company || '',
    experience: '',
    minSalary: '',
    maxSalary: '',
    description: '',
    location: user.companyProfile?.location || '',
    workMode: 'On-site' as const,
    skills: ''
  };

  const [newJob, setNewJob] = useState(initialFormState);

  const [companyForm, setCompanyForm] = useState<CompanyProfile>(() => {
    return user.companyProfile || {
      name: user.company || '',
      logo: `https://picsum.photos/seed/${user.company}/100/100`,
      description: '',
      industry: '',
      website: '',
      location: ''
    };
  });

  const handleAICompose = async () => {
    if (!newJob.title) {
      setError("Please enter a job title first to generate a description.");
      return;
    }
    setError(null);
    setLoadingAI(true);
    const aiDesc = await generateJobDescription(newJob.title, newJob.company || user.company || 'Our Company');
    setNewJob(prev => ({ ...prev, description: aiDesc }));
    setLoadingAI(false);
  };

  const handleClearForm = () => {
    const hasData = Object.values(newJob).some(val => val !== '' && val !== 'On-site' && val !== (user.companyProfile?.name || user.company));
    if (hasData) {
      if (window.confirm("Are you sure you want to clear the form? All entered data will be lost.")) {
        setNewJob(initialFormState);
        setError(null);
      }
    } else {
      setNewJob(initialFormState);
      setError(null);
    }
  };

  const validateForm = () => {
    if (!newJob.title.trim()) return "Job Title is required";
    if (!newJob.company.trim()) return "Company Name is required";
    if (!newJob.location.trim()) return "Location is required";
    if (!newJob.experience.trim()) return "Experience range is required";
    
    // Explicit Salary Validation logic as requested
    if (!newJob.minSalary.trim()) return "Minimum Salary is required";
    if (!newJob.maxSalary.trim()) return "Maximum Salary is required";
    
    const min = parseFloat(newJob.minSalary);
    const max = parseFloat(newJob.maxSalary);
    
    if (isNaN(min) || isNaN(max)) return "Salary must be a valid number (e.g., 10 or 15.5)";
    if (min < 0 || max < 0) return "Salary cannot be negative";
    if (min > max) return "Minimum salary cannot be higher than maximum salary";
    
    if (!newJob.description.trim()) return "Job Description is required";
    if (!newJob.skills.trim()) return "At least one skill is required";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const job: Job = {
      id: `new-${Date.now()}`,
      title: newJob.title,
      company: newJob.company,
      logo: user.companyProfile?.logo || `https://picsum.photos/seed/${newJob.company}/100/100`,
      location: newJob.location,
      salary: `₹${newJob.minSalary}L - ₹${newJob.maxSalary}L PA`,
      minSalary: parseFloat(newJob.minSalary),
      maxSalary: parseFloat(newJob.maxSalary),
      experience: newJob.experience,
      description: newJob.description,
      skills: newJob.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
      workMode: newJob.workMode,
      postedAt: 'Just now',
      type: 'Full-time',
      applicantsCount: 0
    };

    onPostJob(job);
    setShowPostForm(false);
    setError(null);
    setNewJob(initialFormState);
  };

  const handleSaveCompanyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name) {
      setError("Company Name is required.");
      return;
    }
    
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        company: companyForm.name,
        companyProfile: companyForm
      });
      setSaveStatus("Profile saved successfully!");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleLogoUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCompanyForm({ ...companyForm, logo: e.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLogoUpload(file);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoUpload(file);
  };

  const renderApplicantsView = (job: Job) => {
    const displayCount = Math.max(job.applicantsCount, 3); 
    const jobApplicants = MOCK_APPLICANTS.slice(0, displayCount).map((app, i) => ({
      ...app,
      id: `app-${i}`,
      appliedAt: i === 0 ? '2 hours ago' : i === 1 ? 'Yesterday' : `${i + 1} days ago`,
      email: `${app.name.toLowerCase().replace(' ', '.')}@talent.com`
    })).filter(app => app.name.toLowerCase().includes(applicantSearch.toLowerCase()));

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setSelectedJobForApplicants(null);
                  setApplicantSearch('');
                }}
                className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all"
              >
                <div className="p-2 bg-white border border-slate-200 rounded-full group-hover:border-blue-200 group-hover:bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                </div>
                <span className="text-sm">Back to Jobs</span>
              </button>
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{job.title}</h2>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{job.applicantsCount} Total Applications</p>
              </div>
           </div>
           
           <div className="relative">
              <input 
                type="text"
                placeholder="Search candidates..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64 shadow-sm"
                value={applicantSearch}
                onChange={(e) => setApplicantSearch(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
           {jobApplicants.length > 0 ? (
             jobApplicants.map(applicant => (
               <div key={applicant.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group">
                 <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="relative">
                      <img src={`https://picsum.photos/seed/${applicant.name}/100/100`} alt={applicant.name} className="w-14 h-14 rounded-full border-2 border-slate-100 object-cover shadow-sm" />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm ${applicant.score > 90 ? 'bg-green-500' : 'bg-blue-500'}`}>
                        {applicant.score}%
                      </div>
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{applicant.name}</h4>
                       <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{applicant.currentRole}</span>
                          <span className="text-slate-300">•</span>
                          <span>{applicant.experience} Experience</span>
                       </div>
                       <p className="text-[10px] text-slate-400 mt-1 font-medium italic">{applicant.email}</p>
                    </div>
                 </div>

                 <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-8 lg:gap-12">
                    <div className="text-left md:text-right">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Match Score</p>
                       <div className="flex items-center md:justify-end gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full ${applicant.score > 90 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${applicant.score}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-700">{applicant.score}%</span>
                       </div>
                    </div>
                    <div className="text-left md:text-right">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applied</p>
                       <p className="text-sm font-bold text-slate-700">{applicant.appliedAt}</p>
                    </div>
                    <div className="text-left md:text-right">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                       <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${applicant.status === 'Shortlisted' ? 'bg-green-50 text-green-700 border-green-100' : applicant.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{applicant.status}</span>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100" title="View CV">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                       </button>
                    </div>
                 </div>
               </div>
             ))
           ) : (
             <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-2">No matching candidates</h3>
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {selectedJobForApplicants ? (
          renderApplicantsView(selectedJobForApplicants)
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Recruiter Dashboard</h1>
                <p className="text-slate-500">Managing talent acquisition for <span className="text-blue-600 font-bold">{user.companyProfile?.name || user.company || 'Global Ventures'}</span></p>
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={() => setActiveTab('listings')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'listings' ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Jobs</button>
                 <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Company Profile</button>
              </div>
            </div>

            {activeTab === 'listings' ? (
              <>
                <div className="flex justify-end mb-8">
                  <button onClick={() => {setShowPostForm(!showPostForm); setError(null);}} className={`px-6 py-3 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 ${showPostForm ? 'bg-slate-500 hover:bg-slate-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {showPostForm ? 'Cancel' : 'Post New Job'}
                  </button>
                </div>

                {showPostForm && (
                  <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-6 duration-500">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Create Job Listing</h2>
                    
                    {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase">Job Title *</label>
                          <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" value={newJob.title} onChange={(e) => {setNewJob({...newJob, title: e.target.value}); setError(null);}} />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase">Location *</label>
                          <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" value={newJob.location} onChange={(e) => {setNewJob({...newJob, location: e.target.value}); setError(null);}} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase">Experience *</label>
                          <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g. 2-5 Yrs" value={newJob.experience} onChange={(e) => {setNewJob({...newJob, experience: e.target.value}); setError(null);}} />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase">Salary Range (Lakhs PA) *</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <span className="absolute left-3 top-3.5 text-slate-400 text-xs font-bold">₹</span>
                              <input type="text" className="w-full pl-7 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Min" value={newJob.minSalary} onChange={(e) => {setNewJob({...newJob, minSalary: e.target.value}); setError(null);}} />
                            </div>
                            <div className="relative">
                              <span className="absolute left-3 top-3.5 text-slate-400 text-xs font-bold">₹</span>
                              <input type="text" className="w-full pl-7 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Max" value={newJob.maxSalary} onChange={(e) => {setNewJob({...newJob, maxSalary: e.target.value}); setError(null);}} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Description *</label>
                        <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[120px]" value={newJob.description} onChange={(e) => {setNewJob({...newJob, description: e.target.value}); setError(null);}} />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Skills *</label>
                        <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="React, SQL" value={newJob.skills} onChange={(e) => {setNewJob({...newJob, skills: e.target.value}); setError(null);}} />
                      </div>

                      <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl">Publish Listing</button>
                    </form>
                  </div>
                )}

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                   <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                       <thead>
                         <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                           <th className="px-8 py-5">Position</th>
                           <th className="px-8 py-5">Applicants</th>
                           <th className="px-8 py-5 text-right">Actions</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                         {myJobs.map(job => (
                           <tr key={job.id} className="hover:bg-slate-50/50">
                             <td className="px-8 py-6">
                               <p className="font-bold text-slate-900">{job.title}</p>
                               <p className="text-[10px] text-slate-400">{job.location} • {job.salary}</p>
                             </td>
                             <td className="px-8 py-6"><span className="font-bold text-slate-900">{job.applicantsCount}</span></td>
                             <td className="px-8 py-6 text-right">
                                <button onClick={() => setSelectedJobForApplicants(job)} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800">View Applicants</button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              </>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 max-w-4xl mx-auto">
                 <h2 className="text-2xl font-bold mb-8">Company Profile</h2>
                 <form onSubmit={handleSaveCompanyProfile} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Company Name" value={companyForm.name} onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})} />
                       <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Location" value={companyForm.location} onChange={(e) => setCompanyForm({...companyForm, location: e.target.value})} />
                    </div>
                    <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl">Save Profile</button>
                 </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
