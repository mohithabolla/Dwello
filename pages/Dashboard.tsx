import React from 'react';
import { ICONS } from '../constants';
import api from '../api';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [logistics, setLogistics] = React.useState<any[]>([]);
  const [workers, setWorkers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, logRes, workRes] = await Promise.all([
          api.get('/projects'),
          api.get('/logistics'),
          api.get('/workers')
        ]);
        setProjects(projRes.data.data);
        setLogistics(logRes.data.data);
        setWorkers(workRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* ... header remains ... */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tight">Executive Dashboard</h1>
          <p className="text-dwello-grape/70 dark:text-dwello-lilac font-medium mt-1">Resource allocation and progress tracking overview.</p>
        </div>
        <Link to="/projects/new" className="bg-dwello-indigo text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-dwello-indigo/20 hover:scale-[1.02] transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Initialize New Project
        </Link>
      </header>

      {/* Metrics logic would need backend analytics endpoint, keeping static for now or using project summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Managed Assets', value: projects.length.toString().padStart(2, '0'), sub: 'Projects', color: 'bg-dwello-indigo text-white' },
          { label: 'Workforce Size', value: workers.length.toString().padStart(2, '0'), sub: 'Personnel', color: 'bg-white text-dwello-indigo' },
          { label: 'Pending Logistics', value: logistics.filter(l => l.deliveryStatus === 'Pending').length.toString().padStart(2, '0'), sub: 'Shipments', color: 'bg-dwello-parchment text-dwello-indigo' },
          { label: 'Material Spend', value: `$${Math.round(logistics.reduce((acc, l) => acc + l.cost, 0) / 1000)}k`, sub: 'Investment', color: 'bg-dwello-grape text-white' },
        ].map((metric, i) => (
          <div key={i} className={`${metric.color} p-6 rounded-3xl shadow-sm border border-dwello-lilac/10 flex flex-col justify-between h-40`}>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tighter">{metric.value}</span>
              <span className="text-xs font-bold opacity-60 uppercase">{metric.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-dwello-indigo">Real-time Portfolios</h2>
          <Link to="/projects" className="text-sm font-black uppercase tracking-widest text-dwello-grape hover:text-dwello-indigo border-b-2 border-dwello-silk/30">View Directory</Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-dwello-lilac">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {projects.map(project => (
              // Need to adapt BackendProject to ProjectCard props or update ProjectCard
              // For now, mapping inline or using a simplified card
              <div key={project._id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-dwello-lilac/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-dwello-indigo dark:text-dwello-silk">{project.name}</h3>
                    <p className="text-sm text-dwello-lilac">{project.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${project.status === 'In Progress' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>{project.status}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-dwello-lilac uppercase tracking-wider">Progress</span>
                      <span className="text-dwello-grape">{Math.round((project.currentFloor / project.expectedFloors) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-dwello-parchment rounded-full overflow-hidden">
                      <div className="h-full bg-dwello-grape" style={{ width: `${(project.currentFloor / project.expectedFloors) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-dwello-lilac font-bold uppercase tracking-widest mb-1">Budget Used</span>
                      <span className="text-base font-black text-dwello-indigo dark:text-dwello-parchment">${project.budgetUsed?.toLocaleString()} / ${project.budget?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-dwello-lilac font-bold uppercase tracking-widest mb-1">Client</span>
                      <span className="text-base font-black text-dwello-indigo dark:text-dwello-parchment">{project.clientName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dwello-lilac/10 flex justify-end">
                  <Link to={`/projects/${project._id}`} className="text-xs font-black uppercase tracking-widest text-dwello-indigo hover:text-dwello-grape flex items-center gap-1">
                    View Details <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center col-span-2 py-10 bg-dwello-parchment/20 rounded-xl border border-dashed border-dwello-lilac">
                <p className="text-dwello-lilac font-medium">No projects found. Initialize your first project.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-dwello-lilac/20 shadow-sm">
          <h2 className="text-xl font-black mb-6 flex items-center gap-3">
            <div className="w-2 h-6 bg-dwello-silk rounded-full"></div>
            Scheduling Dependencies
          </h2>
          <div className="space-y-6">
            {logistics.length > 0 ? logistics.slice(0, 3).map((dep, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-dwello-indigo uppercase tracking-wider">{dep.materialName} ({dep.supplierName})</span>
                    <span className="text-dwello-grape font-black">{dep.deliveryStatus} • {new Date(dep.deliveryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="h-1.5 bg-dwello-parchment rounded-full overflow-hidden">
                    <div className="h-full bg-dwello-indigo" style={{ width: dep.deliveryStatus === 'Delivered' ? '100%' : '30%' }}></div>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center py-10 text-dwello-lilac font-bold">No logistics dependencies mapped.</p>
            )}
          </div>
        </div>

        <div className="bg-dwello-indigo p-8 rounded-3xl shadow-2xl text-dwello-parchment flex flex-col">
          <div className="bg-dwello-silk/20 p-2 rounded-lg w-fit mb-4">
            {/* Use the ICONS object now correctly imported */}
            <ICONS.AI />
          </div>
          <h2 className="text-2xl font-black mb-4 text-dwello-silk">Groq-Plan™ Insights</h2>
          <p className="text-sm leading-relaxed opacity-80 mb-6">
            Azure Residency structural framing is currently <span className="text-dwello-silk font-bold">4 days ahead</span> of the LLaMA-predicted baseline.
          </p>
          <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac mb-2">Automated Risk Analysis</h3>
            <p className="text-xs italic">"Consider pre-ordering Level 3 finishes now to lock in current logistics pricing before the holiday surge."</p>
          </div>
          <button className="mt-6 w-full bg-dwello-silk text-dwello-indigo font-black py-4 rounded-2xl hover:bg-white transition-colors">
            Optimize Resource Flow
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
