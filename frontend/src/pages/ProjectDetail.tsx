import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, UserPlus, Trash2, ChevronLeft } from 'lucide-react';
import './ProjectDetail.css';

interface Member {
  user: { id: string; name: string; email: string; createdAt?: string };
  role: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignee?: { id: string; name: string; email: string };
}

interface Project {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  members: Member[];
  tasks: Task[];
}

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('MEMBER');
  const [memberError, setMemberError] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskError, setTaskError] = useState('');

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchProject(); }, [id]);

  const isAdmin = project?.adminId === user?.id;

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError('');
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail, role: memberRole });
      setMemberEmail('');
      setMemberRole('MEMBER');
      setShowAddMember(false);
      fetchProject();
    } catch (err: any) {
      setMemberError(err.response?.data?.error || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Remove this member from the project?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError('');
    try {
      await api.post('/tasks', {
        title: taskTitle,
        description: taskDesc,
        dueDate: taskDue || null,
        priority: taskPriority,
        projectId: id,
        assigneeId: taskAssignee || null
      });
      setTaskTitle(''); setTaskDesc(''); setTaskDue('');
      setTaskPriority('MEDIUM'); setTaskAssignee('');
      setShowAddTask(false);
      fetchProject();
    } catch (err: any) {
      setTaskError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchProject();
    } catch (err) { console.error(err); }
  };



  const priorityColor: Record<string, string> = {
    HIGH: '#ef4444', MEDIUM: '#fb923c', LOW: '#34d399',
  };

  if (loading) return (
    <div className="layout">
      <Sidebar active="projects" />
      <main className="main-content"><p className="text-dim">Loading...</p></main>
    </div>
  );

  if (!project) return (
    <div className="layout">
      <Sidebar active="projects" />
      <main className="main-content"><p className="text-dim">Project not found.</p></main>
    </div>
  );

  return (
    <div className="layout">
      <Sidebar active="projects" />
      <main className="main-content">
        {/* Breadcrumb */}
        <Link to="/projects" className="back-link">
          <ChevronLeft size={16} /> Projects
        </Link>

        {/* Header */}
        <div className="project-detail-header">
          <div>
            <h1 className="page-title">{project.name}</h1>
            {project.description && <p className="page-subtitle">{project.description}</p>}
          </div>
          {isAdmin && (
            <div className="header-actions">
              <button className="btn-secondary-sm" onClick={() => setShowAddMember(true)}>
                <UserPlus size={15} /> Add Member
              </button>
              <button className="btn-create" onClick={() => setShowAddTask(true)}>
                <Plus size={15} /> Add Task
              </button>
            </div>
          )}
        </div>

        {/* Two columns */}
        <div className="detail-grid">
          {/* Tasks Column */}
          <div className="detail-section">
            <h2 className="section-heading">Tasks <span className="count-badge">{project.tasks.length}</span></h2>
            {project.tasks.length === 0 ? (
              <div className="empty-inline">
                <p>No tasks yet.</p>
                {isAdmin && <button className="btn-create-sm" onClick={() => setShowAddTask(true)}><Plus size={13} /> Add Task</button>}
              </div>
            ) : (
              <div className="task-cards">
                {project.tasks.map(task => (
                  <div key={task.id} className="task-card">
                    <div className="task-card-top">
                      <div className="task-dot" style={{ backgroundColor: priorityColor[task.priority] || '#8b8d98' }} />
                      <p className={`task-card-title ${task.status === 'DONE' ? 'done' : ''}`}>{task.title}</p>
                    </div>
                    <div className="task-card-bottom">
                      {task.assignee && (
                        <span className="task-assignee">{task.assignee.name}</span>
                      )}
                      <select
                        className="status-select"
                        value={task.status}
                        onChange={e => updateTaskStatus(task.id, e.target.value)}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members Column */}
          <div className="detail-section">
            <h2 className="section-heading">Members <span className="count-badge">{project.members.length}</span></h2>
            <div className="members-list-sm">
              {project.members.map(m => (
                <div key={m.user.id} className="member-row-sm">
                  <div className="member-avatar-sm">{m.user.name.charAt(0).toUpperCase()}</div>
                  <div className="member-info-sm">
                    <p className="member-name-sm">{m.user.name}</p>
                    <p className="member-email-sm">{m.user.email}</p>
                  </div>
                  <span className={`role-badge-sm role-${m.role.toLowerCase()}`}>{m.role}</span>
                  {isAdmin && m.user.id !== user?.id && (
                    <button className="remove-btn" onClick={() => handleRemoveMember(m.user.id)} title="Remove member">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Member Modal */}
        {showAddMember && (
          <div className="modal-overlay" onClick={() => setShowAddMember(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Add Team Member</h2>
              <p className="modal-hint">The person must already have a NOVA account.</p>
              {memberError && <div className="modal-error">{memberError}</div>}
              <form onSubmit={handleAddMember} className="modal-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="modal-input" type="email" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} placeholder="member@example.com" required />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select className="modal-input" value={memberRole} onChange={e => setMemberRole(e.target.value)}>
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-ghost" onClick={() => setShowAddMember(false)}>Cancel</button>
                  <button type="submit" className="btn-create">Add Member</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Add Task</h2>
              {taskError && <div className="modal-error">{taskError}</div>}
              <form onSubmit={handleAddTask} className="modal-form">
                <div className="form-group">
                  <label>Title</label>
                  <input className="modal-input" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task title" required />
                </div>
                <div className="form-group">
                  <label>Description (optional)</label>
                  <textarea className="modal-input" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} rows={2} placeholder="What needs to be done?" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input className="modal-input" type="date" value={taskDue} onChange={e => setTaskDue(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select className="modal-input" value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Assign To</label>
                  <select className="modal-input" value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)}>
                    <option value="">Unassigned</option>
                    {project.members.map(m => (
                      <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-ghost" onClick={() => setShowAddTask(false)}>Cancel</button>
                  <button type="submit" className="btn-create">Create Task</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
