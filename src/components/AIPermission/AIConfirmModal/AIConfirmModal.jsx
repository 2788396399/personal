/* src/components/AIPermission/AIConfirmModal/AIConfirmModal.jsx */
import React from 'react';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import './AIConfirmModal.css';

/**
 * AI Confirm Modal component
 * 
 * @param {boolean} isOpen - whether the modal is open
 * @param {function} onConfirm - confirm handler
 * @param {function} onCancel - cancel handler
 * @param {function} onEdit - optional edit handler
 * @param {string} title - modal title
 * @param {string} message - confirmation message
 * @param {object} diff - difference data to display { old: string, new: string, field: string }
 */
const AIConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  onEdit,
  title = 'AI 建议确认',
  message,
  diff,
}) => {
  const footer = (
    <div className="ai-confirm-footer">
      <Button variant="secondary" onClick={onCancel}>
        拒绝
      </Button>
      {onEdit && (
        <Button variant="outline" onClick={onEdit}>
          修改并应用
        </Button>
      )}
      <Button variant="primary" onClick={onConfirm}>
        确认应用
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      closeOnOverlayClick={false}
      title={title}
      footer={footer}
    >
      <div className="ai-confirm-modal">
        {message && <p className="ai-confirm-message">{message}</p>}
        
        {diff && (
          <div className="ai-confirm-content">
            <div className="ai-confirm-diff">
              <div className="ai-confirm-diff-item">
                <span className="ai-confirm-diff-label">{diff.field || '变更内容'}</span>
                {diff.old && (
                  <div className="ai-confirm-diff-value ai-confirm-diff-old">
                    {diff.old}
                  </div>
                )}
                <div className="ai-confirm-diff-value ai-confirm-diff-new">
                  {diff.new}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIConfirmModal;
