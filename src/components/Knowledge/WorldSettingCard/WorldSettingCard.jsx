/* src/components/Knowledge/WorldSettingCard/WorldSettingCard.jsx */
import React from 'react';
import Tag from '../../common/Tag/Tag';
import Button from '../../common/Button/Button';
import './WorldSettingCard.css';

const WorldSettingCard = ({ setting, onEdit, onDelete }) => {
  const { id, title, category, content, appearances = [] } = setting;

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'general': return '通用';
      case 'geography': return '地理';
      case 'history': return '历史';
      case 'magic_system': return '力量体系';
      case 'culture': return '文化';
      default: return cat;
    }
  };

  return (
    <div className="setting-card">
      <div className="setting-header">
        <h4 className="setting-title">{title}</h4>
        <Tag color="primary" size="sm">{getCategoryLabel(category)}</Tag>
      </div>

      <div className="setting-content">{content}</div>

      {appearances.length > 0 && (
        <div className="setting-appearances">
          <span className="appearance-label">章节设定演变:</span>
          <div className="appearance-list">
            {appearances.map((app, idx) => (
              <div key={idx} className="appearance-item" title={app.content}>
                <span className="appearance-chapter-num">第{app.chapterNumber}章</span>
                <span className="appearance-chapter-desc">{app.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="setting-footer">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(setting); }}>
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

export default WorldSettingCard;
