
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import api from '../api';

const Workers: React.FC = () => {
    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newWorker, setNewWorker] = useState<any>({
        name: '',
        role: 'Laborer',
        salaryType: 'Daily',
        salaryAmount: 0,
        attendanceDays: 0,
        assignedProject: '',
        paymentStatus: 'Pending'
    });
    const [editingWorker, setEditingWorker] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        fetchWorkers();
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data.data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    };

    const fetchWorkers = async () => {
        try {
            const response = await api.get('/workers');
            setWorkers(response.data.data);
        } catch (error) {
            console.error('Failed to fetch workers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWorker = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingWorker) {
                await api.put(`/workers/${editingWorker._id}`, newWorker);
            } else {
                await api.post('/workers', newWorker);
            }
            setShowAddModal(false);
            setEditingWorker(null);
            fetchWorkers();
            setNewWorker({ name: '', role: 'Laborer', salaryType: 'Daily', salaryAmount: 0, attendanceDays: 0, assignedProject: '', paymentStatus: 'Pending' });
        } catch (error) {
            console.error('Failed to save worker:', error);
        }
    };

    const handleEdit = (worker: any) => {
        setEditingWorker(worker);
        setNewWorker({
            name: worker.name,
            role: worker.role,
            salaryType: worker.salaryType,
            salaryAmount: worker.salaryAmount,
            attendanceDays: worker.attendanceDays,
            assignedProject: worker.assignedProject?._id || '',
            paymentStatus: worker.paymentStatus || 'Pending'
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to remove this worker?')) {
            try {
                await api.delete(`/workers/${id}`);
                fetchWorkers();
            } catch (error) {
                console.error('Failed to remove worker:', error);
            }
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tight">Workforce</h1>
                    <p className="text-dwello-lilac mt-2 font-medium">Manage your construction team</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <ICONS.Add className="w-5 h-5" />
                    <span>Add Worker</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-dwello-lilac">Loading workforce data...</div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-dwello-lilac/20">
                    <table className="w-full text-left">
                        <thead className="bg-dwello-indigo text-white uppercase text-xs font-black tracking-widest">
                            <tr>
                                <th className="p-6">Name</th>
                                <th className="p-6">Role</th>
                                <th className="p-6">Salary Type</th>
                                <th className="p-6">Assigned Project</th>
                                <th className="p-6">Amount</th>
                                <th className="p-6">Attendance</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dwello-lilac/10">
                            {workers.map((worker) => (
                                <tr key={worker._id} className="hover:bg-dwello-parchment/50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-6 font-bold text-dwello-indigo dark:text-dwello-parchment">{worker.name}</td>
                                    <td className="p-6 font-medium text-dwello-lilac">{worker.role}</td>
                                    <td className="p-6 font-medium text-dwello-lilac">{worker.salaryType}</td>
                                    <td className="p-6 font-bold text-dwello-indigo">{worker.assignedProject?.name || 'Unassigned'}</td>
                                    <td className="p-6 font-bold text-dwello-grape">${worker.salaryAmount}</td>
                                    <td className="p-6 font-bold">{worker.attendanceDays} Days</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${worker.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                            worker.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {worker.paymentStatus || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right space-x-2">
                                        <button onClick={() => handleEdit(worker)} className="p-2 text-dwello-lilac hover:bg-dwello-indigo hover:text-white rounded-lg transition-all">
                                            <ICONS.Settings className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(worker._id)} className="p-2 text-dwello-lilac hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                            <ICONS.Trash className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {workers.length === 0 && (
                        <div className="text-center py-20 text-dwello-lilac font-medium">No workers found. Add your first crew member.</div>
                    )}
                </div>
            )}

            {/* Add Worker Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-dwello-lilac/20 animate-fadeIn">
                        <h2 className="text-2xl font-black text-dwello-indigo dark:text-dwello-silk mb-6">New Worker</h2>
                        <form onSubmit={handleAddWorker} className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newWorker.name}
                                    onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Role</label>
                                    <select
                                        value={newWorker.role}
                                        onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                                    >
                                        <option>Laborer</option>
                                        <option>Mason</option>
                                        <option>Carpenter</option>
                                        <option>Electrician</option>
                                        <option>Plumber</option>
                                        <option>Engineer</option>
                                        <option>Supervisor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Salary Type</label>
                                    <select
                                        value={newWorker.salaryType}
                                        onChange={(e) => setNewWorker({ ...newWorker, salaryType: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                                    >
                                        <option>Daily</option>
                                        <option>Monthly</option>
                                        <option>Contract</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Amount ($)</label>
                                    <input
                                        required
                                        type="number"
                                        value={newWorker.salaryAmount}
                                        onChange={(e) => setNewWorker({ ...newWorker, salaryAmount: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Attendance (Days)</label>
                                    <input
                                        required
                                        type="number"
                                        value={newWorker.attendanceDays}
                                        onChange={(e) => setNewWorker({ ...newWorker, attendanceDays: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Assign Project</label>
                                    <select
                                        value={newWorker.assignedProject}
                                        onChange={(e) => setNewWorker({ ...newWorker, assignedProject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                                    >
                                        <option value="">None</option>
                                        {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-dwello-lilac tracking-widest block mb-2">Payment Status</label>
                                    <select
                                        value={newWorker.paymentStatus}
                                        onChange={(e) => setNewWorker({ ...newWorker, paymentStatus: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-dwello-parchment/30 dark:bg-slate-700 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-bold"
                                    >
                                        <option>Pending</option>
                                        <option>Paid</option>
                                        <option>Delayed</option>
                                    </select>
                                </div>
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
                                    Add Worker
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workers;
