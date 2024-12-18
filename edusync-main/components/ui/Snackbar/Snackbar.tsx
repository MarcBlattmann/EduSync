import { useEffect } from 'react';
import './Snackbar.css';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarProps {
  message: string;
  type: SnackbarType;
  onClose: () => void;
  duration?: number;
}

export function Snackbar({ message, type, onClose, duration = 5000 }: SnackbarProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`snackbar ${type}`}>
      <p>{message}</p>
      <button onClick={onClose} className="close-button">×</button>
    </div>
  );
}
