/* src/components/Chapter/ChapterList/ChapterList.jsx */
import React from 'react';
import Button from '../../common/Button/Button';
import ChapterCard from '../ChapterCard/ChapterCard';
import './ChapterList.css';

const ChapterList = ({ chapters, onAddChapter, onSelectChapter, onEditChapter, onDeleteChapter }) => {
  return (
    <div className="chapter-list-section">
      <div className="chapter-list-header">
        <h3 className="chapter-list-title">章节列表 ({chapters?.length || 0})</h3>
        <Button variant="primary" onClick={onAddChapter}>＋ 新建章节</Button>
      </div>

      <div className="chapter-list">
        {chapters?.length > 0 ? (
          chapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={index}
              onClick={() => onSelectChapter(chapter.id)}
              onEdit={() => onEditChapter?.(chapter)}
              onDelete={() => onDeleteChapter?.(chapter)}
            />
          ))
        ) : (
          <div className="chapter-empty">
            还没有创建任何章节。点击上方按钮开始创作第一章。
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterList;
