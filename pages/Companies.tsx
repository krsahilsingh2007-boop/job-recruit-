
import React, { useState } from 'react';
import { MOCK_COMPANIES } from '../constants';

const Companies: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredCompanies = MOCK_COMPANIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Discover Top Companies</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Explore India's best workplaces. Read reviews, compare ratings and find your next dream company.</p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search companies by name or industry..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-4 top-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCompanies.map(company => (
            <div key={company.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all group">
              <div className="flex items-start justify-between mb-4">
                <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {company.rating}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{company.reviews} Reviews</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{company.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{company.industry}</p>
              <p className="text-xs text-slate-600 line-clamp-2 mb-6 min-h-[2.5rem]">{company.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="text-xs">
                  <span className="font-bold text-slate-900">{company.activeJobs}</span>
                  <span className="text-slate-500 ml-1">Active Jobs</span>
                </div>
                <button className="text-blue-600 font-bold text-xs hover:underline">View Jobs</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
