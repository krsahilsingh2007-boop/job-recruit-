
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import AiAssistant from './components/AiAssistant';
import Home from './pages/Home';
import Search from './pages/Search';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Companies from './pages/Companies';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Services from './pages/Services';
import Blogs from './pages/Blogs';
import { User, Job } from './types';
import { MOCK_JOBS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('jobs');
    return saved ? JSON.parse(saved) : MOCK_JOBS;
  });

  const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
    const saved = localStorage.getItem('appliedJobs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  const handleApply = (jobId: string) => {
    if (!user) return;
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j));
    }
  };

  const handlePostJob = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home jobs={jobs} user={user} />} />
            <Route path="/search" element={<Search jobs={jobs} />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route 
              path="/job/:id" 
              element={
                <JobDetails 
                  user={user} 
                  onUpdateUser={handleUpdateUser}
                />
              } 
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            
            <Route 
              path="/candidate" 
              element={user?.role === 'CANDIDATE' ? <CandidateDashboard user={user} jobs={jobs} appliedJobs={appliedJobs} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/recruiter" 
              element={user?.role === 'RECRUITER' ? <RecruiterDashboard user={user} jobs={jobs} onPostJob={handlePostJob} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        
        {/* Global AI Career Assistant */}
        <AiAssistant />

        <footer className="bg-slate-900 text-slate-400 py-10 mt-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">JobPortal</h3>
              <p className="text-sm">Connecting talent with opportunities worldwide. The most trusted career platform.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">For Candidates</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/search" className="hover:text-blue-400">Search Jobs</Link></li>
                <li><Link to="/companies" className="hover:text-blue-400">Job Alerts</Link></li>
                <li><Link to="/blogs" className="hover:text-blue-400">Career Advice</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-blue-400">Post a Job</Link></li>
                <li><a href="#" className="hover:text-blue-400">Hiring Solutions</a></li>
                <li><a href="#" className="hover:text-blue-400">Resume Database</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-xs font-bold">In</span>
                <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer text-xs font-bold">X</span>
                <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer text-xs font-bold">Ig</span>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-10 pt-8 border-t border-slate-800 text-center text-xs">
            © 2024 JobPortal. All rights reserved. Built with ❤️ for professionals.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
