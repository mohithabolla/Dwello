
import React, { useState } from 'react';

const Feedback: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-2xl border border-dwello-teal/10">
        <div className="space-y-6">
          <h1 className="text-4xl font-black text-dwello-dark-teal dark:text-dwello-yellow leading-tight">We'd love to <br/><span className="text-dwello-teal">hear from you</span></h1>
          <p className="opacity-70 font-medium">Have suggestions for Dwello? Found a bug? Or just want to say hi? Our team is always listening to the builders community.</p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-dwello-light flex items-center justify-center text-dwello-teal">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span className="font-bold">hello@dwello.build</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-dwello-light flex items-center justify-center text-dwello-teal">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span className="font-bold">San Francisco, CA</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-dwello-teal">Your Name</label>
            <input required type="text" className="w-full px-4 py-3 rounded-xl border-2 border-dwello-teal/10 focus:border-dwello-teal outline-none transition-all dark:bg-slate-700" placeholder="Alex Builder" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-dwello-teal">Email</label>
            <input required type="email" className="w-full px-4 py-3 rounded-xl border-2 border-dwello-teal/10 focus:border-dwello-teal outline-none transition-all dark:bg-slate-700" placeholder="alex@dwello.build" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-dwello-teal">Message Type</label>
            <select className="w-full px-4 py-3 rounded-xl border-2 border-dwello-teal/10 focus:border-dwello-teal outline-none transition-all dark:bg-slate-700">
              <option>General Feedback</option>
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>Partnership Inquiry</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-dwello-teal">Message</label>
            <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-dwello-teal/10 focus:border-dwello-teal outline-none transition-all dark:bg-slate-700" placeholder="How can we help you?"></textarea>
          </div>
          <button 
            disabled={submitted}
            className={`w-full py-4 rounded-xl font-black text-lg shadow-xl transition-all ${submitted ? 'bg-green-500 text-white' : 'bg-dwello-teal text-white hover:bg-dwello-dark-teal'}`}
          >
            {submitted ? 'Message Sent! ✨' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
