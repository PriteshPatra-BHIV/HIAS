export default function ConfidenceBar({ value }) {
  const color = value > 0.8 ? '#10b981' : value > 0.5 ? '#f59e0b' : '#f43f5e';
  
  return (
    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      <div style={{ 
        width: `${value * 100}%`, 
        height: '100%', 
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}`,
        transition: 'width 0.3s ease'
      }} />
    </div>
  );
}
