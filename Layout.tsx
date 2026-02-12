
import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import api from '../api';

interface LayoutProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, theme, toggleTheme, user, onLogout }) => {
  const [reminders, setReminders] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      api.get('/tasks/reminders').then(res => setReminders(res.data.count)).catch(() => { });
    }
  }, [user, location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: ICONS.Home },
    { name: 'Projects', path: '/projects', icon: ICONS.Projects },
    { name: 'Blueprints', path: '/ai-blueprint', icon: ICONS.AI },
    { name: 'Logistics', path: '/logistics', icon: ICONS.Logistics },
    { name: 'Workers', path: '/workers', icon: ICONS.Social },
    { name: 'Schedule', path: '/calendar', icon: ICONS.Calendar },
    { name: 'Social Hub', path: '/feed', icon: ICONS.Social },
    { name: 'Financials', path: '/budget-planning', icon: ICONS.Projects },
    { name: 'Support', path: '/feedback', icon: ICONS.Contact },
    { name: 'Settings', path: '/settings', icon: ICONS.Settings },
  ];

  const filteredItems = navItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hideLayout = ['/', '/login', '/signup'].includes(location.pathname);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark text-dwello-parchment' : 'text-dwello-indigo'}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-dwello-indigo text-white flex-shrink-0 flex flex-col transition-all duration-300 hidden md:flex border-r border-dwello-lilac/20">
        <div className="p-8">
          <Link to="/" className="text-3xl font-extrabold tracking-tighter flex items-center gap-2">
            <span className="text-dwello-silk">D</span>WELLO
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-dwello-grape text-dwello-parchment shadow-lg' : 'hover:bg-dwello-grape/30 text-dwello-lilac'
                  }`}
              >
                <item.icon />
                <span className="font-semibold text-xs">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dwello-lilac/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-dwello-grape text-dwello-parchment flex items-center justify-center font-bold border border-dwello-lilac/30">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] uppercase font-black text-dwello-lilac tracking-widest">{user?.role || 'Builder'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-dwello-lilac hover:text-dwello-silk transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-dwello-parchment dark:bg-slate-900 transition-colors duration-300">
        <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-dwello-lilac/20 flex items-center justify-between px-8 z-10">
          <h2 className="text-xl font-bold text-dwello-indigo dark:text-dwello-silk">
            {navItems.find(i => i.path === location.pathname)?.name || 'Dwello'}
          </h2>

          <div className="flex-1 max-w-md mx-8 relative">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dwello-lilac group-focus-within:text-dwello-indigo transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="text"
                placeholder="Search blueprints, projects, workforce..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-dwello-parchment/50 border border-dwello-lilac/10 focus:bg-white focus:border-dwello-silk focus:ring-4 focus:ring-dwello-silk/10 outline-none transition-all font-bold text-xs"
              />

              {showSearchResults && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-dwello-lilac/20 overflow-hidden animate-fadeIn pb-2">
                  <p className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-dwello-lilac border-b border-dwello-lilac/10 mb-1">Feature Matches</p>
                  {filteredItems.length > 0 ? filteredItems.map(item => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setSearchQuery('');
                        setShowSearchResults(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-dwello-parchment dark:hover:bg-slate-700 transition-colors text-left"
                    >
                      <item.icon className="w-4 h-4 text-dwello-indigo" />
                      <span className="text-xs font-bold text-dwello-indigo dark:text-dwello-parchment">{item.name}</span>
                    </button>
                  )) : (
                    <p className="px-4 py-4 text-xs font-medium text-dwello-lilac italic">No modules matching "{searchQuery}"</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-dwello-lilac/20 hover:bg-dwello-parchment dark:hover:bg-slate-700 transition-colors relative"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-dwello-silk" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
              {reminders > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-dwello-silk text-dwello-indigo text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                  {reminders}
                </span>
              )}
            </button>
            <div className="h-6 w-px bg-dwello-lilac/20"></div>
            <button className="text-xs font-black uppercase tracking-widest text-dwello-grape dark:text-dwello-lilac hover:text-dwello-indigo">
              Contact Admin
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
