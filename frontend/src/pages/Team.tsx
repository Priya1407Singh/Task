import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { api } from '../services/api';
import { Search, UserPlus, Users2, Mail, Info } from 'lucide-react';
import './Team.css';

interface Member {
  user: { id: string; name: string; email: string; createdAt?: string };
  role: string;
}

interface Project {
  id: string;
  name: string;
  members: Member[];
}

export const Team: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTeam = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post(`/projects/${selectedProjectId}/members`, { email, role });
      setSuccess(`Successfully added ${email}!`);
      setEmail('');
      fetchTeam();
      setTimeout(() => setShowModal(false), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add member.');
    }
  };

  const memberMap = new Map<string, Member>();
  projects.forEach(p => {
    p.members.forEach(m => {
      if (!memberMap.has(m.user.id)) {
        memberMap.set(m.user.id, m);
      }
    });
  });

  const allMembers = Array.from(memberMap.values());
  const filtered = allMembers.filter(m =>
    m.user.name.toLowerCase().includes(search.toLowerCase()) ||
    m.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="layout">
      <Sidebar active="team" />
      <main className="main-content">
        <div className="page-top">
          <div>
            <h1 className="page-title">Team</h1>
            <p className="page-subtitle">{allMembers.length} member{allMembers.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn-primary-unique" onClick={() => setShowModal(true)}>
            <UserPlus size={18} /> Add Member
          </button>
        </div>

        <div className="search-bar-refined" style={{ marginBottom: '2rem' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-dim">Loading team...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state-box">
            <Users2 size={48} color="#1f2129" />
            <h3>No team members yet</h3>
            <p>Invite people to your projects to build your team.</p>
          </div>
        ) : (
          <>
            <div className="team-list-refined">
              {filtered.map(member => (
                <div key={member.user.id} className="team-row-refined">
                  <div className="team-member-info">
                    <div className="team-avatar">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="team-name">{member.user.name}</p>
                      <p className="team-email">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="team-member-meta">
                    <span className="team-joined-date">
                      Joined {member.user.createdAt ? new Date(member.user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </span>
                    <span className={`role-pill role-${member.role.toLowerCase()}`}>
                      {member.role.toLowerCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="contact-footer-hint">
              <Info size={14} className="info-icon-sm" />
              <span>Contact an admin to change roles or manage team members.</span>
            </div>
          </>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Add Team Member</h2>
              {error && <div className="modal-error-box">{error}</div>}
              {success && <div className="modal-success-box">{success}</div>}
              <form onSubmit={handleAddMember} className="modal-form">
                <div className="form-group">
                  <label>Select Project</label>
                  <select className="modal-input" value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} required>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>User Email</label>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input className="modal-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select className="modal-input" value={role} onChange={e => setRole(e.target.value)}>
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-unique">Add Member</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
