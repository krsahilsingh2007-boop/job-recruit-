
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { COLORS } from '../constants';

interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2" style={{ color: COLORS.primary }}>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            JobPortal
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">Jobs</Link>
            <Link to="/companies" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">Companies</Link>
            <Link to="/services" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">Services</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search jobs here"
                className="pl-4 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs outline-none focus:ring-2 focus:ring-blue-500/20 w-48"
              />
              <div className="absolute right-1 top-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
            </div>
          </div>

          {!user ? (
            <>
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-semibold border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to={user.role === 'CANDIDATE' ? '/candidate' : '/recruiter'} 
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-slate-500">{user.name.charAt(0)}</span>
                  )}
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
