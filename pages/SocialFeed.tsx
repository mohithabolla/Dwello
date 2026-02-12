
import React from 'react';
import { MOCK_POSTS, ICONS } from '../constants';

const SocialFeed: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <header className="space-y-4 mb-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter">Portfolio & Social</h1>
            <p className="text-dwello-lilac font-medium">Ongoing and completed architectural masterpieces</p>
          </div>
          <div className="flex gap-4 pb-1">
            <a href="#" className="text-dwello-indigo hover:text-dwello-grape transition-colors"><ICONS.Social className="w-6 h-6" /></a>
            <div className="h-6 w-px bg-dwello-lilac/30"></div>
            <div className="flex gap-3">
              {/* Social Icons Mockup */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 to-fuchsia-600 flex items-center justify-center text-white text-[10px] font-bold">IG</div>
              <div className="w-8 h-8 rounded-lg bg-[#0077b5] flex items-center justify-center text-white text-[10px] font-bold">LI</div>
              <div className="w-8 h-8 rounded-lg bg-[#1877f2] flex items-center justify-center text-white text-[10px] font-bold">FB</div>
              <div className="w-8 h-8 rounded-lg bg-[#ff0000] flex items-center justify-center text-white text-[10px] font-bold">YT</div>
            </div>
          </div>
        </div>
      </header>

      {MOCK_POSTS.map((post) => (
        <article key={post.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-dwello-teal/10">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-dwello-teal text-white flex items-center justify-center font-bold">
                {post.builder[0]}
              </div>
              <div>
                <h3 className="font-bold text-sm">{post.builder}</h3>
                <p className="text-[10px] text-dwello-teal font-bold uppercase tracking-wider">{post.projectName}</p>
              </div>
            </div>
            <span className="text-xs opacity-50">{post.timestamp}</span>
          </div>

          <div className="aspect-video bg-dwello-parchment overflow-hidden relative group">
            <img src={post.imageUrl} alt={post.projectName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute top-4 right-4 bg-dwello-indigo/90 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
              Before & After
            </div>
          </div>

          <div className="p-6">
            <div className="flex gap-4 mb-4">
              <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span className="font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-dwello-teal transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </button>
              <button className="flex items-center gap-2 hover:text-dwello-teal transition-colors ml-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </button>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              <span className="font-black mr-2 text-dwello-indigo">{post.builder}</span>
              {post.caption}
            </p>

            <div className="grid grid-cols-2 gap-4 pb-6 mb-6 border-b border-dwello-parchment/50">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-dwello-lilac tracking-widest">Total Capital</p>
                <p className="text-sm font-black text-dwello-indigo">$840,000</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-dwello-lilac tracking-widest">Construction Period</p>
                <p className="text-sm font-black text-dwello-indigo">14 Months</p>
              </div>
            </div>

            <div className="bg-dwello-parchment/30 p-4 rounded-2xl italic text-xs text-dwello-grape relative">
              <span className="absolute -top-2 -left-1 text-3xl text-dwello-indigo opacity-10">“</span>
              "The attention to structural detail and AI-driven precision was unlike any builder we've worked with before. Dwello delivered ahead of schedule."
              <p className="not-italic font-black text-dwello-indigo mt-2 text-[10px] uppercase tracking-widest">— Sarah Jenkins, Property Owner</p>
            </div>
            <button className="mt-4 text-dwello-teal font-bold text-xs uppercase tracking-widest hover:underline">
              Contact Builder
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default SocialFeed;
