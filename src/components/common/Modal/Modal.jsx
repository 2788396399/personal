/* src/components/common/Modal/Modal.jsx */
import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Modal component
 * 
 * @param {boolean} isOpen - whether the modal is open
 * @param {function} onClose - close handler
 * @param {string} title - modal title
 * @param {string} size - sm, md, lg, full
 * @param {React.ReactNode} children - modal body content
 * @param {React.ReactNode} footer - modal footer content
 * @param {boolean} closeOnOverlayClick - whether to close when clicking the overlay
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true,
}) => {
  // ESC key listener to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-container modal--${size}`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <span className="modal-close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
