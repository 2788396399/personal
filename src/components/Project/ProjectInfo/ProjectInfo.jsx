/* src/components/Project/ProjectInfo/ProjectInfo.jsx */
import React from 'react';
import Button from '../../common/Button/Button';
import './ProjectInfo.css';

const ProjectInfo = ({ project, onEdit }) => {
  if (!project) return null;

  return (
    <div className="project-info-card">
      <div className="project-info-cover">
        {project.cover ? <img src={project.cover} alt={project.name} /> : '📚'}
      </div>
      <div className="project-info-content">
        <div className="project-info-title-row">
          <div className="project-info-heading">
            <h2 className="project-info-title">{project.name}</h2>
            <div className="project-info-targets">
              <span>目标字数：{(project.settings?.targetWordCount || 300000).toLocaleString()}</span>
              <span>目标章节：{project.settings?.targetChapterCount || 100}</span>
            </div>
          </div>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              编辑作品信息
            </Button>
          )}
        </div>
        <div className="project-info-meta">
          <span>类型：{project.genre || '未分类'}</span>
          <span>创建：{new Date(project.createdAt).toLocaleDateString()}</span>
          <span>更新：{new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>
        <p className="project-info-description">
          {project.description || '暂无作品简介。可以在设置中添加简介，帮助 AI 更好地理解您的创作意图。'}
        </p>
      </div>
    </div>
  );
};

export default ProjectInfo;
