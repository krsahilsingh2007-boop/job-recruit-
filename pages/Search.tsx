
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import { db } from '../databaseService';

const Search: React.FC = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initialQuery = queryParams.get('q') || '';

  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allAvailableSkills, setAllAvailableSkills] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    experience: 'All',
    salaryRange: 'All',
    workMode: [] as string[],
    skills: [] as string[]
  });

  // Initial load of skills for the filter list
  useEffect(() => {
    const fetchSkills = async () => {
      const jobs = await db.jobs.find();
      const skillSet = new Set<string>();
      jobs.forEach(job => job.skills.forEach(skill => skillSet.add(skill)));
      setAllAvailableSkills(Array.from(skillSet).sort());
    };
    fetchSkills();
  }, []);

  // "MongoDB Query" execution whenever filters or search terms change
  useEffect(() => {
    const executeSearch = async () => {
      setIsLoading(true);
      
      let salaryMin: number | undefined;
      let salaryMax: number | undefined;

      if (filters.salaryRange !== 'All') {
        if (filters.salaryRange === '15+') {
          salaryMin = 15;
        } else {
          const [min, max] = filters.salaryRange.split('-').map(Number);
          salaryMin = min;
          salaryMax = max;
        }
      }

      // Calling our mock MongoDB find()
      const results = await db.jobs.find({
        text: localQuery,
        skills: filters.skills,
        workMode: filters.workMode,
        salaryMin,
        salaryMax
      });

      setFilteredJobs(results);
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(executeSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [localQuery, filters]);

  const toggleFilter = (type: 'workMode' | 'skills', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const salaryOptions = [
    { label: 'All', value: 'All' },
    { label: '0-3 Lakhs', value: '0-3' },
    { label: '3-6 Lakhs', value: '3-6' },
    { label: '6-10 Lakhs', value: '6-10' },
    { label: '10-15 Lakhs', value: '10-15' },
    { label: '15+ Lakhs', value: '15+' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
              Filter By
              <button onClick={() => setFilters({ experience: 'All', salaryRange: 'All', workMode: [], skills: [] })} className="text-[10px] uppercase tracking-widest text-blue-600 font-bold hover:text-blue-700">Clear All</button>
            </h3>

            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Work Mode</h4>
                <div className="space-y-3">
                  {['Remote', 'On-site', 'Hybrid'].map(mode => (
                    <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${filters.workMode.includes(mode) ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover:border-blue-400'}`}>
                        {filters.workMode.includes(mode) && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <input type="checkbox" className="hidden" checked={filters.workMode.includes(mode)} onChange={() => toggleFilter('workMode', mode)} />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Salary Range</h4>
                <div className="space-y-3">
                  {salaryOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${filters.salaryRange === option.value ? 'border-blue-600' : 'border-slate-200 group-hover:border-blue-400'}`}>
                        {filters.salaryRange === option.value && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                      </div>
                      <input type="radio" className="hidden" name="salary" checked={filters.salaryRange === option.value} onChange={() => setFilters({...filters, salaryRange: option.value})} />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Top Skills</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {allAvailableSkills.map(skill => (
                    <label key={skill} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${filters.skills.includes(skill) ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover:border-blue-400'}`}>
                        {filters.skills.includes(skill) && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <input type="checkbox" className="hidden" checked={filters.skills.includes(skill)} onChange={() => toggleFilter('skills', skill)} />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          <div className="bg-white border border-slate-200 rounded-3xl p-2 mb-6 flex items-center relative shadow-sm">
            <div className="flex-grow relative">
              <svg className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                type="text" 
                placeholder="Job title, company or specific skill..." 
                className="w-full pl-14 pr-4 py-4 bg-transparent outline-none text-slate-700 text-sm font-medium" 
                value={localQuery} 
                onChange={(e) => setLocalQuery(e.target.value)} 
              />
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {filters.skills.map(skill => (
              <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100">
                {skill}
                <button onClick={() => toggleFilter('skills', skill)} className="hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            ))}
            {filters.workMode.map(mode => (
              <span key={mode} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                {mode}
                <button onClick={() => toggleFilter('workMode', mode)} className="hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="text-sm font-medium text-slate-500">
                {isLoading ? 'Searching database...' : <>Found <span className="font-bold text-slate-900">{filteredJobs.length}</span> matching opportunities</>}
              </p>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-white border border-slate-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="bg-white p-16 text-center rounded-[2rem] border border-slate-200 border-dashed">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No matching jobs in our database</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Try broad keywords or resetting filters to explore more options.</p>
                <button onClick={() => setFilters({ experience: 'All', salaryRange: 'All', workMode: [], skills: [] })} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">Reset All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
