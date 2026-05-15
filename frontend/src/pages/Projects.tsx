import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { api } from '../services/api';
import { Plus, Search, FolderKanban, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Projects.css';

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  _count?: { members: number; tasks: number };
}

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description: desc });
      setName(''); setDesc(''); setShowModal(false);
      fetchProjects();
    } catch (err) { console.error(err); }
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="layout">
      <Sidebar active="projects" />
      <main className="main-content">
        <div className="page-top">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
          </div>
          <button className="btn-primary-unique" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        </div>

        {/* Search */}
        <div className="search-bar-refined" style={{ marginBottom: '2rem' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-dim">Loading projects...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state-box">
            <FolderKanban size={48} color="#8b8d98" />
            <h3>No projects found</h3>
            <p>Create your first project to start managing tasks and team members.</p>
            <button className="btn-primary-unique" onClick={() => setShowModal(true)} style={{ marginTop: '1rem' }}>
              + Create Project
            </button>
          </div>
        ) : (
          <div className="projects-grid-refined">
            {filtered.map(project => (
              <Link key={project.id} to={`/projects/${project.id}`} className="project-card-refined">
                <div className="project-card-header">
                  <div className="project-icon-box">
                    <FolderKanban size={24} color="#6366f1" />
                  </div>
                  <div className="project-member-pill">
                    <Users size={12} /> {project._count?.members || 1}
                  </div>
                </div>
                <h3 className="project-title">{project.name}</h3>
                <p className="project-desc">{project.description || 'No description provided.'}</p>
                <div className="project-card-footer">
                  <span className="project-date">Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  <ArrowRight size={16} className="arrow-icon" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Create New Project</h2>
              <form onSubmit={handleCreate} className="modal-form">
                <div className="form-group">
                  <label>Project Name</label>
                  <input className="modal-input" value={name} onChange={e => setName(e.target.value)} placeholder="Enter project name" required />
                </div>
                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea className="modal-input" value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="What is this project about?" />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-unique">Create Project</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
