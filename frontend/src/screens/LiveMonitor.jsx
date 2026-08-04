import { useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, User, Eye, EyeOff } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { useEvents } from '../context/EventContext';

export default function LiveMonitor() {
  const { events } = useEvents();
  const [autoScroll, setAutoScroll] = useState(true);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.01em' }}>
            <Activity color="var(--accent-primary)" size={20} /> Live Monitor
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Real-time telemetry stream from hardware sensors</p>
        </div>
        <button 
          onClick={() => setAutoScroll(!autoScroll)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            backgroundColor: autoScroll ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-input)',
            color: autoScroll ? '#10b981' : 'var(--text-secondary)',
            border: autoScroll ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.15s ease'
          }}
        >
          {autoScroll ? <Eye size={14} /> : <EyeOff size={14} />}
          {autoScroll ? 'STREAM AUTO-SCROLL ON' : 'PAUSED'}
        </button>
      </div>

      <div className="card" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-surface)', zIndex: 10 }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Time</th>
              <th>Trace ID</th>
              <th>Subject</th>
              <th>Direction</th>
              <th>Method</th>
              <th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={i}>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>{new Date(e.timestamp).toLocaleTimeString()}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>{e.trace_id?.substring(0, 8)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="avatar">
                      {e.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{e.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{e.user_id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: e.direction === 'IN' ? 'var(--success)' : 'var(--danger)' }}>
                    {e.direction === 'IN' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                    <span style={{ fontSize: '11px', fontWeight: '600' }}>{e.direction}</span>
                  </div>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{e.method}</td>
                <td><StatusBadge type={e.decision} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
