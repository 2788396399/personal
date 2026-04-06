/* src/components/common/Toast/Toast.jsx */
import React, { useEffect } from 'react';
import './Toast.css';

/**
 * Toast component
 * 
 * @param {string} type - success, error, warning, info
 * @param {string} title - optional title
 * @param {string} message - message content
 * @param {number} duration - display duration in ms
 * @param {function} onClose - close handler
 * @param {boolean} isOpen - whether the toast is open
 */
const Toast = ({
  type = 'info',
  title,
  message,
  duration = 3000,
  onClose,
  isOpen = false,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const toastClass = `toast toast--${type}`;

  return (
    <div className={toastClass}>
      <div className="toast-content">
        {title && <h5 className="toast-title">{title}</h5>}
        <p className="toast-message">{message}</p>
      </div>
      <span className="toast-close" onClick={onClose}>
        &times;
      </span>
    </div>
  );
};

export default Toast;
