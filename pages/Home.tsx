
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job, User } from '../types';
import JobCard from '../components/JobCard';
import { TOP_COMPANIES, MOCK_COMPANIES, COLORS } from '../constants';
import { db } from '../databaseService';

interface HomeProps {
  jobs: Job[];
  user: User | null;
}

const Home: React.FC<HomeProps> = ({ jobs: initialJobs, user }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobCount, setJobCount] = useState(1100);
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>(initialJobs.slice(0, 8));

  useEffect(() => {
    const fetchStats = async () => {
      const count = await db.jobs.count();
      setJobCount(count);
      const all = await db.jobs.find();
      setFeaturedJobs(all.slice(0, 8));
    };
    fetchStats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleResumeRedirect = () => {
    if (user?.role === 'CANDIDATE') {
      navigate('/candidate');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.1]">
            Find your dream job <br/><span style={{ color: COLORS.primary }}>at India's No. 1 Job Site</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
            Explore <span className="text-blue-600 font-bold">{jobCount.toLocaleString()}+</span> active jobs from top companies around the world.
          </p>

          <form 
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row items-center gap-2 p-2 bg-white rounded-[2rem] shadow-2xl border border-slate-100 max-w-3xl mx-auto"
          >
            <div className="flex-grow flex items-center px-6 w-full border-b md:border-b-0 md:border-r border-slate-100">
              <svg className="text-slate-400 mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                type="text" 
                placeholder="Skills, designations, companies" 
                className="w-full py-5 outline-none text-slate-700 bg-transparent text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center px-6 w-full md:w-1/3">
              <svg className="text-slate-400 mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <input 
                type="text" 
                placeholder="Enter location" 
                className="w-full py-5 outline-none text-slate-700 bg-transparent text-sm font-medium"
              />
            </div>
            <button 
              type="submit"
              className="w-full md:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs"
            >
              Search
            </button>
          </form>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs font-black text-slate-400 uppercase tracking-widest">
             <span className="text-slate-300">Trending:</span>
             <button onClick={() => navigate('/search?q=Remote')} className="hover:text-blue-600 transition-colors">Remote</button>
             <button onClick={() => navigate('/search?q=MNC')} className="hover:text-blue-600 transition-colors">MNC</button>
             <button onClick={() => navigate('/search?q=Engineering')} className="hover:text-blue-600 transition-colors">Engineering</button>
             <button onClick={() => navigate('/search?q=Sales')} className="hover:text-blue-600 transition-colors">Sales</button>
          </div>
        </div>
      </section>

      {/* Featured Companies Hiring Now */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Top companies hiring now</h2>
            <p className="text-slate-500 font-medium">Connect with industry leaders and innovative startups</p>
          </div>
          <button 
            onClick={() => navigate('/companies')}
            className="text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-700 flex items-center gap-2 group"
          >
            View All Companies
            <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {MOCK_COMPANIES.slice(0, 11).map(company => (
            <div 
              key={company.id} 
              onClick={() => navigate(`/search?q=${company.name}`)}
              className="bg-white border border-slate-100 rounded-[2.5rem] p-8 text-center hover:shadow-2xl hover:shadow-slate-200 transition-all cursor-pointer group"
            >
              <img src={company.logo} alt={company.name} className="w-16 h-16 mx-auto mb-6 rounded-2xl object-cover border border-slate-50 group-hover:scale-110 transition-transform shadow-sm" />
              <h3 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-blue-600">{company.name}</h3>
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-400">
                <span className="text-amber-500">★ {company.rating}</span>
                <span className="text-slate-200">|</span>
                <span>{company.reviews} reviews</span>
              </div>
            </div>
          ))}
          <div className="bg-slate-900 border border-slate-900 rounded-[2.5rem] p-8 text-center text-white flex flex-col items-center justify-center hover:bg-slate-800 transition-all cursor-pointer shadow-2xl shadow-slate-200" onClick={() => navigate('/companies')}>
            <span className="text-3xl font-black mb-1">100+</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">More</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-12">
        {/* Jobs Feed */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-900">Featured Opportunities</h2>
            <button onClick={() => navigate('/search')} className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
              Browse All Jobs
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <button 
              onClick={() => navigate('/search')}
              className="px-12 py-5 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-3xl hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
             >
               Explore More {jobCount - 8} Jobs
             </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest">Hot Employers</h3>
              <div className="space-y-6">
                {TOP_COMPANIES.map(company => (
                  <div key={company.name} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/search?q=${company.name}`)}>
                    <div className="flex items-center gap-4">
                      <img src={company.logo} alt={company.name} className="w-12 h-12 rounded-xl bg-slate-100 object-cover shadow-sm border border-slate-50" />
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{company.name}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-black uppercase">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          {company.rating} Rating
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/companies')}
                className="w-full mt-8 py-4 text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all border border-blue-100"
              >
                All Companies
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] p-8 text-white overflow-hidden relative shadow-2xl shadow-blue-200">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-3 leading-tight uppercase tracking-tight">Boost your career visibility</h3>
                <p className="text-blue-100 text-sm mb-8 font-medium leading-relaxed opacity-80">Let recruiters find you. Get a professional profile score instantly.</p>
                <button 
                  onClick={handleResumeRedirect}
                  className="w-full py-4 bg-white text-blue-600 text-xs font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 uppercase tracking-[0.2em]"
                >
                  Upload CV
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
