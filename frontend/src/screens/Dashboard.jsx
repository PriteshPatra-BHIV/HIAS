import { LayoutDashboard, Users, UserCheck, UserX, Fingerprint } from 'lucide-react';
import { useEvents } from '../context/EventContext';

export default function Dashboard() {
  const { events } = useEvents();

  // --- Calculate KPIs ---
  const stats = {
    total: events.length,
    granted: events.filter(e => e.decision === 'ALLOW').length,
    denied: events.filter(e => e.decision === 'DENY').length,
    overrides: events.filter(e => e.method === 'MANUAL').length,
  };

  const kpis = [
    { name: 'Total Access Events', value: stats.total.toLocaleString(), icon: Users, color: '#38bdf8' },
    { name: 'Granted Scans', value: stats.granted.toLocaleString(), icon: UserCheck, color: '#10b981' },
    { name: 'Denied Scans', value: stats.denied.toLocaleString(), icon: UserX, color: '#f43f5e' },
    { name: 'Manual Overrides', value: stats.overrides.toLocaleString(), icon: Fingerprint, color: '#f59e0b' },
  ];

  // --- Calculate Hourly Chart Data ---
  const hourlyData = new Array(12).fill(0); // 08:00 to 20:00
  events.forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    if (hour >= 8 && hour < 20) {
      hourlyData[hour - 8]++;
    }
  });
  const maxEvents = Math.max(...hourlyData, 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.01em' }}>
            <LayoutDashboard color="var(--accent-primary)" size={20} /> System Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Real-time telemetry and daily access density</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: `2px solid ${kpi.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.name}</span>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: 'var(--radius-sm)', 
                backgroundColor: `${kpi.color}15`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: kpi.color
              }}>
                <kpi.icon size={16} />
              </div>
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: '700', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em' }}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Peak Access Hours</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hourly traffic distribution across all entry nodes</p>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
            08:00 - 20:00 Window
          </div>
        </div>

        <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '8px' }}>
          {hourlyData.map((count, i) => (
            <div key={i} style={{ 
              flex: 1, 
              height: `${Math.max((count / maxEvents) * 100, 4)}%`, 
              backgroundColor: count > 0 ? 'var(--accent-primary)' : 'var(--bg-input)', 
              borderRadius: '3px 3px 0 0',
              transition: 'all 0.2s ease',
              boxShadow: count > 0 ? '0 0 10px var(--accent-glow)' : 'none',
              cursor: 'pointer'
            }} 
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-cyan)'}
            onMouseOut={(e) => e.target.style.backgroundColor = count > 0 ? 'var(--accent-primary)' : 'var(--bg-input)'}
            title={`${8 + i}:00 - ${count} events`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: 'var(--text-muted)', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace" }}>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
        </div>
      </div>
    </div>
  );
}
