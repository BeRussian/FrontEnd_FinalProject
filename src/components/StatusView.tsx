import type { FC } from 'react';

interface StatusViewProps {
  type: 'loading' | 'error';
  message?: string;
  onRetry?: () => void;
}

/**
 * StatusView component:
 * Reusable component handling the 3 official course application states:
 * - Loading indicator
 * - Error notification with optional retry action
 */
export const StatusView: FC<StatusViewProps> = ({ type, message, onRetry }) => {
  if (type === 'loading') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        color: '#e65100',
        fontFamily: 'system-ui, sans-serif'
      }}>
        {/* Simple CSS-animated spinning circle */}
        <div style={{
          width: '36px',
          height: '36px',
          border: '4px solid #ffe0b2',
          borderTop: '4px solid #e65100',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '1rem'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>
          {message || 'Cooking up live recipes from TheMealDB...'}
        </span>
      </div>
    );
  }

  // Error state
  return (
    <div style={{
      backgroundColor: '#fff3e0',
      border: '1px solid #ffb74d',
      borderRadius: '8px',
      padding: '0.85rem 1rem',
      margin: '0.5rem 0 1rem 0',
      fontSize: '0.85rem',
      color: '#b26a00',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.5rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <span>⚠️ {message || 'Unable to connect to live API. Using local fallback recipes.'}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            backgroundColor: '#e65100',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: 600,
            flexShrink: 0
          }}
        >
          Retry API
        </button>
      )}
    </div>
  );
};
