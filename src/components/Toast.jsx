
export default function Toast({ message, visible }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 22,
        right: 22,
        background: 'var(--surface-2)',
        border: '1px solid var(--border-2)',
        borderRadius: 9,
        padding: '10px 14px',
        fontSize: 12.5,
        fontWeight: 500,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        letterSpacing: '-0.01em',
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <span>{message}</span>
    </div>
  );
}
