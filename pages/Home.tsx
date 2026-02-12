
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col text-dwello-indigo bg-dwello-parchment">
      <nav className="h-24 flex items-center justify-between px-8 md:px-24 bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-dwello-lilac/20">
        <div className="text-4xl font-black tracking-tighter text-dwello-indigo">
          <span className="text-dwello-silk">D</span>WELLO
        </div>
        <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-widest">
          <a href="#features" className="hover:text-dwello-grape">Capabilities</a>
          <a href="#about" className="hover:text-dwello-grape">Philosophy</a>
          <div className="h-4 w-px bg-dwello-lilac/30"></div>
          <Link to="/login" className="hover:text-dwello-grape">Login</Link>
          <Link to="/signup" className="px-8 py-3 rounded-2xl bg-dwello-indigo text-white hover:bg-dwello-grape transition-all shadow-xl shadow-dwello-indigo/20">Initialize</Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-8 py-32 bg-gradient-to-b from-white to-dwello-parchment">
        <div className="mb-6 px-4 py-1.5 rounded-full bg-dwello-silk/20 text-dwello-indigo text-[10px] font-black uppercase tracking-[0.2em] border border-dwello-silk/30">
          The New Standard for Modern Builders
        </div>
        <h1 className="text-6xl md:text-8xl font-black max-w-5xl mb-8 leading-[0.9] tracking-tighter">
          Architectural Intelligence <br /> <span className="text-dwello-silk">Refined by AI.</span>
        </h1>
        <p className="text-xl md:text-2xl text-dwello-grape/80 max-w-3xl mb-12 font-medium leading-relaxed">
          The all-in-one execution platform for builders to manage logistics, visualize 3D progress, and showcase elite project portfolios.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link to="/signup" className="px-12 py-5 rounded-3xl bg-dwello-indigo text-white font-extrabold text-lg shadow-2xl shadow-dwello-indigo/30 hover:scale-105 transition-all">
            Start Free Deployment
          </Link>
          <button className="px-12 py-5 rounded-3xl bg-white border-2 border-dwello-indigo/10 text-dwello-indigo font-bold text-lg hover:bg-dwello-parchment transition-all">
            Review the Deck
          </button>
        </div>

        <div className="mt-32 w-full max-w-6xl rounded-[48px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(34,34,59,0.2)] border-[12px] border-white relative group">
          <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop" alt="Interface Preview" className="w-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-dwello-indigo/40 to-transparent"></div>
        </div>
      </section>

      <section id="features" className="py-32 px-8 md:px-24 bg-white">
        <h2 className="text-5xl font-black text-center mb-24 tracking-tighter">Engineering <span className="text-dwello-silk">Certainty.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { title: 'Logistics AI', desc: 'Auto-predicted resource burn rates using Groq-fast inference.', icon: '⚡' },
            { title: 'Spatial Blueprint', desc: 'Interactive floor-by-floor 3D models synchronized with tasks.', icon: '🏗️' },
            { title: 'Portfolio Engine', desc: 'AI-generated showcase content for client-facing channels.', icon: '📱' },
            { title: 'Smart Gantt', desc: 'Deterministic scheduling that adapts to real-world delays.', icon: '📅' },
          ].map((feat, i) => (
            <div key={i} className="p-10 rounded-[40px] bg-dwello-parchment/40 border border-dwello-lilac/10 hover:shadow-2xl hover:bg-white transition-all group">
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform origin-left">{feat.icon}</div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{feat.title}</h3>
              <p className="text-dwello-grape/80 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-dwello-indigo text-dwello-parchment py-24 px-8 md:px-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="space-y-4">
            <div className="text-4xl font-black tracking-tighter">
              <span className="text-dwello-silk">D</span>WELLO
            </div>
            <p className="text-sm font-bold opacity-60">Building the foundations of the next generation.</p>
          </div>
          <div className="flex flex-wrap gap-12 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-dwello-silk">Intelligence</a>
            <a href="#" className="hover:text-dwello-silk">Deployment</a>
            <a href="#" className="hover:text-dwello-silk">Confidentiality</a>
            <a href="#" className="hover:text-dwello-silk">Connect</a>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between text-[10px] font-bold opacity-40 uppercase tracking-widest gap-6">
          <p>&copy; 2024 Dwello Execution Systems. Global Presence.</p>
          <div className="flex gap-8">
            <span>ISO 9001 Certified</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
