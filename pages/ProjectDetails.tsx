
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ThreeDViewer from '../components/ThreeDViewer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | 'planning'>('3d');
  const [analytics, setAnalytics] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressForm, setProgressForm] = useState({
    currentFloor: 0,
    completionPercentage: 0,
    budgetUsed: 0,
    stage: 'Foundation'
  });
  const [newComment, setNewComment] = useState({ text: '', rating: 5 });
  const [updating, setUpdating] = useState(false);
  const [projectWorkers, setProjectWorkers] = useState<any[]>([]);
  const [projectLogistics, setProjectLogistics] = useState<any[]>([]);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.data);
      setProgressForm({
        currentFloor: res.data.data.currentFloor,
        completionPercentage: res.data.data.completionPercentage,
        budgetUsed: res.data.data.budgetUsed,
        stage: res.data.data.stage
      });
      const analyticsRes = await api.get(`/projects/${id}/analytics`);
      setAnalytics(analyticsRes.data.data);
      const commentsRes = await api.get(`/comments/project/${id}`);
      setComments(commentsRes.data.data);

      const [workersRes, logRes] = await Promise.all([
        api.get('/workers'),
        api.get('/logistics')
      ]);
      setProjectWorkers(workersRes.data.data.filter((w: any) => w.assignedProject?._id === id));
      setProjectLogistics(logRes.data.data.filter((l: any) => l.assignedProject?._id === id));
    } catch (error) {
      console.error('Failed to fetch project details', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put(`/projects/${id}/update-progress`, progressForm);
      await fetchProjectDetails();
      setShowProgressModal(false);
    } catch (error) {
      console.error('Failed to update progress', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingComment(true);
    try {
      const res = await api.post('/comments', {
        projectId: id,
        text: newComment.text,
        rating: newComment.rating
      });
      setComments([res.data.data, ...comments]);
      setNewComment({ text: '', rating: 5 });
    } catch (error) {
      console.error('Failed to post comment', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-dwello-lilac">Loading project data...</div>;
  if (!project) return <div className="p-20 text-center font-black">Project data not found.</div>;

  return (
    <div className="space-y-10 animate-fadeIn max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dwello-lilac">
            <Link to="/projects" className="hover:text-dwello-indigo transition-colors">Directory</Link>
            <span className="opacity-40">/</span>
            <span className="text-dwello-grape">{project.name}</span>
          </nav>
          <h1 className="text-5xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter">{project.name}</h1>
          <p className="text-dwello-grape/70 font-medium">{project.location} • Established {new Date(project.startDate).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowProgressModal(true)}
            className="bg-dwello-indigo text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-dwello-indigo/10 hover:translate-y-[-2px] transition-all"
          >
            Update Progress
          </button>
          <button className="bg-white border-2 border-dwello-indigo/10 text-dwello-indigo px-8 py-4 rounded-2xl font-black text-sm hover:bg-dwello-parchment transition-colors">Export Blueprint</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden shadow-sm border border-dwello-lilac/20">
            <div className="flex bg-dwello-parchment/50 p-2">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex-1 py-4 font-black uppercase tracking-widest text-xs rounded-2xl transition-all ${viewMode === '3d' ? 'bg-dwello-indigo text-white shadow-lg' : 'text-dwello-lilac hover:text-dwello-indigo'}`}
              >
                Structural 3D Viewer
              </button>
              <button
                onClick={() => setViewMode('planning')}
                className={`flex-1 py-4 font-black uppercase tracking-widest text-xs rounded-2xl transition-all ${viewMode === 'planning' ? 'bg-dwello-indigo text-white shadow-lg' : 'text-dwello-lilac hover:text-dwello-indigo'}`}
              >
                AI Resource Planning
              </button>
            </div>

            <div className="p-8">
              {viewMode === '3d' ? (
                <div className="h-[500px]">
                  <ThreeDViewer progress={project.completionPercentage || (project.currentFloor / project.expectedFloors) * 100} floors={project.expectedFloors} />
                </div>
              ) : (
                <div className="space-y-8 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-dwello-parchment/30 rounded-3xl border border-dwello-lilac/10">
                      <h3 className="text-sm font-black uppercase text-dwello-indigo mb-4 tracking-widest">Budget vs Actual</h3>
                      {analytics && (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { name: 'Budget', amount: analytics.budgetUsage.allocated },
                              { name: 'Used', amount: analytics.budgetUsage.used }
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                              <XAxis dataKey="name" fontSize={10} fontWeight={800} />
                              <YAxis fontSize={10} fontWeight={800} />
                              <RechartsTooltip />
                              <Bar dataKey="amount" fill="#4a4e69" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                    <div className="p-6 bg-dwello-parchment/30 rounded-3xl border border-dwello-lilac/10">
                      <h3 className="text-sm font-black uppercase text-dwello-indigo mb-4 tracking-widest">Timeline Progress</h3>
                      {analytics && (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={[
                              { name: 'Planned', value: analytics.timeProgress.planned },
                              { name: 'Actual', value: analytics.timeProgress.actual }
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" fontSize={10} fontWeight={800} width={60} />
                              <RechartsTooltip />
                              <Bar dataKey="value" fill="#22223b" radius={[0, 8, 8, 0]} barSize={20} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-8 bg-dwello-indigo rounded-[32px] text-dwello-parchment">
                    <h4 className="text-lg font-black text-dwello-silk mb-2">Planning Recommendation</h4>
                    <p className="text-sm opacity-80 leading-relaxed">
                      Predictive models suggest shifting electrical rough-ins for Level 3 by 48 hours to avoid congestion with the masonry team. This adjustment maintains current budget parameters while reducing site friction.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-dwello-indigo">Project Gallery</h2>
              <label className="cursor-pointer bg-dwello-parchment text-dwello-indigo px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-dwello-lilac/20 transition-all">
                Add Viewport
                <input type="file" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('image', file);
                  try {
                    const uploadRes = await api.post('/upload', formData);
                    await api.put(`/projects/${id}`, { images: [...(project.images || []), uploadRes.data.url] });
                    fetchProjectDetails();
                  } catch (err) { console.error(err); }
                }} />
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(project.images || []).map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-3xl overflow-hidden border border-dwello-lilac/10 group relative">
                  <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover" alt="Project view" />
                  <div className="absolute inset-0 bg-dwello-indigo/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="text-white font-black text-[10px] uppercase tracking-tighter">Expand View</button>
                  </div>
                </div>
              ))}
              {(!project.images || project.images.length === 0) && (
                <div className="aspect-square rounded-3xl bg-dwello-parchment/30 border-2 border-dashed border-dwello-lilac/20 flex items-center justify-center text-dwello-lilac font-bold text-center p-4">
                  No construction captures yet.
                </div>
              )}
            </div>
          </section>

          <section className="bg-dwello-indigo p-8 rounded-[40px] text-white overflow-hidden relative">
            <h2 className="text-2xl font-black mb-8 italic">Transformation: Before & After</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-80">
              <div className="relative rounded-[32px] overflow-hidden border border-white/10 group">
                <img src={project.beforeImageUrl ? `http://localhost:5000${project.beforeImageUrl}` : 'https://images.unsplash.com/photo-1541913057-2599eecbceef?q=80&w=800'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Before" />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase">Phase 0: Ground Zero</div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('image', file);
                  try {
                    const uploadRes = await api.post('/upload', formData);
                    await api.put(`/projects/${id}`, { beforeImageUrl: uploadRes.data.url });
                    fetchProjectDetails();
                  } catch (err) { console.error(err); }
                }} />
              </div>
              <div className="relative rounded-[32px] overflow-hidden border border-white/10 group">
                <img src={project.afterImageUrl ? `http://localhost:5000${project.afterImageUrl}` : 'https://images.unsplash.com/photo-1503387762-592dee58c460?q=80&w=800'} className="w-full h-full object-cover" alt="After" />
                <div className="absolute bottom-4 right-4 bg-dwello-silk text-dwello-indigo px-4 py-1 rounded-full text-[10px] font-black uppercase">Current Manifestation</div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('image', file);
                  try {
                    const uploadRes = await api.post('/upload', formData);
                    await api.put(`/projects/${id}`, { afterImageUrl: uploadRes.data.url });
                    fetchProjectDetails();
                  } catch (err) { console.error(err); }
                }} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-dwello-indigo mb-6">Workflow Milestones</h2>
            <div className="space-y-4">
              {/* Timeline Data is mapped from project.timelineData if available, otherwise show placeholder */}
              {project.timelineData && project.timelineData.length > 0 ? project.timelineData.map((item: any, i: number) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-dwello-lilac/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-dwello-indigo text-white flex items-center justify-center font-bold text-xs">{i + 1}</div>
                  <div>
                    <p className="font-black text-dwello-indigo">{item.status || 'Update'}</p>
                    <p className="text-xs text-dwello-lilac">{new Date(item.date).toLocaleDateString()} - {item.comment}</p>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-dwello-lilac/30 text-dwello-lilac font-bold">
                  No specific timeline updates yet.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-dwello-indigo mb-6">Open Comments & Reviews</h2>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-dwello-lilac/10 shadow-sm space-y-8">

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="space-y-4 pb-8 border-b border-dwello-parchment">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase text-dwello-indigo tracking-widest">Post a Review</h3>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewComment({ ...newComment, rating: star })}
                        className={`w-6 h-6 ${newComment.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  required
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  placeholder="Share your thoughts on the construction progress..."
                  className="w-full p-4 rounded-2xl bg-dwello-parchment/30 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none min-h-[100px] font-medium"
                />
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="bg-dwello-indigo text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-dwello-grape transition-all disabled:opacity-50"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.length > 0 ? comments.map((c, i) => (
                  <div key={i} className="space-y-2 pb-6 border-b border-dwello-parchment/50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-dwello-grape text-white flex items-center justify-center font-bold text-[10px]">{c.name[0]}</div>
                        <div>
                          <p className="font-black text-dwello-indigo text-xs">{c.name}</p>
                          <p className="text-[10px] text-dwello-lilac font-medium">{new Date(c.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-yellow-500 text-xs">
                        {'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-dwello-grape font-medium leading-relaxed">{c.text}</p>
                  </div>
                )) : (
                  <p className="text-center py-10 text-dwello-lilac font-bold">No reviews yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-dwello-lilac/20 shadow-sm">
            <h2 className="text-xl font-black text-dwello-indigo mb-6">Structural Specs</h2>
            <dl className="space-y-5">
              {[
                { label: 'Client', value: project.clientName },
                { label: 'Verticality', value: `${project.expectedFloors} Levels` },
                { label: 'Current Progress', value: `Floor ${project.currentFloor}` },
                { label: 'Structural Stage', value: project.stage },
                { label: 'Capitalization', value: `$${project.budget.toLocaleString()}` },
                { label: 'Labor Force', value: `${projectWorkers.length} Workers` },
                { label: 'Material Assets', value: `${projectLogistics.length} Entries` },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-dwello-parchment last:border-0 last:pb-0">
                  <dt className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">{item.label}</dt>
                  <dd className="font-black text-dwello-indigo dark:text-dwello-silk">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-dwello-silk/10 p-8 rounded-[32px] border-2 border-dwello-silk/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M13 14h-2v-4h2m0 8h-2v-2h2M1 21h22L12 2 1 21z" /></svg>
            </div>
            <h2 className="text-xl font-black text-dwello-indigo mb-4 flex items-center gap-2">
              Strategic Risks
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-white/60 rounded-2xl text-xs font-bold border border-dwello-silk/40 leading-relaxed">
                Logistics: Cement supply shortage detected in regional hubs. Contingency suppliers mapped.
              </div>
              <div className="p-4 bg-white/60 rounded-2xl text-xs font-bold border border-dwello-silk/40 leading-relaxed">
                Weather: Extreme precipitation likely in Q4. Re-evaluating curing times for exterior shells.
              </div>
            </div>
            <button className="mt-6 w-full bg-dwello-indigo text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-dwello-grape transition-colors">
              Execute Mitigation
            </button>
          </div>
        </div>
      </div>

      {showProgressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[40px] p-12 w-full max-w-xl shadow-2xl animate-fadeIn">
            <h2 className="text-3xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter mb-8">Deploy Progress Update</h2>
            <form onSubmit={handleProgressUpdate} className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Execution Level (Floor)</label>
                <input type="number" value={progressForm.currentFloor} onChange={e => setProgressForm({ ...progressForm, currentFloor: parseInt(e.target.value) })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Percentage (%)</label>
                <input type="number" value={progressForm.completionPercentage} onChange={e => setProgressForm({ ...progressForm, completionPercentage: parseInt(e.target.value) })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Capital Deployed ($)</label>
                <input type="number" value={progressForm.budgetUsed} onChange={e => setProgressForm({ ...progressForm, budgetUsed: parseInt(e.target.value) })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none focus:border-dwello-indigo" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Structural Stage</label>
                <select value={progressForm.stage} onChange={e => setProgressForm({ ...progressForm, stage: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none">
                  {['Foundation', 'Framing', 'Electrical', 'Interior', 'Completed'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2 pt-6 flex gap-4">
                <button type="button" onClick={() => setShowProgressModal(false)} className="flex-1 py-4 font-bold text-dwello-indigo hover:bg-dwello-parchment rounded-2xl transition-colors">Abort</button>
                <button type="submit" disabled={updating} className="flex-1 py-4 bg-dwello-indigo text-white font-black rounded-2xl shadow-xl hover:bg-dwello-grape transition-all italic">
                  {updating ? 'Transmitting...' : 'Commit Changes ↓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
