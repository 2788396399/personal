/* src/components/Project/ProjectCard/ProjectCard.jsx */
import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, isNew = false, onClick }) => {
  if (isNew) {
    return (
      <div className="project-card project-card--new" onClick={onClick}>
        <div className="project-card-new-icon">+</div>
        <div className="project-card-new-text">新建作品</div>
      </div>
    );
  }

  const { name, cover } = project;

  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-cover">
        {cover ? (
          <img src={cover} alt={name} />
        ) : (
          <div className="project-card-cover-placeholder">📚</div>
        )}
      </div>
      <div className="project-card-name" title={name}>
        {name}
      </div>
    </div>
  );
};

export default ProjectCard;
