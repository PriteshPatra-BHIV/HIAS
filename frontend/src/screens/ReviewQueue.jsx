import { useState, useEffect } from 'react';
import ReviewCard from '../components/ui/ReviewCard';
import { ShieldAlert, AlertTriangle, Terminal, ChevronUp, ChevronDown } from 'lucide-react';
import { API_ENDPOINTS } from '../api/config';
import { useEvents } from '../context/EventContext';

export default function ReviewQueue({ onSearchUser }) {
  const { reviewItems: items } = useEvents();
  const [processingIds, setProcessingIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // When items change, ensure activeIndex is valid
  useEffect(() => {
    if (activeIndex >= items.length && items.length > 0) {
      setActiveIndex(items.length - 1);
    } else if (items.length === 0) {
      setActiveIndex(0);
    }
  }, [items, activeIndex]);

  const handleAction = async (trace_id, action, user_id) => {
    if (action === 'search') {
      onSearchUser(user_id);
      return;
    }
    
    if (processingIds.has(trace_id)) return;

    setProcessingIds(prev => new Set(prev).add(trace_id));
    setError(null);
    
    try {
      const res = await fetch(API_ENDPOINTS.REVIEW_ACTION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trace_id, action })
      });
      if (!res.ok) throw new Error('API request failed');
    } catch (err) {
      console.error("Failed to process review action", err);
      setError(`Failed to process action for event ${trace_id.substring(0,8)}.`);
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(trace_id);
        return next;
      });
    }
  };

  const simulateEvent = async () => {
    await fetch(API_ENDPOINTS.SIMULATE_REVIEW, { method: 'POST' });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const currentItem = items[activeIndex];
      if (!currentItem) return;

      if (key === 'c' && !processingIds.has(currentItem.trace_id)) handleAction(currentItem.trace_id, 'confirm');
      if (key === 'r' && !processingIds.has(currentItem.trace_id)) handleAction(currentItem.trace_id, 'reject');
      if (key === 's') handleAction(currentItem.trace_id, 'search', currentItem.user_id);
      if (key === 'arrowdown') setActiveIndex(prev => Math.min(items.length - 1, prev + 1));
      if (key === 'arrowup') setActiveIndex(prev => Math.max(0, prev - 1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, activeIndex]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.01em' }}>
            <ShieldAlert color="var(--accent-primary)" size={20} /> Review Queue
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Manual verification for low-confidence face matches</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={simulateEvent}
            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Terminal size={13} color="var(--text-muted)" /> Simulate Review Event
          </button>
          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" }}>{items.length}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em' }}>PENDING</span>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger-border)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <ShieldAlert size={40} style={{ marginBottom: '12px', opacity: 0.3, color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Queue Clear</h3>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>All access review items have been resolved.</p>
          </div>
        ) : (
          items.map((item, index) => (
            <ReviewCard 
              key={item.trace_id} 
              data={item} 
              active={index === activeIndex}
              loading={processingIds.has(item.trace_id)}
              onConfirm={() => handleAction(item.trace_id, 'confirm')}
              onReject={() => handleAction(item.trace_id, 'reject')}
              onSearch={() => handleAction(item.trace_id, 'search', item.user_id)}
            />
          ))
        )}
      </div>

      {/* Shortcuts Legend */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)',
        padding: '8px 16px',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        margin: '10px auto 0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="keycap">C</span> Approve</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="keycap">R</span> Reject</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="keycap">S</span> Search</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="keycap"><ChevronUp size={12} /></span>
          <span className="keycap"><ChevronDown size={12} /></span>
          <span>Navigate</span>
        </div>
      </div>
    </div>
  );
}
