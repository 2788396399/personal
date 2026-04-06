/* src/components/Chapter/ChapterCard/ChapterCard.jsx */
import React from 'react';
import Tag from '../../common/Tag/Tag';
import Button from '../../common/Button/Button';
import './ChapterCard.css';

const ChapterCard = ({ chapter, index, onClick, onEdit, onDelete }) => {
  const handleActionClick = (event, action) => {
    event.stopPropagation();
    action?.();
  };

  return (
    <div className="chapter-card" onClick={onClick}>
      <div className="chapter-card-info">
        <span className="chapter-card-number">第 {index + 1} 章</span>
        <span className="chapter-card-title">{chapter.title}</span>
      </div>
      <div className="chapter-card-meta">
        <span>{chapter.content?.length || 0} 字</span>
        <Tag color={chapter.status === 'completed' ? 'success' : 'secondary'}>
          {chapter.status === 'completed' ? '已完成' : '进行中'}
        </Tag>
        <div className="chapter-card-actions">
          <Button variant="ghost" size="sm" onClick={(event) => handleActionClick(event, onEdit)}>
            编辑
          </Button>
          <Button variant="danger" size="sm" onClick={(event) => handleActionClick(event, onDelete)}>
            删除
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;
