/* src/components/Knowledge/EntityCard/EntityCard.jsx */
import React from 'react';
import Tag from '../../common/Tag/Tag';
import Button from '../../common/Button/Button';
import './EntityCard.css';

const EntityCard = ({ entity, onEdit, onDelete }) => {
  const { id, name, type, description, aliases = [], appearances = [] } = entity;

  const getTypeLabel = (t) => {
    switch (t) {
      case 'location': return '地点';
      case 'item': return '物品';
      case 'organization': return '组织';
      case 'concept': return '设定';
      default: return '未知';
    }
  };

  return (
    <div className="entity-card">
      <div className="entity-header">
        <h4 className="entity-name">{name}</h4>
        <Tag color="secondary" size="sm">{getTypeLabel(type)}</Tag>
      </div>

      {aliases.length > 0 && (
        <div className="entity-aliases">
          {aliases.map((alias, index) => (
            <Tag key={index} color="ghost" size="sm">@{alias}</Tag>
          ))}
        </div>
      )}

      <div className="entity-description">{description}</div>

      {appearances.length > 0 && (
        <div className="entity-appearances">
          <span className="appearance-label">章节状态流转:</span>
          <div className="appearance-list">
            {appearances.map((app, idx) => (
              <div key={idx} className="appearance-item" title={app.description}>
                <span className="appearance-chapter-num">第{app.chapterNumber}章</span>
                <span className="appearance-chapter-desc">{app.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="entity-footer">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(entity); }}>
            编辑
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(id); }} style={{ color: 'var(--color-danger)' }}>
            删除
          </Button>
        )}
      </div>
    </div>
  );
};

export default EntityCard;
