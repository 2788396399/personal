/* src/components/Agent/AgentConfirm/AgentConfirmModal.jsx */

import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import './AgentConfirmModal.css';

/**
 * Agent Action Confirmation Modal
 * 
 * Shows what AI is suggesting to change and allows user to confirm or reject.
 */
const AgentConfirmModal = ({ isOpen, onClose, onConfirm, actions = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
    }
  }, [isOpen]);

  if (!actions || actions.length === 0) return null;

  const currentAction = actions[activeIndex] || actions[0];

  const renderDataPreview = (data) => {
    if (!data) return <div className="action-data-empty">无详细内容</div>;
    if (typeof data === 'string') {
      return <div className="action-data-text">{data}</div>;
    }
    
    return (
      <div className="action-data-json">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  const handleConfirmAll = async () => {
    // 按顺序执行所有动作
    for (const action of actions) {
      await onConfirm(action, true); // 传递静默模式标志，不单独清理状态
    }
    onClose();
  };

  const handleConfirmSingle = async () => {
    await onConfirm(currentAction, false);
    if (actions.length === 1) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={actions.length > 1 ? `AI 智能建议 (${actions.length} 项待处理)` : "AI 智能建议确认"}
      size="md"
    >
      <div className="agent-confirm-container">
        {actions.length > 1 && (
          <div className="agent-action-tabs">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`action-tab-btn ${activeIndex === index ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        <div className="agent-confirm-header">
          <div className="action-tag">
            <span>当前查看</span>
            <span className="action-label">{currentAction.label}</span>
          </div>
        </div>

        <div className="agent-confirm-content">
          <div className="data-preview">
            {renderDataPreview(currentAction.data)}
          </div>
        </div>

        <div className="agent-confirm-footer">
          <Button variant="secondary" onClick={onClose}>忽略全部</Button>
          <div className="footer-right-group">
            <Button variant="outline" onClick={handleConfirmSingle}>
              仅同步当前项
            </Button>
            <Button variant="primary" onClick={handleConfirmAll}>
              {actions.length > 1 ? '全部确认同步' : '确认同步'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AgentConfirmModal;
