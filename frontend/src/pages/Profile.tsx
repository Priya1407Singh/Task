import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Info, User } from 'lucide-react';
import './Profile.css';

const AVATARS = [
  '👤', '👨‍💻', '👩‍💻', '🧑‍🎨', '👩‍🔬', '👨‍🚀', '👩‍🚒', '👨‍⚖️', '👩‍🏫', '🦊', '🐼', '🐸', '🦁', '🐯', '🦋'
];

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="layout">
      <Sidebar active="dashboard" />
      <main className="main-content">
        <div className="page-top">
          <h1 className="page-title">Profile</h1>
        </div>

        <div className="profile-card-refined animate-fade-in">
          {/* Header Section */}
          <div className="profile-header-box">
            <div className="profile-avatar-large">
              {selectedAvatar === '👤' ? <User size={40} /> : <span style={{ fontSize: '40px' }}>{selectedAvatar}</span>}
            </div>
            <div className="profile-info-box">
              <h2 className="profile-name-display">{displayName}</h2>
              <p className="profile-email-display">{user?.email}</p>
              <div className="profile-meta-row">
                <span className="role-pill-sm">member</span>
                <span className="joined-date-sm">Joined {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="profile-divider"></div>

          {/* Form Section */}
          <div className="profile-form-refined">
            <div className="form-group">
              <label>Display Name</label>
              <input 
                className="modal-input" 
                value={displayName} 
                onChange={e => setDisplayName(e.target.value)} 
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Avatar</label>
              <div className="avatar-grid-refined">
                {AVATARS.map(ava => (
                  <button 
                    key={ava} 
                    className={`avatar-option ${selectedAvatar === ava ? 'active' : ''}`}
                    onClick={() => setSelectedAvatar(ava)}
                  >
                    {ava}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary-unique save-btn-refined" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : success ? 'Changes Saved!' : 'Save changes'}
            </button>
          </div>
        </div>

        <div className="contact-footer-hint-refined">
          <Info size={16} className="info-icon-blue" />
          <span>Email and role cannot be changed from profile. Contact an admin for role changes.</span>
        </div>
      </main>
    </div>
  );
};
