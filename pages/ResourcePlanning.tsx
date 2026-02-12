
import React from 'react';
import { MOCK_PROJECTS } from '../constants';

const ResourcePlanning: React.FC = () => {
  return (
    <div className="space-y-10 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter">Resource Logistics</h1>
          <p className="text-dwello-grape/70 font-medium">Predictive material and workforce burn rate analysis.</p>
        </div>
        <button className="bg-dwello-indigo text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
          Order Materials
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-dwello-lilac/20 shadow-sm">
            <h2 className="text-xl font-black text-dwello-indigo mb-8 flex items-center gap-3">
              <span className="w-2 h-6 bg-dwello-silk rounded-full"></span>
              Predicted Labor Demand (Weeks 1-12)
            </h2>
            <div className="h-64 flex items-end justify-between gap-4 px-4">
              {[60, 80, 45, 90, 100, 70, 50, 40, 85, 95, 60, 40].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-dwello-parchment rounded-full h-full relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-dwello-indigo group-hover:bg-dwello-silk transition-all duration-700" 
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                  <span className="text-[8px] font-black text-dwello-lilac">W{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-dwello-lilac/20 shadow-sm">
            <h2 className="text-xl font-black text-dwello-indigo mb-6">Active Workforce Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { team: 'Structural Force', members: 42, projects: 3 },
                { team: 'MEP Systems', members: 18, projects: 5 },
                { team: 'Finishing Guild', members: 24, projects: 2 },
                { team: 'Logistic Ops', members: 12, projects: 8 },
              ].map((team, i) => (
                <div key={i} className="p-6 rounded-2xl bg-dwello-parchment/30 border border-dwello-lilac/10 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-black text-dwello-indigo">{team.team}</div>
                    <div className="text-[10px] font-bold text-dwello-lilac uppercase tracking-wider">{team.projects} Active Sites</div>
                  </div>
                  <div className="text-2xl font-black text-dwello-indigo">{team.members}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-dwello-indigo text-dwello-parchment p-8 rounded-[32px] shadow-2xl">
            <h2 className="text-xl font-black text-dwello-silk mb-6">Inventory Status</h2>
            <div className="space-y-6">
              {[
                { item: 'Ready-Mix Concrete', stock: 85 },
                { item: 'Structural Rebar', stock: 40 },
                { item: 'Grade-A Timber', stock: 92 },
                { item: 'PVC Conduit', stock: 15 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>{item.item}</span>
                    <span className={item.stock < 20 ? 'text-red-400' : 'text-dwello-silk'}>{item.stock}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${item.stock < 20 ? 'bg-red-400' : 'bg-dwello-silk'}`} 
                      style={{ width: `${item.stock}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-4 bg-dwello-parchment text-dwello-indigo rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-dwello-silk transition-colors">
              Request Refill
            </button>
          </div>

          <div className="p-8 bg-dwello-silk/10 rounded-[32px] border-2 border-dwello-silk/30">
            <h3 className="text-sm font-black text-dwello-indigo uppercase tracking-widest mb-4">Shortage Alerts</h3>
            <p className="text-xs font-bold leading-relaxed opacity-70">
              Supply chain disruption in regional steel foundries may lead to a <span className="text-red-600">12% price hike</span> for Rebar starting next Tuesday.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePlanning;
