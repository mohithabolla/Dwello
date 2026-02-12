
import React, { useState, useEffect } from 'react';
import api from '../api';
import { ICONS } from '../constants';

const PostHub: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        caption: '',
        project: '',
        location: '',
        tags: '',
        imageUrl: ''
    });
    const [uploading, setUploading] = useState(false);
    const [activeComments, setActiveComments] = useState<string | null>(null);
    const [postComments, setPostComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchPosts();
        fetchProjects();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts');
            setPosts(res.data.data);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data.data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('image', file);
        try {
            const res = await api.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, imageUrl: res.data.url });
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()),
                project: formData.project || undefined
            };
            await api.post('/posts', payload);
            setShowCreateModal(false);
            setFormData({ caption: '', project: '', location: '', tags: '', imageUrl: '' });
            fetchPosts();
        } catch (error) {
            console.error('Failed to create post', error);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            const res = await api.post(`/posts/${postId}/like`);
            setPosts(posts.map(p => p._id === postId ? { ...p, likesCount: res.data.data.likesCount } : p));
        } catch (error) {
            console.error('Failed to like post', error);
        }
    };

    const toggleComments = async (postId: string) => {
        if (activeComments === postId) {
            setActiveComments(null);
            return;
        }
        setActiveComments(postId);
        try {
            const res = await api.get(`/posts/${postId}/comment`);
            setPostComments(res.data.data);
        } catch (error) {
            console.error('Failed to fetch comments', error);
        }
    };

    const handlePostComment = async (postId: string) => {
        if (!newComment.trim()) return;
        try {
            const res = await api.post(`/posts/${postId}/comment`, { content: newComment });
            setPostComments([res.data.data, ...postComments]);
            setNewComment('');
            setPosts(posts.map(p => p._id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
        } catch (error) {
            console.error('Failed to post comment', error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-12 animate-fadeIn pb-24">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter italic">Showcase Hub</h1>
                    <p className="text-dwello-lilac font-medium">Capture and share the architectural journey.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-dwello-indigo text-white px-8 py-4 rounded-3xl font-black shadow-2xl shadow-dwello-indigo/20 hover:scale-110 transition-all flex items-center gap-3"
                >
                    <ICONS.Camera className="w-6 h-6" />
                    Snap Post
                </button>
            </header>

            <div className="space-y-16">
                {posts.map((post) => (
                    <article key={post._id} className="bg-white dark:bg-slate-800 rounded-[40px] overflow-hidden shadow-2xl border border-dwello-lilac/10 group">
                        <div className="p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-dwello-indigo text-dwello-silk flex items-center justify-center font-black text-xl shadow-lg">
                                    {post.userName?.[0] || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-dwello-indigo dark:text-dwello-silk">{post.userName}</h3>
                                    <p className="text-[10px] text-dwello-lilac font-black uppercase tracking-widest">
                                        {post.project?.name || post.location || 'Site View'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-dwello-lilac/50 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="relative aspect-[4/3] bg-dwello-parchment overflow-hidden">
                            <img src={post.imageUrl.startsWith('/') ? `http://localhost:5007${post.imageUrl}` : post.imageUrl} alt="Construction" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            {post.project && (
                                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-white">
                                    <p className="text-[8px] font-black uppercase text-dwello-lilac tracking-widest leading-none">Related Project</p>
                                    <h4 className="font-black text-dwello-indigo">{post.project.name}</h4>
                                </div>
                            )}
                        </div>

                        <div className="p-10">
                            <div className="flex gap-8 mb-8">
                                <button onClick={() => handleLike(post._id)} className="flex items-center gap-3 group/like">
                                    <div className="p-3 rounded-2xl bg-red-50 text-red-500 group-hover/like:bg-red-500 group-hover/like:text-white transition-all">
                                        <ICONS.Heart className="w-6 h-6" fill={post.likesCount > 0 ? 'currentColor' : 'none'} />
                                    </div>
                                    <span className="font-black text-dwello-indigo">{post.likesCount}</span>
                                </button>
                                <button onClick={() => toggleComments(post._id)} className="flex items-center gap-3 group/msg">
                                    <div className="p-3 rounded-2xl bg-dwello-parchment text-dwello-indigo group-hover/msg:bg-dwello-indigo group-hover/msg:text-white transition-all">
                                        <ICONS.Chat className="w-6 h-6" />
                                    </div>
                                    <span className="font-black text-dwello-indigo">{post.commentsCount}</span>
                                </button>
                                <button className="ml-auto p-3 rounded-2xl text-dwello-lilac hover:bg-dwello-parchment transition-all">
                                    <ICONS.Share className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-lg leading-relaxed text-dwello-grape font-medium mb-8">
                                <span className="font-black mr-3 text-dwello-indigo">@{post.userName.toLowerCase().replace(' ', '')}</span>
                                {post.caption}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {post.tags?.map((tag: string, i: number) => (
                                    <span key={i} className="text-[10px] font-black uppercase text-dwello-lilac tracking-widest bg-dwello-parchment/50 px-3 py-1 rounded-full border border-dwello-lilac/10">#{tag}</span>
                                ))}
                            </div>

                            {activeComments === post._id && (
                                <div className="pt-8 border-t border-dwello-parchment/50 animate-fadeIn space-y-6">
                                    <div className="flex gap-4">
                                        <input
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            placeholder="Write a technical feedback..."
                                            className="flex-1 px-6 py-3 rounded-xl bg-dwello-parchment/50 border border-dwello-lilac/10 focus:border-dwello-indigo outline-none font-medium"
                                        />
                                        <button onClick={() => handlePostComment(post._id)} className="bg-dwello-indigo text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest">Post</button>
                                    </div>
                                    <div className="space-y-4 max-h-60 overflow-y-auto pr-4">
                                        {postComments.map((comment, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-dwello-parchment/30">
                                                <div className="w-8 h-8 rounded-lg bg-dwello-grape text-white flex items-center justify-center font-bold text-xs">{comment.userName[0]}</div>
                                                <div>
                                                    <p className="text-xs font-black text-dwello-indigo">{comment.userName}</p>
                                                    <p className="text-sm font-medium text-dwello-grape">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-[48px] p-12 w-full max-w-2xl shadow-2xl border border-dwello-lilac/20 animate-fadeIn relative">
                        <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-12 text-dwello-lilac hover:text-dwello-indigo text-3xl font-black">✕</button>
                        <h2 className="text-4xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter mb-10">Broadcast Deployment</h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="bg-dwello-parchment/50 p-10 rounded-[32px] border-2 border-dashed border-dwello-lilac/30 text-center relative overflow-hidden group">
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl.startsWith('/') ? `http://localhost:5007${formData.imageUrl}` : formData.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-dwello-indigo text-white rounded-2xl mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                            <ICONS.Camera className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm font-black text-dwello-indigo uppercase tracking-widest">Capture Visual Asset</p>
                                    </div>
                                )}
                                <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                {uploading && <div className="absolute inset-0 bg-white/80 backdrop-blur flex items-center justify-center font-black">Processing Visual...</div>}
                            </div>

                            <textarea
                                required
                                value={formData.caption}
                                onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                placeholder="Describe the engineering milestone..."
                                className="w-full p-6 rounded-3xl bg-dwello-parchment/50 border border-dwello-lilac/20 focus:border-dwello-indigo outline-none font-medium text-lg min-h-[120px]"
                            />

                            <div className="grid grid-cols-2 gap-6">
                                <select value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none">
                                    <option value="">Link Project (Opt)</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Location (e.g. Zone B)" className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none" />
                            </div>

                            <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="Tagging: foundation, masonry, steel (comma separated)" className="w-full px-6 py-4 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 font-bold outline-none" />

                            <button type="submit" disabled={!formData.imageUrl} className="w-full py-5 rounded-3xl bg-dwello-indigo text-white font-black text-lg shadow-2xl hover:bg-dwello-grape transition-all disabled:opacity-30 italic tracking-widest uppercase">
                                Deploy Showcase Broadcast ↓
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostHub;
