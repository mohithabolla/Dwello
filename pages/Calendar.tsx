
import React, { useState, useEffect } from 'react';
import api from '../api';
import { ICONS } from '../constants';
import { BackendTask } from '../types';

const Calendar: React.FC = () => {
  const [tasks, setTasks] = useState<BackendTask[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    status: 'Pending',
    projectId: '' // User would select a project
  });
  const [projects, setProjects] = useState<any[]>([]); // To populate project dropdown

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setShowAddModal(false);
      fetchTasks();
      setNewTask({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'Medium',
        status: 'Pending',
        projectId: ''
      });
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  // Simple Month View Logic
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const getTasksForDay = (day: number) => {
    if (!day) return [];
    const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return tasks.filter(t => t.dueDate.startsWith(dateStr));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-dwello-indigo dark:text-dwello-silk">Construction Schedule</h1>
          <p className="opacity-60 font-medium text-dwello-lilac">{today.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-dwello-indigo text-white px-6 py-2 rounded-2xl font-bold shadow-lg hover:bg-dwello-grape transition-colors flex items-center gap-2"
        >
          <ICONS.Add className="w-5 h-5" />
          <span>New Task</span>
        </button>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-dwello-lilac/20">
        <div className="grid grid-cols-7 border-b border-dwello-lilac/10 bg-dwello-indigo/5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-4 text-center text-xs font-black uppercase text-dwello-indigo dark:text-dwello-silk tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[600px] bg-dwello-parchment/10">
          {days.map((d, i) => {
            const dayTasks = d ? getTasksForDay(d) : [];
            const isToday = d === today.getDate();

            return (
              <div key={i} className={`border-r border-b border-dwello-lilac/10 p-2 min-h-[120px] relative transition-colors ${!d ? 'bg-gray-50/50 opacity-30 dark:bg-slate-900/50' : 'hover:bg-dwello-lilac/5'}`}>
                {d && (
                  <>
                    <span className={`inline-block w-8 h-8 leading-8 text-center rounded-full text-sm font-bold ${isToday ? 'bg-dwello-indigo text-white shadow-lg' : 'text-dwello-grape dark:text-dwello-lilac'}`}>
                      {d}
                    </span>
                    <div className="mt-2 space-y-1">
                      {dayTasks.map(task => (
                        <div key={task._id} className={`text-[10px] p-2 rounded-lg border-l-4 font-bold truncate cursor-pointer hover:opacity-80 transition-opacity ${task.priority === 'High' ? 'bg-red-50 border-red-500 text-red-700' :
                            task.priority === 'Medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
                              'bg-blue-50 border-blue-500 text-blue-700'
                          }`}>
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-dwello-lilac/20 animate-fadeIn">
            <h2 className="text-2xl font-black text-dwello-indigo dark:text-dwello-silk mb-6">Create New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Task Title</label>
                <input
                  required
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Due Date</label>
                  <input
                    required
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Assign Project</label>
                <select
                  required
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                >
                  <option value="">Select Project...</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-dwello-parchment text-dwello-indigo hover:bg-dwello-lilac/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold bg-dwello-indigo text-white hover:bg-dwello-grape transition-colors shadow-lg shadow-dwello-indigo/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
