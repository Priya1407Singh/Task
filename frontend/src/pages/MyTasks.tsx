import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { api } from '../services/api';
import { Search, ListTodo } from 'lucide-react';
import './MyTasks.css';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: string;
  status: string;
  project?: { name: string };
}

const STATUS_MAP: Record<string, string> = {
  'To Do': 'TODO',
  'In Progress': 'IN_PROGRESS',
  'Done': 'DONE',
};

export const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [priorityFilter, setPriorityFilter] = useState('All priorities');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const projectsRes = await api.get('/projects');
        const allTasks: Task[] = [];
        for (const project of projectsRes.data) {
          const tasksRes = await api.get(`/tasks/project/${project.id}`);
          tasksRes.data.forEach((t: Task) => allTasks.push({ ...t, project: { name: project.name } }));
        }
        setTasks(allTasks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All statuses' || t.status === STATUS_MAP[statusFilter];
    const matchPriority = priorityFilter === 'All priorities' || t.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchSearch && matchStatus && matchPriority;
  });

  const statusBadge: Record<string, { label: string; cls: string }> = {
    TODO: { label: 'To Do', cls: 'badge-todo' },
    IN_PROGRESS: { label: 'In Progress', cls: 'badge-inprogress' },
    DONE: { label: 'Done', cls: 'badge-done' },
  };

  const priorityDot: Record<string, string> = {
    HIGH: '#ef4444',
    URGENT: '#ef4444',
    MEDIUM: '#fb923c',
    LOW: '#34d399',
  };

  return (
    <div className="layout">
      <Sidebar active="tasks" />
      <main className="main-content">
        <div className="page-top">
          <div>
            <h1 className="page-title">My Tasks</h1>
            <p className="page-subtitle">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="page-icon-wrapper">
            <ListTodo size={28} color="#6366f1" />
          </div>
        </div>

        {/* Search + Standard Select Dropdowns */}
        <div className="tasks-toolbar">
          <div className="search-bar-refined flex-1">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="select-wrapper">
            <select 
              className="standard-select" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All statuses">All statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="select-wrapper">
            <select 
              className="standard-select" 
              value={priorityFilter} 
              onChange={e => setPriorityFilter(e.target.value)}
            >
              <option value="All priorities">All priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-dim">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon-lg">✅</div>
            <h3>No tasks found</h3>
            <p>Tasks assigned to you will appear here.</p>
          </div>
        ) : (
          <div className="tasks-list-refined">
            {filtered.map(task => (
              <div key={task.id} className="task-row-refined">
                <div className="task-left">
                  <div className="task-dot" style={{ backgroundColor: priorityDot[task.priority.toUpperCase()] || '#8b8d98' }} />
                  <div>
                    <p className={`task-title-refined ${task.status === 'DONE' ? 'done' : ''}`}>{task.title}</p>
                    {task.project && <p className="task-project-refined">{task.project.name}</p>}
                  </div>
                </div>
                <div className="task-right">
                  {task.dueDate && (
                    <span className="task-due-refined">
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  <span className={`task-badge-refined ${statusBadge[task.status]?.cls}`}>
                    {statusBadge[task.status]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
