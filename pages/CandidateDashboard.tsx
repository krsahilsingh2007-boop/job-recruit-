
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Job, JobAlertPreferences } from '../types';
import JobCard from '../components/JobCard';
import { getResumeFeedback } from '../geminiService';

interface CandidateDashboardProps {
  user: User;
  jobs: Job[];
  appliedJobs: string[];
  onUpdateUser: (user: User) => void;
}

const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ user, jobs, appliedJobs, onUpdateUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'home' | 'alerts'>('home');
  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const [isEditingAlerts, setIsEditingAlerts] = useState(false);
  
  // Resume Upload State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Feedback State
  const [resumeSummary, setResumeSummary] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    designation: user.designation || '',
    education: user.education || '',
    skills: user.skills?.join(', ') || ''
  });

  const [alertForm, setAlertForm] = useState<JobAlertPreferences>({
    skills: user.jobAlerts?.skills || user.skills || [],
    location: user.jobAlerts?.location || user.location || '',
    minSalary: user.jobAlerts?.minSalary || '0'
  });

  const completionPercentage = useMemo(() => {
    let score = 15; // Base score
    if (user.designation) score += 25;
    if (user.education) score += 20;
    if (user.skills && user.skills.length > 0) score += 20;
    if (user.resumeName) score += 20;
    return Math.min(score, 100);
  }, [user]);

  const matchingJobs = useMemo(() => {
    if (!user.jobAlerts) return [];
    const { skills, location, minSalary } = user.jobAlerts;
    const minSal = parseFloat(minSalary) || 0;

    return jobs.filter(job => {
      const jobMinSal = job.minSalary || 0;
      const skillMatch = skills.length === 0 || job.skills.some(s => 
        skills.some(pref => s.toLowerCase().includes(pref.toLowerCase()))
      );
      const locationMatch = !location || job.location.toLowerCase().includes(location.toLowerCase());
      const salaryMatch = jobMinSal >= minSal;
      
      return skillMatch && locationMatch && salaryMatch;
    }).slice(0, 10);
  }, [user.jobAlerts, jobs]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      designation: profileForm.designation,
      education: profileForm.education,
      skills: profileForm.skills.split(',').map(s => s.trim()).filter(s => s),
    });
    setIsCompletingProfile(false);
  };

  const handleAlertUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      jobAlerts: alertForm
    });
    setIsEditingAlerts(false);
  };

  const handleGetFeedback = async () => {
    if (!resumeSummary.trim()) {
      alert("Please enter a summary first.");
      return;
    }
    setIsFeedbackLoading(true);
    setAiFeedback(null);
    const feedback = await getResumeFeedback(resumeSummary);
    setAiFeedback(feedback);
    setIsFeedbackLoading(false);
  };

  // Resume Upload Logic
  const handleFileUpload = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            onUpdateUser({ ...user, resumeName: file.name });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const navItems = [
    { id: 'home', name: 'My home', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id: 'alerts', name: 'Job Alerts', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> },
    { id: 'jobs', name: 'Search Jobs', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, path: '/search' },
    { id: 'blogs', name: 'Career Blogs', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, path: '/blogs' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-center">
             <div className="relative w-28 h-28 mx-auto mb-4">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="52" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <circle 
                    cx="56" cy="56" r="52" 
                    fill="none" stroke="#ff4d4d" strokeWidth="3" 
                    strokeDasharray="326.7"
                    strokeDashoffset={326.7 - (326.7 * completionPercentage / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white shadow-sm bg-slate-100 flex items-center justify-center">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-slate-300">{user.name.charAt(0)}</span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-white shadow-md border border-slate-100 rounded-full px-2 py-0.5 text-[10px] font-bold text-red-500">
                  {completionPercentage}%
                </div>
             </div>
             <h2 className="text-lg font-bold text-slate-900 mb-6">{user.name}</h2>
             <div className="bg-red-50/50 rounded-2xl p-5 text-left border border-red-50">
                <h3 className="text-sm font-bold text-slate-900 mb-3">What are you missing?</h3>
                <ul className="space-y-3 mb-5">
                   {['Daily job recommendations', 'Job application updates', 'Direct jobs from recruiters'].map(text => (
                     <li key={text} className="flex items-start gap-2 text-[11px] text-slate-600 font-medium">
                        <div className="mt-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                           <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        {text}
                     </li>
                   ))}
                </ul>
                <button onClick={() => setIsCompletingProfile(true)} className="w-full py-2.5 bg-[#f95738] text-white text-xs font-bold rounded-full hover:bg-[#e84a2b] shadow-lg shadow-orange-100 transition-all">Complete profile</button>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
             <div className="p-2 space-y-1">
                {navItems.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      if (item.path) navigate(item.path);
                      else setActiveTab(item.id as any);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
             </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-9 space-y-6">
          {activeTab === 'home' ? (
            <>
              {/* Resume Management Section */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Resume Management</h2>
                    {user.resumeName && !isUploading && (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Verified
                      </span>
                    )}
                 </div>

                 <div 
                  onDragOver={onDragOver}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={onDrop}
                  className={`relative group rounded-[2rem] border-2 border-dashed transition-all p-10 text-center flex flex-col items-center justify-center gap-4 ${
                    isDragOver ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
                  }`}
                 >
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      accept=".pdf,.doc,.docx" 
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    />

                    {isUploading ? (
                      <div className="w-full max-w-sm space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                          <span>Uploading Resume...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Please do not refresh the page.</p>
                      </div>
                    ) : user.resumeName ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.resumeName}</p>
                          <p className="text-xs text-slate-500">Updated just now</p>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                          >
                            Update Resume
                          </button>
                          <button 
                            onClick={() => onUpdateUser({ ...user, resumeName: undefined })}
                            className="px-6 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Drag & Drop Resume</h4>
                          <p className="text-slate-500 text-sm">Support for PDF, DOCX (Max 2MB)</p>
                        </div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                        >
                          Select File
                        </button>
                      </>
                    )}
                 </div>
              </div>

              {/* AI Resume Summary Section */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <svg className="text-blue-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"/><path d="M8.5 14h.01"/><path d="M15.5 14h.01"/><path d="M8 18a5 5 0 0 0 8 0"/></svg>
                      Resume Summary Optimizer
                    </h2>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider border border-blue-100">AI Powered</span>
                 </div>
                 <div className="space-y-4">
                    <p className="text-sm text-slate-500">Enter your professional summary to get actionable tips from our AI Recruiter.</p>
                    <textarea 
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[120px] transition-all"
                      placeholder="e.g. Results-driven Frontend Developer with 5 years of experience in React..."
                      value={resumeSummary}
                      onChange={(e) => setResumeSummary(e.target.value)}
                    />
                    <button 
                      onClick={handleGetFeedback}
                      disabled={isFeedbackLoading || !resumeSummary.trim()}
                      className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-200 transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
                    >
                      {isFeedbackLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Analyzing...
                        </>
                      ) : 'Get AI Feedback'}
                    </button>

                    {aiFeedback && (
                      <div className="mt-8 p-6 bg-blue-50/50 border border-blue-100 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
                         <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.3 8.38 8.38 0 0 1 3.9.9"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">Expert Feedback</h4>
                         </div>
                         <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line prose-sm prose-blue">
                           {aiFeedback}
                         </div>
                      </div>
                    )}
                 </div>
              </div>

              {/* Activity Feed */}
              <div>
                 <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Applications</h3>
                 {appliedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {jobs.filter(j => appliedJobs.includes(j.id)).map(job => <JobCard key={job.id} job={job} compact={true} />)}
                    </div>
                 ) : (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-sm">No applications yet.</div>
                 )}
              </div>
            </>
          ) : (
            /* JOB ALERTS VIEW */
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">Custom Job Alerts</h2>
                        <p className="text-slate-500 text-sm">We'll find the best matches based on your specific criteria.</p>
                     </div>
                     <button 
                        onClick={() => setIsEditingAlerts(true)}
                        className="px-5 py-2.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition-all border border-blue-100"
                     >
                        Modify Alerts
                     </button>
                  </div>

                  {user.jobAlerts ? (
                    <div className="flex flex-wrap gap-3">
                       <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Skills:</span>
                          <span className="text-xs font-bold text-slate-700">{user.jobAlerts.skills.join(', ')}</span>
                       </div>
                       <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Location:</span>
                          <span className="text-xs font-bold text-slate-700">{user.jobAlerts.location || 'Anywhere'}</span>
                       </div>
                       <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Min Salary:</span>
                          <span className="text-xs font-bold text-slate-700">₹{user.jobAlerts.minSalary}L+</span>
                       </div>
                    </div>
                  ) : (
                    <div className="p-10 text-center bg-blue-50/30 rounded-[2rem] border border-dashed border-blue-200">
                       <p className="text-slate-600 font-medium mb-4">You haven't set up any custom alerts yet.</p>
                       <button onClick={() => setIsEditingAlerts(true)} className="text-blue-600 font-bold hover:underline">Set Alert Preferences</button>
                    </div>
                  )}
               </div>

               <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 px-2 flex items-center gap-3">
                     Recommended for You
                     <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] rounded-full uppercase tracking-tighter">Live Matches</span>
                  </h3>
                  {matchingJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {matchingJobs.map(job => <JobCard key={job.id} job={job} />)}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                       </div>
                       <h4 className="text-lg font-bold text-slate-900 mb-2">No matches found</h4>
                       <p className="text-slate-500 text-sm max-w-xs mx-auto">Try broadening your alert preferences to see more opportunities.</p>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* JOB ALERT MODAL */}
      {isEditingAlerts && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-bold text-slate-900">Modify Job Alerts</h3>
                 <button onClick={() => setIsEditingAlerts(false)} className="text-slate-400 hover:text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <form onSubmit={handleAlertUpdate} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Skills</label>
                    <input 
                      type="text" placeholder="React, Python, Design..." 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
                      value={Array.isArray(alertForm.skills) ? alertForm.skills.join(', ') : ''}
                      onChange={(e) => setAlertForm({...alertForm, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Location</label>
                    <input 
                      type="text" placeholder="e.g. Bangalore, Remote" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
                      value={alertForm.location}
                      onChange={(e) => setAlertForm({...alertForm, location: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min Salary (Lakhs PA)</label>
                    <input 
                      type="number" placeholder="e.g. 15" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
                      value={alertForm.minSalary}
                      onChange={(e) => setAlertForm({...alertForm, minSalary: e.target.value})}
                    />
                 </div>
                 <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl transition-all">Save Preferences</button>
              </form>
           </div>
        </div>
      )}

      {/* PROFILE MODAL (Existing) */}
      {isCompletingProfile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-bold text-slate-900">Complete Profile</h3>
                 <button onClick={() => setIsCompletingProfile(false)} className="text-slate-400 hover:text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                 <input type="text" placeholder="Designation" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={profileForm.designation} onChange={(e) => setProfileForm({...profileForm, designation: e.target.value})} required />
                 <input type="text" placeholder="Education" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={profileForm.education} onChange={(e) => setProfileForm({...profileForm, education: e.target.value})} required />
                 <input type="text" placeholder="Skills" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={profileForm.skills} onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})} required />
                 <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700">Update Profile</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
