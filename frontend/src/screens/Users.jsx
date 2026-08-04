import { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, UserPlus, MoreVertical, Shield, User } from 'lucide-react';
import { API_ENDPOINTS } from '../api/config';

export default function Users({ initialSearch = '' }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ user_id: '', name: '' });
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const fetchUsers = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `${API_ENDPOINTS.USERS_SEARCH}?q=${query}` : API_ENDPOINTS.USERS;
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(initialSearch);
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_ENDPOINTS.USERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setShowModal(false);
        setNewUser({ user_id: '', name: '' });
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.detail);
      }
    } catch (err) {
      alert("Failed to enroll user");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '420px', padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Enroll Authorized Resident</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '6px' }}>USER ID (e.g. S006)</label>
                <input 
                  type="text" 
                  required
                  value={newUser.user_id}
                  onChange={e => setNewUser({...newUser, user_id: e.target.value})}
                  placeholder="S006"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '6px' }}>FULL NAME</label>
                <input 
                  type="text" 
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Enter full name"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>CANCEL</button>
                <button type="submit" style={{ flex: 1, background: 'var(--accent-gradient)', color: 'white', border: 'none', padding: '10px', borderRadius: 'var(--radius-sm)', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>ENROLL USER</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.01em' }}>
            <UsersIcon color="var(--accent-primary)" size={20} /> User Registry
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Authorized residents and security credential registry</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Filter by name or ID..." 
              value={searchQuery}
              onChange={(e) => {
                const q = e.target.value;
                setSearchQuery(q);
                fetchUsers(q);
              }}
              style={{ width: '100%', padding: '8px 8px 8px 32px', fontSize: '12px' }}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            style={{ 
              background: 'var(--accent-gradient)', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: 'var(--radius-sm)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px var(--accent-glow)'
            }}
          >
            <UserPlus size={14} /> ADD USER
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 16px' }}>User</th>
              <th style={{ padding: '12px 16px' }}>User ID</th>
              <th style={{ padding: '12px 16px' }}>Role</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading user directory...</td></tr>
            ) : (
              users.map((user, i) => (
                <tr key={i}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar">
                        {user.role === 'Admin' ? <Shield size={14} color="var(--accent-primary)" /> : user.name?.charAt(0) || 'U'}
                      </div>
                      <span style={{ fontWeight: '500' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{user.user_id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: user.role === 'Admin' ? 'rgba(94, 106, 210, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                      color: user.role === 'Admin' ? '#a3aeff' : '#38bdf8',
                      border: user.role === 'Admin' ? '1px solid rgba(94, 106, 210, 0.25)' : '1px solid rgba(56, 189, 248, 0.25)',
                      fontWeight: '600',
                      letterSpacing: '0.04em',
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>
                      {(user.role || 'Resident').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
