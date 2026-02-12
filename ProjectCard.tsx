
import React from 'react';
import { Project } from '../types';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-dwello-lilac/10 overflow-hidden flex flex-col sm:flex-row hover:shadow-xl transition-all group">
      <div className="w-full sm:w-52 h-52 sm:h-auto bg-dwello-parchment relative overflow-hidden">
        <img
          src={`https://images.unsplash.com/photo-1510627489930-0c1b0ba8fa70?q=80&w=400&auto=format&fit=crop&sig=${project.id}`}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-dwello-indigo text-dwello-parchment text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
          {project.type}
        </div>
      </div>
      <div className="flex-1 p-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter">{project.name}</h3>
              <p className="text-xs font-bold text-dwello-lilac uppercase tracking-widest mt-1">{project.location}</p>
            </div>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-dwello-parchment text-dwello-indigo'
              }`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm font-medium text-dwello-grape/70 dark:text-slate-400 mb-6">
            {project.area.toLocaleString()} sqft • {project.floors} Floors • ${project.budget.toLocaleString()}
          </p>

          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-dwello-indigo">
              <span>Execution</span>
              <span>{project.completionPercentage}%</span>
            </div>
            <div className="h-2 bg-dwello-parchment dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-dwello-indigo transition-all duration-1000 ease-out"
                style={{ width: `${project.completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            to={`/projects/${project.id}`}
            className="flex-1 text-center bg-dwello-indigo text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-dwello-grape transition-all shadow-lg shadow-dwello-indigo/10"
          >
            Manage Specs
          </Link>
          <button className="px-5 py-3 border border-dwello-lilac/20 rounded-2xl hover:bg-dwello-parchment transition-all group-hover:border-dwello-indigo/30">
            <svg className="w-5 h-5 text-dwello-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
