
import React, { useState } from 'react';
import { ICONS } from '../constants';
import api from '../api';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing'>('profile');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn h-full pb-20">
            <header>
                <h1 className="text-4xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter">System Configuration</h1>
                <p className="text-dwello-lilac font-medium">Manage your architectural workspace and security parameters.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Tabs */}
                <aside className="w-full lg:w-64 space-y-2">
                    {[
                        { id: 'profile', name: 'User Identity', icon: ICONS.Settings },
                        { id: 'notifications', name: 'Alert Engine', icon: ICONS.Contact },
                        { id: 'security', name: 'Access Control', icon: ICONS.Calendar },
                        { id: 'billing', name: 'Capital Billing', icon: ICONS.Projects },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === tab.id
                                    ? 'bg-dwello-indigo text-white shadow-xl shadow-dwello-indigo/20 translate-x-1'
                                    : 'bg-white dark:bg-slate-800 text-dwello-lilac hover:bg-dwello-parchment'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.name}
                        </button>
                    ))}
                </aside>

                {/* Dynamic Content Area */}
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-[48px] p-12 shadow-2xl border border-dwello-lilac/10">
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="flex items-center gap-8 mb-4">
                                <div className="w-24 h-24 rounded-[32px] bg-dwello-parchment dark:bg-slate-700 flex items-center justify-center border-4 border-dwello-parchment overflow-hidden relative group">
                                    <span className="text-3xl font-black text-dwello-indigo">AB</span>
                                    <div className="absolute inset-0 bg-dwello-indigo/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <span className="text-[8px] font-black text-white uppercase tracking-widest text-center px-4 leading-relaxed">Update Blueprint Profile</span>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-dwello-indigo dark:text-dwello-silk">Alex J. Builder</h2>
                                    <p className="text-dwello-lilac font-bold text-xs uppercase tracking-widest mt-1">Founding Architect • Summit Construct</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac ml-4">Deployment Email</label>
                                    <input type="email" defaultValue="alex@dwello.build" className="w-full px-8 py-4 rounded-3xl bg-dwello-parchment/30 border-2 border-transparent focus:border-dwello-silk outline-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac ml-4">Structural ID</label>
                                    <input type="text" defaultValue="DW-ARCH-7721" disabled className="w-full px-8 py-4 rounded-3xl bg-dwello-parchment/10 border-2 border-transparent font-black opacity-50 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac ml-4">Organization Name</label>
                                    <input type="text" defaultValue="Summit Construction Ltd." className="w-full px-8 py-4 rounded-3xl bg-dwello-parchment/30 border-2 border-transparent focus:border-dwello-silk outline-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac ml-4">Geographic Node</label>
                                    <input type="text" defaultValue="Denver, CO" className="w-full px-8 py-4 rounded-3xl bg-dwello-parchment/30 border-2 border-transparent focus:border-dwello-silk outline-none font-bold" />
                                </div>
                            </div>

                            <div className="pt-10 flex gap-4 border-t border-dwello-parchment/50">
                                <button
                                    onClick={handleSave}
                                    className="px-12 py-5 bg-dwello-indigo text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-dwello-grape transition-all active:scale-95"
                                >
                                    {isSaved ? 'Sync Successful ✓' : 'Push Synchronization'}
                                </button>
                                <button className="px-12 py-5 bg-dwello-parchment text-dwello-indigo rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-dwello-lilac/20 transition-all">
                                    Hard Reset
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-8 animate-fadeIn">
                            <h2 className="text-2xl font-black text-dwello-indigo dark:text-dwello-silk mb-8">Alert Frequency Engine</h2>
                            {[
                                { title: 'Logistics Breach', desc: 'Alert when material shipments are delayed more than 24h.', default: true },
                                { title: 'Capital Margin Alert', desc: 'Notify when project expenditure exceeds 95% of allocation.', default: true },
                                { title: 'Structural Milestones', desc: 'Broadcast across internal feed when a floor is completed.', default: false },
                                { title: 'Weather Vector warnings', desc: 'Warn crew if local weather patterns threaten site safety.', default: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-dwello-parchment/20 border border-dwello-lilac/10">
                                    <div className="max-w-md">
                                        <p className="font-black text-dwello-indigo text-sm uppercase tracking-widest">{item.title}</p>
                                        <p className="text-xs font-medium text-dwello-lilac mt-1">{item.desc}</p>
                                    </div>
                                    <div className={`w-14 h-8 rounded-full relative cursor-pointer transition-colors ${item.default ? 'bg-dwello-silk' : 'bg-dwello-parchment'}`}>
                                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${item.default ? 'left-7' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab !== 'profile' && activeTab !== 'notifications' && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-dwello-parchment rounded-full mx-auto flex items-center justify-center text-dwello-indigo">
                                <ICONS.Settings className="w-10 h-10 animate-spin-slow" />
                            </div>
                            <p className="text-xl font-black text-dwello-indigo uppercase tracking-widest italic">{activeTab} module under maintenance</p>
                            <p className="text-dwello-lilac font-medium">This architectural node is being optimized for real-time synchronization.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
