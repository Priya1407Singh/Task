import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, ListTodo, Users2, LogOut, Stars } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  active: 'dashboard' | 'projects' | 'tasks' | 'team';
}

export const Sidebar: React.FC<SidebarProps> = ({ active }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar-unique">
      <div className="sidebar-header-unique">
        <div className="logo-icon-unique">
          <Stars size={20} color="#fff" />
        </div>
        <h2 className="logo-text-unique">NOVA</h2>
      </div>
      <nav className="sidebar-nav-unique">
        <Link to="/dashboard" className={`nav-item-unique ${active === 'dashboard' ? 'active' : ''}`}>
          <LayoutDashboard size={20} className="nav-icon-unique text-cyan" />
          <span>Dashboard</span>
        </Link>
        <Link to="/projects" className={`nav-item-unique ${active === 'projects' ? 'active' : ''}`}>
          <FolderKanban size={20} className="nav-icon-unique text-magenta" />
          <span>Projects</span>
        </Link>
        <Link to="/tasks" className={`nav-item-unique ${active === 'tasks' ? 'active' : ''}`}>
          <ListTodo size={20} className="nav-icon-unique text-lime" />
          <span>My Tasks</span>
        </Link>
        <Link to="/team" className={`nav-item-unique ${active === 'team' ? 'active' : ''}`}>
          <Users2 size={20} className="nav-icon-unique text-yellow" />
          <span>Team</span>
        </Link>
      </nav>
      <div className="sidebar-footer-unique">
        <Link to="/profile" className="user-profile-unique">
          <div className="avatar-unique">{user?.name.charAt(0).toUpperCase()}</div>
          <div className="user-info-unique">
            <span className="user-name-unique">{user?.name}</span>
            <span className="user-role-unique">Admin</span>
          </div>
          <button onClick={(e) => { e.preventDefault(); logout(); }} className="logout-btn-unique" title="Logout">
            <LogOut size={18} />
          </button>
        </Link>
      </div>
    </aside>
  );
};
