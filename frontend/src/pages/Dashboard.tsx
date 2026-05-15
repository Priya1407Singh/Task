import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { FolderKanban, ListTodo, CheckCircle2, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import './Dashboard.css';

interface DashboardStats {
  totalTasks: number;
  tasksByStatus: { status: string; _count: { id: number } }[];
  overdueTasks: number;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/projects')
        ]).catch(err => {
          console.error("API Call Failed", err);
          return [ { data: { totalTasks: 0, tasksByStatus: [], overdueTasks: 0 } }, { data: [] } ];
        });

        setStats(statsRes.data);
        setProjectsCount(projectsRes.data.length || 0);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusCount = (status: string) => {
    if (!stats || !stats.tasksByStatus) return 0;
    const found = stats.tasksByStatus.find(s => s.status === status);
    return found ? found._count.id : 0;
  };

  return (
    <div className="layout">
      <Sidebar active="dashboard" />

      <main className="main-content">
        <header className="dashboard-header-unique animate-fade-in">
          <div className="status-indicator">
            <div className="pulse-dot"></div>
            <p className="greeting-unique">Good evening,</p>
          </div>
          <div className="user-headline-unique">
            <h1 className="user-name-lg-unique">
              <span className="text-dim">Hello,</span> {user?.name}
            </h1>
          </div>
          <p className="subtitle-unique">Here's what's happening across your projects today.</p>
        </header>

        {loading ? (
          <div className="loading-container" style={{ padding: '2rem', color: '#8b8d98' }}>
            <p>Scanning sectors...</p>
          </div>
        ) : (
          <div className="content-wrapper-unique animate-fade-in">
            {/* Stats Grid */}
            <div className="stats-grid-unique">
              <Link to="/projects" className="stat-card-unique border-yellow">
                <div className="stat-icon-wrapper-unique bg-yellow-dim">
                  <FolderKanban className="text-neon-yellow" size={24} />
                </div>
                <div className="stat-info-unique">
                  <span className="stat-value-unique text-neon-yellow">{projectsCount}</span>
                  <span className="stat-label-unique">Projects</span>
                </div>
              </Link>

              <Link to="/tasks" className="stat-card-unique border-cyan">
                <div className="stat-icon-wrapper-unique bg-cyan-dim">
                  <ListTodo className="text-neon-cyan" size={24} />
                </div>
                <div className="stat-info-unique">
                  <span className="stat-value-unique text-neon-cyan">{stats?.totalTasks || 0}</span>
                  <span className="stat-label-unique">Total Tasks</span>
                </div>
              </Link>

              <Link to="/tasks" className="stat-card-unique border-lime">
                <div className="stat-icon-wrapper-unique bg-lime-dim">
                  <CheckCircle2 className="text-neon-lime" size={24} />
                </div>
                <div className="stat-info-unique">
                  <span className="stat-value-unique text-neon-lime">{getStatusCount('DONE')}</span>
                  <span className="stat-label-unique">Completed</span>
                </div>
              </Link>

              <Link to="/tasks" className="stat-card-unique border-orange">
                <div className="stat-icon-wrapper-unique bg-orange-dim">
                  <TrendingUp className="text-neon-orange" size={24} />
                </div>
                <div className="stat-info-unique">
                  <span className="stat-value-unique text-neon-orange">{getStatusCount('IN_PROGRESS')}</span>
                  <span className="stat-label-unique">In Progress</span>
                </div>
              </Link>

              <Link to="/tasks" className="stat-card-unique border-magenta">
                <div className="stat-icon-wrapper-unique bg-magenta-dim">
                  <Clock className="text-neon-magenta" size={24} />
                </div>
                <div className="stat-info-unique">
                  <span className="stat-value-unique text-neon-magenta">{getStatusCount('TODO')}</span>
                  <span className="stat-label-unique">To Do</span>
                </div>
              </Link>

              <Link to="/tasks" className="stat-card-unique border-red">
                <div className="stat-icon-wrapper-unique bg-red-dim">
                  <AlertCircle className="text-neon-red" size={24} />
                </div>
                <div className="stat-info-unique">
                  <span className="stat-value-unique text-neon-red">{stats?.overdueTasks || 0}</span>
                  <span className="stat-label-unique">Overdue</span>
                </div>
              </Link>
            </div>

            {/* Bottom Sections */}
            <div className="bottom-sections-unique">
              <div className="section-unique glass-box">
                <div className="section-header-unique">
                  <h3>My Tasks</h3>
                  <Link to="/tasks" className="view-all-unique">View all →</Link>
                </div>
                <div className="empty-state-card-unique">
                  <div className="empty-icon-unique">🎉</div>
                  <p>No tasks assigned to you yet.</p>
                </div>
              </div>

              <div className="section-unique glass-box">
                <div className="section-header-unique">
                  <h3>Projects</h3>
                  <Link to="/projects" className="view-all-unique">View all →</Link>
                </div>
                <div className="empty-state-card-unique">
                  <div className="empty-icon-unique text-neon-yellow">
                    <FolderKanban size={40} />
                  </div>
                  <p>No projects yet.</p>
                  <Link to="/projects" className="create-link-unique">Create one →</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
