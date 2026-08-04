import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Monitor, List, Users, Cpu, ShieldAlert, 
  FileBarChart, Settings, User, Bell, Clock, Calendar,
  Activity, ShieldCheck, Database, CheckCircle2, Wifi, 
  Lock, ArrowUpRight, ArrowDownRight, Search, Filter, ChevronDown,
  Layers, Terminal, Command, ChevronUp
} from 'lucide-react';
import StatusBadge from './components/ui/StatusBadge';
import { useEvents, EventProvider } from './context/EventContext';
import DashboardScreen from './screens/Dashboard';
import LiveMonitor from './screens/LiveMonitor';
import ReviewQueue from './screens/ReviewQueue';
import SystemStatus from './screens/SystemStatus';
import UsersScreen from './screens/Users';
import AlertsScreen from './screens/Alerts';
import ReportsScreen from './screens/Reports';
import SettingsScreen from './screens/Settings';
import { API_ENDPOINTS } from './api/config';

function Sidebar({ activeTab, setActiveTab }) {
  const { reviewItems } = useEvents();

  const coreItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'live', name: 'Live Stream', icon: Monitor },
    { id: 'logs', name: 'Access Logs', icon: List },
    { id: 'manual', name: 'Review Queue', icon: ShieldAlert, badge: reviewItems.length },
  ];

  const manageItems = [
    { id: 'users', name: 'Users', icon: Users },
    { id: 'devices', name: 'Devices', icon: Cpu },
    { id: 'alerts', name: 'Security Alerts', icon: Bell },
    { id: 'reports', name: 'Analytics', icon: FileBarChart },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-badge">
          <Layers color="white" size={16} />
        </div>
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>HIAS Access</h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Control Console</p>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.06em', padding: '0 8px 6px 8px', textTransform: 'uppercase' }}>Main</div>
          {coreItems.map((item) => (
            <a 
              key={item.id}
              href="#" 
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab(item.id); }}
            >
              <item.icon size={15} />
              <span style={{ flex: 1 }}>{item.name}</span>
              {item.badge > 0 && (
                <span style={{ 
                  backgroundColor: 'var(--warning)', 
                  color: '#000', 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  padding: '1px 6px', 
                  borderRadius: '10px',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.06em', padding: '0 8px 6px 8px', textTransform: 'uppercase' }}>Management</div>
          {manageItems.map((item) => (
            <a 
              key={item.id}
              href="#" 
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab(item.id); }}
            >
              <item.icon size={15} />
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-dot" />
            <span>Connected</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>v1.0</span>
        </div>
      </div>
    </div>
  );
}

function MainFeed() {
  const { events } = useEvents();

  return (
    <div className="feed-container">
      <div className="feed-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600' }}>Recent Access Activity</h3>
          <span className="live-indicator">
            <span className="live-dot" />
            <span style={{ fontSize: '11px' }}>Live</span>
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
          {events.length} records
        </span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Subject</th>
            <th>ID</th>
            <th>Direction</th>
            <th>Method</th>
            <th>Device</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No access events recorded yet.</td></tr>
          ) : (
            events.map((e, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                  {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td>
                  <div className="subject-cell">
                    <div className="avatar">
                      {e.name?.charAt(0) || 'U'}
                    </div>
                    <span style={{ fontWeight: '500' }}>{e.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>{e.user_id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: e.direction === 'IN' ? 'var(--success)' : 'var(--danger)' }}>
                    {e.direction === 'IN' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span style={{ fontWeight: '600', fontSize: '11px' }}>{e.direction}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Monitor size={13} color="var(--text-muted)" /> {e.method}
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{e.device_id}</td>
                <td>
                  <StatusBadge type={e.decision} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function RightPanel() {
  const { events, connected, triggerOverride, triggerSimulation } = useEvents();
  const [reason, setReason] = useState('');
  const [deviceStatus, setDeviceStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.SYSTEM_DEVICES);
        const data = await res.json();
        if (Array.isArray(data)) {
          const mappedStatus = {
            face_devices: data.find(d => d.name.includes('Face'))?.status || 'Offline',
            rfid_readers: data.find(d => d.name.includes('RFID'))?.status || 'Offline',
            relay: data.find(d => d.name.includes('Relay'))?.status || 'Offline',
          };
          setDeviceStatus(mappedStatus);
        } else {
          setDeviceStatus(data);
        }
      } catch (err) {
        console.warn("Failed to fetch device status");
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: events.length,
    granted: events.filter(e => e.decision === 'ALLOW').length,
    denied: events.filter(e => e.decision === 'DENY').length,
    overrides: events.filter(e => e.method === 'MANUAL').length,
  };

  const handleOverride = async () => {
    if (!reason.trim()) return alert("Please enter a reason for manual override");
    await triggerOverride(reason);
    setReason('');
  };

  return (
    <div className="right-panel">
      {/* Quick Override */}
      <div className="panel-card">
        <div className="panel-title">
          <ShieldAlert size={14} color="var(--accent-primary)" /> Manual Override
        </div>
        <button className="btn-open-gate" onClick={handleOverride}>
          <Lock size={14} /> Open Gate
        </button>
        <div style={{ marginTop: '10px' }}>
          <input 
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (e.g. Visitor entry)"
            style={{ width: '100%', padding: '7px 10px', fontSize: '12px' }}
          />
        </div>
      </div>

      {/* Device Health Overview */}
      <div className="panel-card">
        <div className="panel-title">
          <Activity size={14} color="var(--accent-primary)" /> Hardware Status
        </div>
        {[
          { name: 'Controller', val: connected ? 'Online' : 'Offline' },
          { name: 'Face Scanners', val: deviceStatus?.face_devices || 'Offline' },
          { name: 'RFID Readers', val: deviceStatus?.rfid_readers || 'Offline' },
          { name: 'Gate Relays', val: deviceStatus?.relay || 'Offline' },
        ].map((s, i) => (
          <div key={i} className="status-row">
            <span style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
            <div className="status-value">
              <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{s.val}</span>
              <div className="dot-online" style={{ backgroundColor: s.val.includes('Online') || s.val === 'Healthy' || s.val === 'Simulated' ? 'var(--success)' : 'var(--danger)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Access Summary */}
      <div className="panel-card">
        <div className="panel-title">
          <FileBarChart size={14} color="var(--accent-primary)" /> Today Summary
        </div>
        <div className="summary-grid">
          <div className="summary-card">
            <h4>GRANTED</h4>
            <p style={{ color: 'var(--success)' }}>{stats.granted}</p>
          </div>
          <div className="summary-card">
            <h4>DENIED</h4>
            <p style={{ color: 'var(--danger)' }}>{stats.denied}</p>
          </div>
          <div className="summary-card">
            <h4>MANUAL</h4>
            <p style={{ color: 'var(--warning)' }}>{stats.overrides}</p>
          </div>
          <div className="summary-card">
            <h4>TOTAL</h4>
            <p>{stats.total}</p>
          </div>
        </div>
        <button 
          onClick={triggerSimulation}
          style={{ width: '100%', marginTop: '10px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '7px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <Terminal size={12} color="var(--text-muted)" /> Simulate Access Event
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'live':
        return <LiveMonitor />;
      case 'logs':
        return <MainFeed />;
      case 'manual':
        return <ReviewQueue onSearchUser={(uid) => {
          setActiveTab('users');
          setSearchTerm(uid);
        }} />;
      case 'users':
        return <UsersScreen initialSearch={searchTerm} />;
      case 'alerts':
        return <AlertsScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'devices':
        return <SystemStatus />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="layout-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="main-area">
          {/* Top Bar Header with Integrated Search */}
          <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '480px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Search residents or IDs... (e.g. S001)" 
                  onChange={async (e) => {
                    const q = e.target.value;
                    if (q.length > 1) {
                      const res = await fetch(`${API_ENDPOINTS.USERS_SEARCH}?q=${q}`);
                      const data = await res.json();
                      setSearchResults(data);
                    } else {
                      setSearchResults([]);
                    }
                  }}
                  style={{ width: '100%', padding: '6px 12px 6px 32px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
                />
                
                {searchResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginTop: '4px', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    {searchResults.map((user, i) => (
                      <div key={i} style={{ padding: '8px 12px', borderBottom: i < searchResults.length - 1 ? '1px solid var(--border-subtle)' : 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>{user.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{user.user_id}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="top-actions">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                <Clock size={13} />
                <span>{currentTime}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid var(--border-color)', paddingLeft: '14px' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={13} color="white" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '500' }}>Admin</span>
              </div>
            </div>
          </header>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {renderContent()}
          </div>
        </main>

        <RightPanel />
      </div>

      <footer className="layout-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={13} color="var(--accent-primary)" />
          HIAS — Hostel Access Control System
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>v1.0.0</div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}

export default App;
