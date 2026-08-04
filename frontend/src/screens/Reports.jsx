import { useState, useEffect } from 'react';
import { BarChart3, Download, PieChart, TrendingUp, Calendar } from 'lucide-react';
import { API_ENDPOINTS } from '../api/config';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.REPORTS_STATS);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch report stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    window.open(API_ENDPOINTS.REPORTS_EXPORT, '_blank');
  };

  if (loading) return <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Generating telemetry analytics...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.01em' }}>
            <BarChart3 color="var(--accent-primary)" size={20} /> Analytics & Data Reports
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Access decision split, authentication methods, and raw CSV log exporter</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '500' }}>
            <Calendar size={14} color="var(--text-muted)" /> LAST 24 HOURS
          </button>
          <button 
            onClick={handleExport}
            style={{ background: 'var(--accent-gradient)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', boxShadow: '0 2px 8px var(--accent-glow)' }}
          >
            <Download size={14} /> EXPORT AUDIT LOGS (.CSV)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Access Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PieChart size={16} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>DECISION SPLIT</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '120px' }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--success)', fontFamily: "'JetBrains Mono', monospace" }}>{stats.decision_split.allowed}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em', marginTop: '4px' }}>GRANTED</div>
             </div>
             <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-color)' }} />
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--danger)', fontFamily: "'JetBrains Mono', monospace" }}>{stats.decision_split.denied}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em', marginTop: '4px' }}>DENIED</div>
             </div>
          </div>
        </div>

        {/* Method Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <TrendingUp size={16} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>AUTHENTICATION METHODS</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'RFID SCANNER', value: stats.method_split.rfid, color: '#38bdf8' },
              { label: 'FACE RECOGNITION', value: stats.method_split.face, color: '#5e6ad2' },
              { label: 'MANUAL OVERRIDE', value: stats.method_split.manual, color: '#f59e0b' },
            ].map((m, i) => {
              const total = stats.method_split.rfid + stats.method_split.face + stats.method_split.manual || 1;
              const percent = (m.value / total) * 100;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                    <span style={{ fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>{m.value} ({percent.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ width: `${percent}%`, height: '100%', backgroundColor: m.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hourly Pattern */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <TrendingUp size={16} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>HOURLY SCAN DENSITY (24-HOUR CYCLES)</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '160px', gap: '4px', paddingBottom: '10px' }}>
          {stats.hourly_distribution.map((val, i) => {
            const max = Math.max(...stats.hourly_distribution) || 1;
            const height = Math.max((val / max) * 100, 3);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '100%', 
                  height: `${height}%`, 
                  backgroundColor: val > 0 ? 'var(--accent-primary)' : 'var(--bg-input)', 
                  borderRadius: '2px 2px 0 0',
                  boxShadow: val > 0 ? '0 0 6px var(--accent-glow)' : 'none'
                }} />
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{i}h</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
