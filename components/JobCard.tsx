
import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, compact = false }) => {
  const visibleSkills = job.skills.slice(0, 3);
  const remainingSkills = job.skills.slice(3);
  const hasMore = remainingSkills.length > 0;

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 group ${compact ? 'flex flex-col' : 'flex gap-4'}`}>
      <div className={`${compact ? 'mb-3' : 'w-12 h-12 flex-shrink-0'}`}>
        <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg object-cover" />
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start mb-1">
          <Link 
            to={`/job/${job.id}`} 
            className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate"
          >
            {job.title}
          </Link>
          {!compact && (
             <button className="text-slate-300 hover:text-amber-400 transition-colors flex-shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
             </button>
          )}
        </div>
        
        <p className="text-sm font-medium text-slate-700 mb-2">{job.company}</p>
        
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {job.experience}
          </span>
          <span className="flex items-center gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            {job.salary}
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {job.location}
          </span>
        </div>
        
        {!compact && (
          <div className="flex flex-wrap gap-2 mb-4">
            {visibleSkills.map(skill => (
              <span key={skill} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded text-[10px] font-bold border border-slate-100 uppercase tracking-tight">
                {skill}
              </span>
            ))}
            {hasMore && (
              <div className="relative group/tooltip inline-block">
                <span className="cursor-pointer px-2.5 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100 uppercase tracking-tight hover:bg-blue-100 transition-colors">
                  +{remainingSkills.length} more
                </span>
                
                {/* Refined Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 z-20 w-max max-w-[240px] bg-slate-900 text-white text-[10px] p-3 rounded-xl shadow-2xl transition-all duration-200 transform translate-y-2 group-hover/tooltip:translate-y-0 pointer-events-none">
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {remainingSkills.map(skill => (
                      <span key={skill} className="bg-white/10 px-2 py-0.5 rounded uppercase tracking-tighter whitespace-nowrap">
                        {skill}
                      </span>
                    ))}
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-slate-900"></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{job.postedAt}</span>
          <Link 
            to={`/job/${job.id}`}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            Apply Now
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
