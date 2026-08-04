import { Check, X, Search, Clock, Fingerprint } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ConfidenceBar from './ConfidenceBar';

export default function ReviewCard({ data, onConfirm, onReject, onSearch, active, loading }) {
  return (
    <div className={`card ${active ? 'active-card' : ''}`} style={{
      display: 'grid',
      gridTemplateColumns: '100px 1fr 200px',
      gap: '16px',
      alignItems: 'center',
      backgroundColor: active ? 'var(--bg-card-hover)' : 'var(--bg-card)',
      border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
      boxShadow: active ? '0 0 16px var(--accent-glow)' : 'none',
      transition: 'all 0.15s ease',
      marginBottom: '8px',
      opacity: (active && !loading) ? 1 : 0.75,
      pointerEvents: loading ? 'none' : 'auto'
    }}>
      {/* Image (Left) */}
      <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        {data.image ? (
          <img src={data.image} alt="Subject" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Fingerprint size={40} />
          </div>
        )}
      </div>

      {/* Details (Center) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>{data.user_id || 'UNKNOWN_ID'}</h3>
          <StatusBadge type="REVIEW" />
        </div>
        
        <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} color="var(--text-muted)" />
            {new Date(data.timestamp).toLocaleTimeString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
            <Fingerprint size={13} />
            {data.trace_id?.substring(0, 8)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', fontSize: '11px', color: 'var(--accent-cyan)' }}>
            {data.method}
          </div>
        </div>

        <div style={{ marginTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>
            <span>Confidence Match</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)' }}>{(data.confidence * 100).toFixed(1)}%</span>
          </div>
          <ConfidenceBar value={data.confidence} />
        </div>
      </div>

      {/* Actions (Right) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button 
          onClick={onConfirm} 
          disabled={loading}
          style={{
            backgroundColor: loading ? 'var(--bg-input)' : 'rgba(16, 185, 129, 0.15)',
            color: loading ? 'var(--text-muted)' : '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '7px 12px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={14} /> {loading ? 'PROCESSING...' : 'APPROVE'}
          </span>
          <span className="keycap">C</span>
        </button>

        <button 
          onClick={onSearch} 
          disabled={loading}
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '7px 12px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} /> SEARCH
          </span>
          <span className="keycap">S</span>
        </button>

        <button 
          onClick={onReject} 
          disabled={loading}
          style={{
            backgroundColor: loading ? 'var(--bg-input)' : 'rgba(244, 63, 94, 0.15)',
            color: loading ? 'var(--text-muted)' : '#f43f5e',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '7px 12px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <X size={14} /> {loading ? 'PROCESSING...' : 'REJECT'}
          </span>
          <span className="keycap">R</span>
        </button>
      </div>
    </div>
  );
}
