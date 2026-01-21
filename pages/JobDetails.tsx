
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Job, User } from '../types';
import { db } from '../databaseService';

interface JobDetailsProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ user, onUpdateUser }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const isSaved = user?.savedJobIds?.includes(id || '') || false;

  useEffect(() => {
    const fetchJobData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const jobData = await db.jobs.findOne(id);
        setJob(jobData);

        if (user && id) {
          const userApps = await db.applications.find({ candidateId: user.id, jobId: id });
          setHasApplied(userApps.length > 0);
        }
      } catch (err) {
        console.error("Failed to fetch job", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!job) return;

    setIsApplying(true);
    setError(null);

    try {
      await db.applications.insertOne({
        jobId: job.id,
        candidateId: user.id
      });
      setHasApplied(true);
    } catch (err: any) {
      setError(err.message || "Failed to apply for the job");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user || !id) {
      navigate('/login');
      return;
    }

    const currentSaved = user.savedJobIds || [];
    let updatedSaved: string[];

    if (currentSaved.includes(id)) {
      updatedSaved = currentSaved.filter(savedId => savedId !== id);
    } else {
      updatedSaved = [...currentSaved, id];
    }

    try {
      const updatedUser = await db.users.updateOne(user.id, { savedJobIds: updatedSaved });
      if (updatedUser) {
        onUpdateUser(updatedUser);
      }
    } catch (err) {
      console.error("Failed to update saved jobs", err);
    }
  };

  const handleShare = async () => {
    let shareUrl = window.location.href;
    
    try {
      // Normalize URL for standard browsers
      const urlObj = new URL(shareUrl);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        shareUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
      }
    } catch (e) {
      shareUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
    }

    const shareData = {
      title: job?.title || 'Job Opportunity',
      text: `Check out this job: ${job?.title} at ${job?.company} on JobPortal`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        throw new Error("Share not available");
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback("Link copied to clipboard!");
        setTimeout(() => setShareFeedback(null), 3000);
      } catch (clipErr) {
        console.error("Sharing failed", clipErr);
        setError("Unable to share or copy link");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Fetching job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Job Not Found</h2>
          <Link to="/search" className="text-blue-600 font-bold hover:underline">Back to Job Search</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <nav className="mb-8 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/search" className="hover:text-blue-600 transition-colors">Jobs</Link>
          <span>/</span>
          <span className="text-slate-600">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row items-start gap-8 mb-10">
                <img src={job.logo} alt={job.company} className="w-20 h-20 rounded-[1.5rem] object-cover border border-slate-100 shadow-sm" />
                <div className="flex-grow">
                  <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{job.title}</h1>
                  <p className="text-lg font-bold text-blue-600 mb-6">{job.company}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                       <p className="text-sm font-bold text-slate-700">{job.experience}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salary</p>
                       <p className="text-sm font-bold text-slate-700">{job.salary}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                       <p className="text-sm font-bold text-slate-700">{job.location}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode</p>
                       <p className="text-sm font-bold text-slate-700">{job.workMode}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 py-6 border-y border-slate-50 mb-10">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Posted {job.postedAt}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{job.applicantsCount} Applicants</span>
                 </div>
              </div>

              <div className="space-y-10">
                <section>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Job Description</h3>
                  <div className="text-slate-600 leading-relaxed prose prose-slate max-w-none whitespace-pre-line">
                    {job.description}
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                      <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-100 uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                   {error && (
                     <div className="mb-4 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                        {error}
                     </div>
                   )}
                   
                   <button 
                    onClick={handleApply}
                    disabled={hasApplied || isApplying}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl ${
                      hasApplied 
                        ? 'bg-green-500 text-white cursor-default' 
                        : isApplying 
                          ? 'bg-slate-200 text-slate-400 animate-pulse' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                    }`}
                   >
                     {hasApplied ? '✓ Applied' : isApplying ? 'Applying...' : 'Apply Now'}
                   </button>
                   
                   <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
                     {hasApplied ? 'Application submitted successfully' : 'Takes less than a minute'}
                   </p>

                   <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                      {shareFeedback && (
                        <div className="p-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase text-center rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-1">
                          {shareFeedback}
                        </div>
                      )}
                      
                      <button 
                        onClick={handleSaveToggle}
                        className={`w-full py-4 border-2 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 ${
                          isSaved 
                            ? 'bg-amber-50 border-amber-500 text-amber-600' 
                            : 'border-slate-100 text-slate-700 hover:border-blue-600 hover:text-blue-600'
                        }`}
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                         {isSaved ? 'Saved for later' : 'Save for later'}
                      </button>
                      
                      <button 
                        onClick={handleShare}
                        className="w-full py-4 border-2 border-slate-100 text-slate-700 font-bold text-xs rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                         Share this job
                      </button>
                   </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white">
                   <h4 className="text-lg font-bold mb-2">Job Alert</h4>
                   <p className="text-slate-400 text-xs mb-6 font-medium">Get similar jobs like this in your inbox daily.</p>
                   <button className="w-full py-4 bg-white/10 text-white border border-white/10 text-xs font-bold rounded-xl hover:bg-white/20 transition-all">Create Alert</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
