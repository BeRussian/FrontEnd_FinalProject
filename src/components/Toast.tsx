import type { FC } from 'react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

/**
 * Toast Component:
 * Displays temporary feedback notifications (e.g., "⭐ Added to favorites!").
 * Appears at the bottom-right corner and auto-dismisses.
 */
export const Toast: FC<ToastProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <aside
      aria-live="polite"
      role="status"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: '#1f2937',
        color: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: 500,
        animation: 'slideUpFade 0.25s ease-out'
      }}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          padding: '2px 4px',
          fontSize: '0.9rem',
          lineHeight: 1
        }}
      >
        ✕
      </button>
    </aside>
  );
};

