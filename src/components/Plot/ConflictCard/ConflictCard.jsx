/* src/components/Plot/ConflictCard/ConflictCard.jsx */
import React from 'react';
import Tag from '../../common/Tag/Tag';
import Button from '../../common/Button/Button';
import './ConflictCard.css';

const ConflictCard = ({ item, onResolve, onEdit, onDelete }) => {
  const { id, type, parties = [], description, status, resolution, startChapter, resolveChapter } = item;

  const getStatusColor = (s) => {
    switch (s) {
      case 'active': return 'warning';
      case 'resolved': return 'success';
      case 'escalated': return 'danger';
      default: return 'muted';
    }
  };

  const getStatusLabel = (s) => {
    switch (s) {
      case 'active': return '进行中';
      case 'resolved': return '已解决';
      case 'escalated': return '激化中';
      default: return '未知';
    }
  };

  return (
    <div className="conflict-card">
      <div className="conflict-header">
        <Tag color={type === 'internal' ? 'secondary' : 'primary'} size="sm">
          {type === 'internal' ? '内在冲突' : '外部矛盾'}
        </Tag>
        <Tag color={getStatusColor(status)} size="sm">
          {getStatusLabel(status)}
        </Tag>
      </div>

      <div className="conflict-parties">
        {parties.length > 0 ? parties.join(' VS ') : '未知方'}
      </div>

      <div className="conflict-description">{description}</div>

      {status === 'resolved' && resolution && (
        <div className="conflict-resolution">
          解决方式：{resolution}
        </div>
      )}

      <div className="conflict-footer">
        <div className="conflict-chapters">
          <span>爆发: 第 {startChapter} 章</span>
          {resolveChapter && <span>· 解决: 第 {resolveChapter} 章</span>}
        </div>
        <div className="conflict-actions">
          {status !== 'resolved' && onResolve && (
            <Button variant="ghost" size="sm" onClick={() => onResolve(id)}>
              设为解决
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

export default ConflictCard;
