
import React, { useState, useEffect } from 'react';
import api from '../api';
import { ICONS } from '../constants';

const Logistics: React.FC = () => {
    const [entries, setEntries] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<any>(null);
    const [formData, setFormData] = useState({
        materialName: '',
        quantity: 0,
        unit: 'kg',
        supplierName: '',
        deliveryDate: '',
        deliveryStatus: 'Pending',
        cost: 0,
        assignedProject: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [logRes, projRes] = await Promise.all([
                api.get('/logistics'),
                api.get('/projects')
            ]);
            setEntries(logRes.data.data);
            setProjects(projRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEntry) {
                await api.put(`/logistics/${editingEntry._id}`, formData);
            } else {
                await api.post('/logistics', formData);
            }
            setShowModal(false);
            setEditingEntry(null);
            fetchData();
            setFormData({
                materialName: '',
                quantity: 0,
                unit: 'kg',
                supplierName: '',
                deliveryDate: '',
                deliveryStatus: 'Pending',
                cost: 0,
                assignedProject: ''
            });
        } catch (error) {
            console.error('Failed to save logistics entry', error);
        }
    };

    const handleEdit = (entry: any) => {
        setEditingEntry(entry);
        setFormData({
            materialName: entry.materialName,
            quantity: entry.quantity,
            unit: entry.unit,
            supplierName: entry.supplierName,
            deliveryDate: new Date(entry.deliveryDate).toISOString().split('T')[0],
            deliveryStatus: entry.deliveryStatus,
            cost: entry.cost,
            assignedProject: entry.assignedProject?._id || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to remove this entry?')) {
            try {
                await api.delete(`/logistics/${id}`);
                fetchData();
            } catch (error) {
                console.error('Failed to delete entry', error);
            }
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter">Logistics Management</h1>
                    <p className="text-dwello-lilac font-medium">Supply chain and material procurement tracking.</p>
                </div>
                <button
                    onClick={() => { setEditingEntry(null); setShowModal(true); }}
                    className="bg-dwello-indigo text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-dwello-indigo/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <ICONS.Add className="w-5 h-5" />
                    Dispatch Material Entry
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dwello-indigo p-6 rounded-[32px] text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Logistics Spend</p>
                    <p className="text-3xl font-black">${entries.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-dwello-lilac/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac mb-2">Pending Deliveries</p>
                    <p className="text-3xl font-black text-dwello-indigo">{entries.filter(e => e.deliveryStatus === 'Pending').length}</p>
                </div>
                <div className="bg-dwello-silk p-6 rounded-[32px] text-dwello-indigo">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Reliability Rate</p>
                    <p className="text-3xl font-black">{entries.length ? Math.round((entries.filter(e => e.deliveryStatus === 'Delivered').length / entries.length) * 100) : 0}%</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-dwello-lilac/10 shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-dwello-parchment/50 border-b border-dwello-lilac/10">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">
                            <th className="p-6">Material</th>
                            <th className="p-6">Quantity</th>
                            <th className="p-6">Project</th>
                            <th className="p-6">Supplier</th>
                            <th className="p-6">Date</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Cost</th>
                            <th className="p-6 text-right">Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dwello-lilac/10">
                        {entries.map((entry) => (
                            <tr key={entry._id} className="hover:bg-dwello-parchment/30 transition-colors">
                                <td className="p-6">
                                    <p className="font-black text-dwello-indigo dark:text-dwello-parchment">{entry.materialName}</p>
                                </td>
                                <td className="p-6 font-bold text-dwello-lilac">{entry.quantity} {entry.unit}</td>
                                <td className="p-6">
                                    <span className="px-3 py-1 rounded-full bg-dwello-silk/20 text-dwello-indigo text-[10px] font-bold">
                                        {entry.assignedProject?.name || 'Global'}
                                    </span>
                                </td>
                                <td className="p-6 font-medium text-dwello-grape">{entry.supplierName}</td>
                                <td className="p-6 text-xs font-bold text-dwello-lilac">{new Date(entry.deliveryDate).toLocaleDateString()}</td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${entry.deliveryStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            entry.deliveryStatus === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {entry.deliveryStatus}
                                    </span>
                                </td>
                                <td className="p-6 font-black text-dwello-indigo">${entry.cost.toLocaleString()}</td>
                                <td className="p-6 text-right space-x-2">
                                    <button onClick={() => handleEdit(entry)} className="p-2 hover:bg-dwello-indigo hover:text-white rounded-lg transition-all"><ICONS.Settings className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(entry._id)} className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all"><ICONS.Delete className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {entries.length === 0 && !loading && (
                            <tr>
                                <td colSpan={8} className="p-20 text-center font-bold text-dwello-lilac">No logistics entries found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-[40px] p-10 w-full max-w-2xl shadow-2xl border border-dwello-lilac/20 animate-fadeIn">
                        <header className="mb-8 flex justify-between items-center">
                            <h2 className="text-3xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter">
                                {editingEntry ? 'Refine Entry' : 'Logistics Deployment'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-dwello-lilac hover:text-dwello-indigo transition-colors">✕</button>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Material Name</label>
                                    <input required type="text" value={formData.materialName} onChange={e => setFormData({ ...formData, materialName: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Quantity</label>
                                        <input required type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Unit</label>
                                        <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo">
                                            <option>kg</option>
                                            <option>tons</option>
                                            <option>pieces</option>
                                            <option>m3</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Supplier</label>
                                    <input required type="text" value={formData.supplierName} onChange={e => setFormData({ ...formData, supplierName: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Assigned Project</label>
                                    <select required value={formData.assignedProject} onChange={e => setFormData({ ...formData, assignedProject: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo">
                                        <option value="">Select Project...</option>
                                        {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Delivery Date</label>
                                    <input required type="date" value={formData.deliveryDate} onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Cost ($)</label>
                                    <input required type="number" value={formData.cost} onChange={e => setFormData({ ...formData, cost: parseInt(e.target.value) })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Shipment Status</label>
                                    <select value={formData.deliveryStatus} onChange={e => setFormData({ ...formData, deliveryStatus: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo">
                                        <option>Pending</option>
                                        <option>Delivered</option>
                                        <option>Delayed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-2xl font-bold bg-dwello-parchment text-dwello-indigo hover:bg-dwello-lilac/10">Discard</button>
                                <button type="submit" className="flex-1 py-4 rounded-2xl font-black bg-dwello-indigo text-white shadow-xl shadow-dwello-indigo/20 hover:bg-dwello-grape transition-all italic">Execute Entry ↓</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logistics;
