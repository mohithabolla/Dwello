
import React, { useState } from 'react';
import api from '../api';
import Blueprint2DView from '../components/Blueprint2DView';
import Blueprint3DView from '../components/Blueprint3DView';

const AIBlueprintHub: React.FC = () => {
    const [inputs, setInputs] = useState({
        landLength: 50,
        landWidth: 40,
        floors: 2,
        rooms: 3,
        kitchenCount: 1,
        bathrooms: 2,
        hallSize: 200, // sqft
        parking: true,
        budgetRange: 'Medium'
    });
    const [blueprintData, setBlueprintData] = useState<any>(null);
    const [blueprintViewMode, setBlueprintViewMode] = useState<'2d' | '3d'>('2d');
    const [loading, setLoading] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadResponse, setUploadResponse] = useState<any>(null);

    const generateWallsFromRooms = (rooms: any[]) => {
        const wallData: any[] = [];
        let id = 1;
        rooms.forEach(room => {
            const walls = [
                { start: [room.x, 0, room.y], end: [room.x + room.width, 0, room.y] },
                { start: [room.x + room.width, 0, room.y], end: [room.x + room.width, 0, room.y + room.height] },
                { start: [room.x + room.width, 0, room.y + room.height], end: [room.x, 0, room.y + room.height] },
                { start: [room.x, 0, room.y + room.height], end: [room.x, 0, room.y] }
            ];
            walls.forEach(w => wallData.push({ id: id++, ...w, thickness: 0.2 }));
        });
        return wallData;
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await api.post('/ai/generate-blueprint', inputs);
            const data = res.data.data;
            if (!data.wallData) {
                data.wallData = generateWallsFromRooms(data.rooms);
            }
            setBlueprintData(data);
            setBlueprintViewMode('2d');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoomMove = (index: number, newX: number, newY: number) => {
        if (!blueprintData) return;
        const newRooms = [...blueprintData.rooms];
        newRooms[index] = { ...newRooms[index], x: newX, y: newY };

        setBlueprintData({
            ...blueprintData,
            rooms: newRooms,
            wallData: generateWallsFromRooms(newRooms)
        });
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) return;

        const formData = new FormData();
        formData.append('blueprint', uploadFile);

        setLoading(true);
        try {
            const res = await api.post('/ai/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const data = res.data.data;

            // Integrate upload data into the main blueprint state
            setBlueprintData({
                rooms: [], // Ingested sketch might not have room objects yet
                wallData: data.wallData,
                layoutMetadata: {
                    efficiencyScore: 0.95, // AI Confidence
                    extrusionHeight: data.extrusionHeight || 3
                },
                projectDetails: {
                    landLength: inputs.landLength,
                    landWidth: inputs.landWidth,
                    budgetEstimate: "Calculated from Sketch"
                }
            });

            setBlueprintViewMode('3d');
            setUploadResponse(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-10 animate-fadeIn h-full pb-20">
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-dwello-indigo text-white rounded-3xl flex items-center justify-center font-black text-xl shadow-xl">AI</div>
                    <div>
                        <h1 className="text-4xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter">Architectural Intelligence Hub</h1>
                        <p className="text-dwello-lilac font-medium italic">Powered by Groq-Plan™ Generative Synthesis</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Panel: Configuration */}
                <aside className="lg:col-span-4 space-y-8">
                    <section className="bg-white dark:bg-slate-800 p-8 rounded-[48px] shadow-2xl border border-dwello-lilac/10">
                        <h2 className="text-xl font-black text-dwello-indigo dark:text-dwello-silk mb-6 uppercase tracking-widest text-[10px]">Site Parameters</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black uppercase text-dwello-lilac ml-4">Plot Length (ft)</label>
                                    <input type="number" value={inputs.landLength} onChange={e => setInputs({ ...inputs, landLength: parseInt(e.target.value) })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border-2 border-transparent focus:border-dwello-silk outline-none font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black uppercase text-dwello-lilac ml-4">Plot Width (ft)</label>
                                    <input type="number" value={inputs.landWidth} onChange={e => setInputs({ ...inputs, landWidth: parseInt(e.target.value) })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border-2 border-transparent focus:border-dwello-silk outline-none font-bold" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Rooms', key: 'rooms' },
                                    { label: 'Kitchens', key: 'kitchenCount' },
                                    { label: 'Baths', key: 'bathrooms' }
                                ].map(field => (
                                    <div key={field.key} className="space-y-1">
                                        <label className="text-[8px] font-black uppercase text-dwello-lilac ml-2">{field.label}</label>
                                        <input type="number" value={(inputs as any)[field.key]} onChange={e => setInputs({ ...inputs, [field.key]: parseInt(e.target.value) })} className="w-full p-4 rounded-xl bg-dwello-parchment/30 text-center font-black text-dwello-indigo outline-none" />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-dwello-lilac ml-4">Budget Spectrum</label>
                                <div className="flex bg-dwello-parchment/50 p-1.5 rounded-2xl">
                                    {['Low', 'Medium', 'High', 'Luxury'].map(b => (
                                        <button
                                            key={b}
                                            onClick={() => setInputs({ ...inputs, budgetRange: b })}
                                            className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all ${inputs.budgetRange === b ? 'bg-dwello-indigo text-white' : 'text-dwello-lilac'}`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full py-6 bg-dwello-indigo text-white rounded-[32px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-dwello-indigo/30 hover:scale-[1.02] active:scale-95 transition-all text-xs"
                            >
                                {loading ? 'Synthesizing...' : 'Generate Neural Layout ↓'}
                            </button>
                        </div>
                    </section>

                    <section className="bg-dwello-indigo p-8 rounded-[48px] text-white space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-dwello-silk/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-dwello-silk/20 transition-all"></div>
                        <h2 className="text-xl font-black text-dwello-silk uppercase tracking-widest text-[10px]">Legacy Ingestion</h2>
                        <p className="text-dwello-parchment/60 text-xs font-bold leading-relaxed">Have a 2D sketch? Upload it for real-time 3D extrusion processing.</p>

                        <div className="relative border-2 border-dashed border-dwello-silk/30 rounded-3xl p-6 text-center group-hover:border-dwello-silk transition-all">
                            <input type="file" onChange={e => setUploadFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <p className="font-black text-[10px] uppercase tracking-widest">{uploadFile ? uploadFile.name : 'Drop blueprint file here'}</p>
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!uploadFile || loading}
                            className="w-full py-4 bg-dwello-parchment text-dwello-indigo rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-dwello-silk transition-colors"
                        >
                            Start Extrusion Engine
                        </button>
                    </section>
                </aside>

                {/* Right Panel: Visualization */}
                <main className="lg:col-span-8 space-y-8">
                    {blueprintData ? (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex justify-between items-center">
                                <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-dwello-lilac/10">
                                    <button
                                        onClick={() => setBlueprintViewMode('2d')}
                                        className={`px-8 py-3 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${blueprintViewMode === '2d' ? 'bg-dwello-indigo text-white shadow-lg' : 'text-dwello-lilac hover:bg-dwello-parchment'}`}
                                    >
                                        2D Blueprint
                                    </button>
                                    <button
                                        onClick={() => setBlueprintViewMode('3d')}
                                        className={`px-8 py-3 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${blueprintViewMode === '3d' ? 'bg-dwello-indigo text-white shadow-lg' : 'text-dwello-lilac hover:bg-dwello-parchment'}`}
                                    >
                                        3D Vision
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <div className="text-right">
                                        <p className="text-[8px] font-black uppercase text-dwello-lilac">Neural Accuracy</p>
                                        <p className="text-sm font-black text-dwello-indigo">{(blueprintData.layoutMetadata.efficiencyScore * 100).toFixed(1)}%</p>
                                    </div>
                                    <div className="h-8 w-px bg-dwello-lilac/20"></div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black uppercase text-dwello-lilac">Total Footprint</p>
                                        <p className="text-sm font-black text-dwello-indigo">{inputs.landLength * inputs.landWidth} ft²</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-[56px] p-2 shadow-2xl border border-dwello-lilac/10 overflow-hidden min-h-[550px]">
                                {blueprintViewMode === '2d' ? (
                                    <Blueprint2DView
                                        rooms={blueprintData.rooms}
                                        landLength={inputs.landLength}
                                        landWidth={inputs.landWidth}
                                        onRoomMove={handleRoomMove}
                                    />
                                ) : (
                                    <Blueprint3DView
                                        wallData={blueprintData.wallData}
                                        extrusionHeight={3.5}
                                        landLength={inputs.landLength}
                                        landWidth={inputs.landWidth}
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-4 gap-6">
                                {[
                                    { label: 'Walls Engaged', val: blueprintData.wallData.length },
                                    { label: 'Room Count', val: blueprintData.rooms.length },
                                    { label: 'Extrusion', val: '3.5m' },
                                    { label: 'Status', val: 'RENDERED', premium: true }
                                ].map((stat, i) => (
                                    <div key={i} className={`p-6 rounded-[32px] border ${stat.premium ? 'bg-dwello-silk/20 border-dwello-silk' : 'bg-white border-dwello-lilac/10'}`}>
                                        <p className="text-[8px] font-black uppercase text-dwello-lilac tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-lg font-black text-dwello-indigo">{stat.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-6 bg-dwello-parchment/30 rounded-[56px] border-4 border-dashed border-dwello-lilac/10">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl text-dwello-indigo animate-pulse">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div className="max-w-xs">
                                <h3 className="text-xl font-black text-dwello-indigo tracking-tight">System Idle</h3>
                                <p className="text-xs font-bold text-dwello-lilac mt-2 italic">Configure your plot dimensions and hit "Generate" to initialize the neural architectural pipeline.</p>
                            </div>
                        </div>
                    )}

                    {uploadResponse && !blueprintData && (
                        <div className="animate-fadeIn">
                            <Blueprint3DView
                                wallData={uploadResponse.wallData}
                                extrusionHeight={uploadResponse.extrusionHeight}
                                landLength={inputs.landLength}
                                landWidth={inputs.landWidth}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AIBlueprintHub;
