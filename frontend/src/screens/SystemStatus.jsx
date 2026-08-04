import { useState, useEffect } from 'react';
import { Activity, Server, Database, Globe, Cpu, Clock, AlertTriangle } from 'lucide-react';
import { API_ENDPOINTS } from '../api/config';

export default function SystemStatus() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.SYSTEM_DEVICES);
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch devices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (name) => {
    if (name.includes('Controller')) return Globe;
    if (name.includes('Layer') || name.includes('Database')) return Database;
    if (name.includes('Face')) return Cpu;
    if (name.includes('RFID')) return Activity;
    return Server;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.01em' }}>
          <Activity color="var(--accent-primary)" size={20} /> System Observability
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Real-time hardware status, latency metrics, and service uptime</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Monitoring service connections...</p>
        ) : (
          services.map((s, i) => {
            const ServiceIcon = getIcon(s.name);
            const isHealthy = s.status === 'Healthy';
            const isWarning = s.status === 'Warning' || s.status === 'Simulated';
            const isOffline = s.status === 'Offline';

            const statusColor = isHealthy ? 'var(--success)' : isOffline ? 'var(--danger)' : 'var(--warning)';
            const statusBg = isHealthy ? 'var(--success-bg)' : isOffline ? 'var(--danger-bg)' : 'var(--warning-bg)';
            const statusBorder = isHealthy ? 'var(--success-border)' : isOffline ? 'var(--danger-border)' : 'var(--warning-border)';

            return (
              <div key={i} className="card" style={{ position: 'relative', overflow: 'hidden', borderTop: `2px solid ${statusColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                      <ServiceIcon size={16} color="var(--text-secondary)" />
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600' }}>{s.name}</h3>
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    fontWeight: '600', 
                    letterSpacing: '0.04em',
                    padding: '3px 8px', 
                    borderRadius: '4px',
                    backgroundColor: statusBg,
                    color: statusColor,
                    border: `1px solid ${statusBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {(isWarning || isOffline) && <AlertTriangle size={10} />}
                    {s.status.toUpperCase()}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '3px' }}>
                      <Clock size={10} /> UPTIME
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>{s.uptime}</div>
                  </div>
                  <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '3px' }}>
                      <Activity size={10} /> LATENCY
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace", color: s.latency.includes('ms') && parseInt(s.latency) > 100 ? 'var(--warning)' : 'var(--text-primary)' }}>
                      {s.latency}
                    </div>
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
