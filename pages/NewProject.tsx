
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NewProject: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    type: 'Residential',
    landLength: 50,
    landWidth: 40,
    floors: 2,
    budget: 500000,
    location: '',
    expectedDurationMonths: 12,
    beforeImageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        clientName: formData.clientName,
        projectType: formData.type,
        budget: formData.budget,
        expectedFloors: formData.floors,
        location: formData.location,
        expectedDurationMonths: formData.expectedDurationMonths,
        beforeImageUrl: formData.beforeImageUrl,
        landSize: {
          length: formData.landLength,
          width: formData.landWidth
        }
      };
      await api.post('/projects', payload);
      setTimeout(() => {
        navigate('/projects');
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-[48px] p-12 shadow-2xl border border-dwello-lilac/10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter">Initialize Deployment</h1>
          <p className="text-dwello-grape/70 font-medium mt-2">Specify parameters for the AI to calculate logistics and resource burn rates.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-dwello-indigo">Project Identifier</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summit Plaza"
                className="w-full px-6 py-4 rounded-3xl bg-dwello-parchment/50 border-2 border-transparent focus:border-dwello-silk outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-dwello-indigo">Client Name</label>
              <input
                required
                type="text"
                value={formData.clientName}
                onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="e.g., John Doe"
                className="w-full px-6 py-4 rounded-3xl bg-dwello-parchment/50 border-2 border-transparent focus:border-dwello-silk outline-none transition-all font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dwello-indigo">Land Length (ft)</label>
                <input
                  required
                  type="number"
                  value={formData.landLength}
                  onChange={e => setFormData({ ...formData, landLength: parseInt(e.target.value) })}
                  className="w-full px-6 py-4 rounded-3xl bg-dwello-parchment/50 border-2 border-transparent focus:border-dwello-silk outline-none transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dwello-indigo">Land Width (ft)</label>
                <input
                  required
                  type="number"
                  value={formData.landWidth}
                  onChange={e => setFormData({ ...formData, landWidth: parseInt(e.target.value) })}
                  className="w-full px-6 py-4 rounded-3xl bg-dwello-parchment/50 border-2 border-transparent focus:border-dwello-silk outline-none transition-all font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-dwello-indigo">Verticality (Floors)</label>
              <input
                required
                type="number"
                value={formData.floors}
                onChange={e => setFormData({ ...formData, floors: parseInt(e.target.value) })}
                className="w-full px-6 py-4 rounded-3xl bg-dwello-parchment/50 border-2 border-transparent focus:border-dwello-silk outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-dwello-indigo">Capital Allocation ($)</label>
              <input
                required
                type="number"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                className="w-full px-6 py-4 rounded-3xl bg-dwello-parchment/50 border-2 border-transparent focus:border-dwello-silk outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-dwello-indigo">Planned Duration (Months)</label>
              <input
                required
                type="number"
                value={formData.expectedDurationMonths}
                onChange={e => setFormData({ ...formData, expectedDurationMonths: parseInt(e.target.value) })}
                className="w-full px-6 py-4 rounded-3xl bg-dwello-parchment/50 border-2 border-transparent focus:border-dwello-silk outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-dwello-indigo">Geographic Location</label>
              <input
                required
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Denver, CO"
                className="w-full px-6 py-4 rounded-3xl bg-dwello-parchment/50 border-2 border-transparent focus:border-dwello-silk outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-dwello-indigo">Initial Site Capture (Before Image)</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fData = new FormData();
                    fData.append('image', file);
                    try {
                      const res = await api.post('/upload', fData);
                      setFormData({ ...formData, beforeImageUrl: res.data.url });
                    } catch (err) { console.error(err); }
                  }}
                  className="hidden"
                  id="before-image-upload"
                />
                <label htmlFor="before-image-upload" className="flex-1 px-6 py-4 rounded-3xl bg-dwello-parchment/50 border-2 border-dashed border-dwello-lilac/30 hover:border-dwello-indigo transition-all cursor-pointer text-sm font-bold text-dwello-lilac text-center">
                  {formData.beforeImageUrl ? 'Image Captured ✓' : 'Upload Plot Photo'}
                </label>
                {formData.beforeImageUrl && (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-dwello-lilac/20">
                    <img src={`http://localhost:5000${formData.beforeImageUrl}`} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all ${loading ? 'bg-dwello-lilac cursor-wait' : 'bg-dwello-indigo text-white hover:bg-dwello-grape hover:scale-[1.02]'
                }`}
            >
              {loading ? 'Initializing Project...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] text-dwello-indigo border-2 border-dwello-indigo/10 hover:bg-dwello-parchment transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
