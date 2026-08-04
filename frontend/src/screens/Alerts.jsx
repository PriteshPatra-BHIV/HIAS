import { useState, useEffect } from 'react';
import { Bell, ShieldAlert, Cpu, Clock, Trash2 } from 'lucide-react';
import { API_ENDPOINTS } from '../api/config';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.ALERTS);
        const data = await res.json();
        setAlerts(data);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all alerts and logs?")) return;
    try {
      await fetch(`${API_ENDPOINTS.ALERTS}/clear`, { method: 'POST' });
      setAlerts([]);
    } catch (err) {
      console.error("Failed to clear alerts", err);
    }
  };

  const getSeverityColor = (sev) => {
    if (sev === 'High') return 'var(--danger)';
    if (sev === 'Medium') return 'var(--warning)';
    return 'var(--accent-cyan)';
  };

  const getIcon = (type) => {
    if (type === 'Security') return ShieldAlert;
    if (type === 'Hardware') return Cpu;
    return Bell;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.01em' }}>
            <Bell color="var(--accent-primary)" size={20} /> Security & System Alerts
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Real-time hardware disconnects, denied access attempts, and audit logs</p>
        </div>
        <button 
          onClick={handleClearAll}
          style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger-border)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Trash2 size={14} /> CLEAR ALERTS
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Fetching security alerts...</p>
        ) : alerts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Bell size={40} style={{ marginBottom: '12px', opacity: 0.3, color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>NO ACTIVE SECURITY ALERTS</h3>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>All access nodes and hardware sensors are operating securely.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = getIcon(alert.type);
            const color = getSeverityColor(alert.severity);
            
            return (
              <div key={alert.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', padding: '14px 18px', borderLeft: `3px solid ${color}` }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: 'var(--radius-sm)', 
                  backgroundColor: 'var(--bg-input)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Icon size={18} color={color} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: color, letterSpacing: '0.06em', fontFamily: "'JetBrains Mono', monospace" }}>{alert.type.toUpperCase()}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                      <Clock size={11} /> {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>{alert.message}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '10px', 
                    fontWeight: '600', 
                    letterSpacing: '0.04em',
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: 'var(--bg-input)', 
                    border: '1px solid var(--border-color)',
                    color: color,
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {alert.severity.toUpperCase()} PRIORITY
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
