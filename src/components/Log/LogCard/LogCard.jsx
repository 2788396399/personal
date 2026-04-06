/* src/components/Log/LogCard/LogCard.jsx */
import React from 'react';
import Button from '../../common/Button/Button';
import './LogCard.css';

const LogCard = ({ log, onUndo, onConfirm }) => {
  const { id, operationType, operationName, details, timestamp, undone, userConfirmed, canUndo } = log;

  const typeLabels = {
    content: '内容生成',
    character: '角色变更',
    plot: '情节追踪',
    knowledge: '知识提取'
  };

  return (
    <div className={`log-card ${undone ? 'log-card--undone' : ''}`}>
      <div className="log-header">
        <span className={`log-type-badge log-type--${operationType}`}>
          {typeLabels[operationType] || operationType}
        </span>
        <span className="log-time">{new Date(timestamp).toLocaleTimeString()}</span>
      </div>
      
      <div className="log-name">{operationName}</div>
      
      {details && <div className="log-details">{details}</div>}

      <div className="log-footer">
        {!undone && !userConfirmed && onConfirm && (
          <Button variant="ghost" size="sm" onClick={() => onConfirm(id)}>
            确认
          </Button>
        )}
        {!undone && canUndo && onUndo && (
          <Button variant="ghost" size="sm" onClick={() => onUndo(id)} className="btn--danger">
            撤销
          </Button>
        )}
        {undone && <span className="log-time">已撤销</span>}
        {userConfirmed && !undone && <span className="log-time" style={{ color: 'var(--color-success)' }}>已确认</span>}
      </div>
    </div>
  );
};

export default LogCard;
