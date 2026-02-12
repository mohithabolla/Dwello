
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

interface SignupProps {
  onLogin: (role: 'Builder' | 'Client') => void;
}

const Signup: React.FC<SignupProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'Builder' | 'Client'>('Builder');
  const [name, setName] = useState('Alex J. Builder');
  const [email, setEmail] = useState('alex@dwello.build');
  const [password, setPassword] = useState('Builder123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        name,
        email: email.trim(),
        password,
        role: role.toLowerCase()
      });
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      onLogin(role, response.data.data);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      // Demo mode if network error
      if (err.code === 'ERR_NETWORK') {
        onLogin(role);
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden bg-dwello-indigo">
      {/* Premium Architectural Background with Atmospheric Processing */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105 saturate-[0.6] contrast-[0.85] brightness-[0.65] blur-[4px]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />

      {/* Cinematic Overlays: Depth & Lighting Consistency */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-dwello-indigo/40 via-transparent to-dwello-indigo/60" />

      {/* Focus Glow: Soft radial ambient occlusion behind the dialog */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.2)_0%,_transparent_70%)]" />

      <div
        className="max-w-md w-full z-10 bg-white/20 dark:bg-black/40 rounded-[32px] shadow-2xl shadow-black/5 overflow-hidden border border-white/20 animate-fadeIn"
        style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      >
        <div className="bg-dwello-indigo/80 p-10 text-center relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dwello-silk to-dwello-indigo"></div>
          <Link to="/" className="text-4xl font-black tracking-tighter text-dwello-parchment">
            <span className="text-dwello-silk">D</span>WELLO
          </Link>
          <p className="text-dwello-parchment/70 mt-2 font-medium">Initialize your builder profile</p>
        </div>

        {error && (
          <div className="mx-10 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-10 space-y-5">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-dwello-indigo dark:text-dwello-silk tracking-widest block">
              Organization Role <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('Builder')}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-2 ${role === 'Builder' ? 'bg-dwello-indigo text-white border-dwello-indigo shadow-lg' : 'bg-white/40 dark:bg-black/20 text-dwello-indigo dark:text-white border-white/0 hover:bg-white/60 dark:hover:bg-black/40'}`}
              >
                Builder
              </button>
              <button
                type="button"
                onClick={() => setRole('Client')}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-2 ${role === 'Client' ? 'bg-dwello-indigo text-white border-dwello-indigo shadow-lg' : 'bg-white/40 dark:bg-black/20 text-dwello-indigo dark:text-white border-white/0 hover:bg-white/60 dark:hover:bg-black/40'}`}
              >
                Client
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-dwello-indigo dark:text-dwello-silk tracking-widest block">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/40 dark:bg-black/30 border-2 border-white/10 focus:border-dwello-indigo/50 outline-none transition-all font-bold text-dwello-indigo dark:text-dwello-parchment placeholder-dwello-indigo/40 dark:placeholder-white/40 backdrop-blur-sm"
              placeholder="Alex J. Builder"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-dwello-indigo dark:text-dwello-silk tracking-widest block">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/40 dark:bg-black/30 border-2 border-white/10 focus:border-dwello-indigo/50 outline-none transition-all font-bold text-dwello-indigo dark:text-dwello-parchment placeholder-dwello-indigo/40 dark:placeholder-white/40 backdrop-blur-sm"
              placeholder="alex@dwello.build"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-dwello-indigo dark:text-dwello-silk tracking-widest block">
              Create Password <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              title="At least 8 characters"
              className="w-full px-5 py-4 rounded-2xl bg-white/40 dark:bg-black/30 border-2 border-white/10 focus:border-dwello-indigo/50 outline-none transition-all font-bold text-dwello-indigo dark:text-dwello-parchment placeholder-dwello-indigo/40 dark:placeholder-white/40 backdrop-blur-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-dwello-indigo text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-dwello-indigo/20 hover:bg-dwello-grape hover:scale-[1.02] active:scale-95 transition-all mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Create Profile'}
          </button>

          <div className="text-center pt-4">
            <p className="text-xs font-bold text-dwello-grape/60 dark:text-dwello-lilac">
              Already verified? <Link to="/login" className="text-dwello-indigo dark:text-dwello-silk font-black hover:underline uppercase tracking-widest ml-1">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
