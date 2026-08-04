export default function StatusBadge({ type }) {
  const styles = {
    AUTO: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.25)', text: 'ALLOWED' },
    ALLOW: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.25)', text: 'ALLOWED' },
    REVIEW: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)', text: 'REVIEW' },
    REJECT: { bg: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: 'rgba(244, 63, 94, 0.25)', text: 'DENIED' },
    DENY: { bg: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: 'rgba(244, 63, 94, 0.25)', text: 'DENIED' },
  };

  const current = styles[type] || styles.REVIEW;

  return (
    <span style={{
      backgroundColor: current.bg,
      color: current.color,
      border: `1px solid ${current.border}`,
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '600',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontFamily: "'JetBrains Mono', monospace"
    }}>
      <span style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        backgroundColor: current.color
      }} />
      {current.text}
    </span>
  );
}
