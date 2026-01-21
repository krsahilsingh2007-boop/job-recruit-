
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { db } from '../databaseService';

interface LoginProps {
  setUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('CANDIDATE');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || isLoggingIn) return;

    setIsLoggingIn(true);
    try {
      // Check if user exists in our mock "MongoDB"
      let userInDb = await db.users.findOne(email);
      
      if (!userInDb) {
        // Register new user
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          role,
          profilePic: `https://picsum.photos/seed/${name}/200/200`,
          savedJobIds: []
        };
        userInDb = await db.users.insertOne(newUser);
      }
      
      setUser(userInDb);
      navigate(userInDb.role === 'CANDIDATE' ? '/' : '/recruiter');
    } catch (err) {
      console.error("Login Error:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Welcome Back</h2>
        <p className="text-slate-500 text-center mb-8">Login to your professional dashboard</p>

        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-8">
           <button 
            onClick={() => setRole('CANDIDATE')}
            className={`flex-grow py-2 text-sm font-bold rounded-lg transition-all ${role === 'CANDIDATE' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
           >
             Candidate
           </button>
           <button 
            onClick={() => setRole('RECRUITER')}
            className={`flex-grow py-2 text-sm font-bold rounded-lg transition-all ${role === 'RECRUITER' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
           >
             Recruiter
           </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="e.g. Rahul Sharma"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="rahul@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-50"
          >
            {isLoggingIn ? 'Logging in...' : `Sign In as ${role.charAt(0) + role.slice(1).toLowerCase()}`}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8">
          By continuing, you agree to JobPortal's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
