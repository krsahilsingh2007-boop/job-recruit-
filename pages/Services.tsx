
import React from 'react';
import { COLORS } from '../constants';

const Services: React.FC = () => {
  const serviceCategories = [
    {
      title: "Resume Writing",
      description: "Get a professional resume written by our experts.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
      color: "bg-blue-50 text-blue-600",
      plans: [
        { name: "Visual Resume", price: "₹2,500" },
        { name: "Text Resume", price: "₹1,800" },
        { name: "Cover Letter", price: "₹800" }
      ]
    },
    {
      title: "Recruiter Reach",
      description: "Increase your profile visibility and reach more recruiters.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
      color: "bg-orange-50 text-orange-600",
      plans: [
        { name: "Resume Display", price: "₹1,200" },
        { name: "Priority Applicant", price: "₹950" }
      ]
    },
    {
      title: "Learn & Certify",
      description: "Add credibility to your profile with top certifications.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
      color: "bg-green-50 text-green-600",
      plans: [
        { name: "Data Science", price: "₹15,000" },
        { name: "Cloud Architect", price: "₹12,000" }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Fast-Track Your Career</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Premium services designed to get you noticed by top recruiters and land your dream job faster.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {serviceCategories.map((cat, idx) => (
             <div key={idx} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <div className="p-8">
                   <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 mb-3">{cat.title}</h2>
                   <p className="text-slate-500 text-sm mb-8 leading-relaxed">{cat.description}</p>
                   
                   <div className="space-y-4">
                      {cat.plans.map((plan, pIdx) => (
                        <div key={pIdx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                           <span className="text-sm font-bold text-slate-700">{plan.name}</span>
                           <span className="text-sm font-black text-blue-600">{plan.price}</span>
                        </div>
                      ))}
                   </div>

                   <button className="w-full mt-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
                      Learn More
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Testimonial Banner */}
        <div className="mt-20 bg-blue-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
           <div className="relative z-10 max-w-3xl mx-auto">
              <div className="text-4xl mb-6">"</div>
              <p className="text-2xl font-medium italic mb-8">
                "Naukri Resume Services helped me structure my experience effectively. I saw a 40% increase in recruiter calls within the first week."
              </p>
              <div className="font-bold text-lg">Aradhana Dixit</div>
              <div className="text-blue-200 text-sm">Product Manager at TechNova</div>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>
      </div>
    </div>
  );
};

export default Services;
