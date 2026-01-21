
import React from 'react';

const Blogs: React.FC = () => {
  const blogs = [
    {
      title: "Top 10 High Paying Skills in 2024",
      category: "Career Advice",
      date: "May 15, 2024",
      image: "https://picsum.photos/seed/skills/600/400"
    },
    {
      title: "How to Answer 'Tell Me About Yourself' in Interviews",
      category: "Interview Tips",
      date: "May 12, 2024",
      image: "https://picsum.photos/seed/interview/600/400"
    },
    {
      title: "The Rise of Remote Work in Indian MNCs",
      category: "Industry Trends",
      date: "May 10, 2024",
      image: "https://picsum.photos/seed/remote/600/400"
    },
    {
      title: "Mastering React: A Guide for Beginners",
      category: "Technology",
      date: "May 8, 2024",
      image: "https://picsum.photos/seed/react/600/400"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Career Insights</h1>
          <p className="text-slate-500">Stay ahead with the latest job market trends and expert advice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {blogs.map((blog, idx) => (
             <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                <div className="h-48 overflow-hidden">
                   <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                   <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{blog.category}</span>
                   <h3 className="text-lg font-bold text-slate-900 mt-2 mb-4 leading-tight group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                   <p className="text-[10px] text-slate-400 font-medium">{blog.date}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
