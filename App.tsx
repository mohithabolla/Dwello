
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import PostHub from './pages/PostHub';
import Logistics from './pages/Logistics';
import Calendar from './pages/Calendar';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NewProject from './pages/NewProject';
import ResourcePlanning from './pages/ResourcePlanning';
import BudgetPlanning from './pages/BudgetPlanning';
import AIBlueprintHub from './pages/AIBlueprintHub';
import Workers from './pages/Workers';
import Settings from './pages/Settings';
import { User } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: 'Builder' | 'Client', userData?: any) => {
    const userObj = {
      name: userData?.name || 'Alex Builder',
      email: userData?.email || 'alex@dwello.build',
      role: role,
      isLoggedIn: true,
      _id: userData?._id
    };
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Layout theme={theme} toggleTheme={toggleTheme} user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/projects" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/projects/new" element={user ? <NewProject /> : <Navigate to="/login" />} />
          <Route path="/projects/:id" element={user ? <ProjectDetails /> : <Navigate to="/login" />} />
          <Route path="/resource-planning" element={user ? <ResourcePlanning /> : <Navigate to="/login" />} />
          <Route path="/budget-planning" element={user ? <BudgetPlanning /> : <Navigate to="/login" />} />
          <Route path="/ai-blueprint" element={user ? <AIBlueprintHub /> : <Navigate to="/login" />} />
          <Route path="/workers" element={user ? <Workers /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={user ? <Calendar /> : <Navigate to="/login" />} />
          <Route path="/feed" element={user ? <PostHub /> : <Navigate to="/login" />} />
          <Route path="/logistics" element={user ? <Logistics /> : <Navigate to="/login" />} />
          <Route path="/feedback" element={user ? <Feedback /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
