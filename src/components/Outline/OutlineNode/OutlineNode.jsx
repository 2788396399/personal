/* src/components/Outline/OutlineNode/OutlineNode.jsx */
import React from 'react';
import Tag from '../../common/Tag/Tag';
import Button from '../../common/Button/Button';
import './OutlineNode.css';

const OutlineNode = ({ node, onEdit, onDelete }) => {
  const { 
    id,
    chapterNumber, 
    title, 
    objective, 
    plotPoints = [], 
    targetWordCount,
    status,
    foreshadowing = {} 
  } = node;

  return (
    <div className="outline-node">
      <div className="outline-node-header">
        <div className="outline-node-title-group">
          <span className="outline-node-number">第 {chapterNumber} 章</span>
          <h4 className="outline-node-title">{title || '未命名章节'}</h4>
        </div>
        <div className="outline-node-tags">
          {targetWordCount > 0 && (
            <Tag color="ghost" size="xs">计划 {targetWordCount} 字</Tag>
          )}
          <Tag color={status === 'completed' ? 'success' : 'secondary'} size="xs">
            {status === 'completed' ? '已完成' : '进行中'}
          </Tag>
        </div>
      </div>

      {objective && (
        <div className="outline-node-objective">
          {objective}
        </div>
      )}

      {plotPoints.length > 0 && (
        <ul className="outline-node-plot-points">
          {plotPoints.slice(0, 3).map((point, i) => (
            <li key={i} className="outline-node-plot-point">{point}</li>
          ))}
          {plotPoints.length > 3 && (
            <li className="outline-node-plot-point" style={{ opacity: 0.5 }}>... 以及更多</li>
          )}
        </ul>
      )}

      <div className="outline-node-footer">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>编辑</Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(id)} style={{ color: 'var(--color-danger)' }}>删除</Button>
        )}
      </div>
    </div>
  );
};

export default OutlineNode;
