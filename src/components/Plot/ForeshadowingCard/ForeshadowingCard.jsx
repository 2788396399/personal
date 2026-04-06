/* src/components/Plot/ForeshadowingCard/ForeshadowingCard.jsx */
import React from 'react';
import Tag from '../../common/Tag/Tag';
import Button from '../../common/Button/Button';
import './ForeshadowingCard.css';

const ForeshadowingCard = ({ item, onReveal, onEdit, onDelete }) => {
  const { id, content, plantChapter, revealChapter, status, importance, notes } = item;

  const getImportanceColor = (imp) => {
    switch (imp) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'muted';
    }
  };

  return (
    <div className="foreshadowing-card">
      <div className="foreshadowing-header">
        <Tag color={getImportanceColor(importance)} size="sm">
          {importance === 'high' ? '核心伏笔' : importance === 'medium' ? '重要线索' : '细节埋线'}
        </Tag>
        <Tag color={status === 'revealed' ? 'success' : 'secondary'} size="sm">
          {status === 'revealed' ? '已揭示' : '待回收'}
        </Tag>
      </div>

      <div className="foreshadowing-content">{content}</div>

      {notes && (
        <div className="foreshadowing-notes" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
          备注：{notes}
        </div>
      )}

      <div className="foreshadowing-footer">
        <div className="foreshadowing-chapters">
          <span>埋线: 第 {plantChapter} 章</span>
          {revealChapter && <span className="foreshadowing-reveal">· 揭示: 第 {revealChapter} 章</span>}
        </div>
        <div className="foreshadowing-actions">
          {status === 'pending' && onReveal && (
            <Button variant="ghost" size="sm" onClick={() => onReveal(id)}>
              设为揭示
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
              编辑
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(id)} style={{ color: 'var(--color-danger)' }}>
              删除
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForeshadowingCard;
