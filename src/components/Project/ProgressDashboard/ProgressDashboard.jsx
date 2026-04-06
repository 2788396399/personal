/* src/components/Project/ProgressDashboard/ProgressDashboard.jsx */
import React from 'react';
import ProgressBar from '../../common/ProgressBar/ProgressBar';
import './ProgressDashboard.css';

const ProgressDashboard = ({ stats }) => {
  const {
    totalWords = 0,
    targetWords = 300000,
    totalChapters = 0,
    targetChapters = 100,
    completedChapters = 0
  } = stats || {};

  return (
    <div className="project-dashboard">
      <div className="dashboard-card">
        <h3 className="dashboard-card-title">字数进度</h3>
        <ProgressBar 
          value={totalWords} 
          max={targetWords} 
          label={`当前字数: ${totalWords.toLocaleString()} / 目标: ${targetWords.toLocaleString()}`}
          showValue
        />
      </div>
      <div className="dashboard-card">
        <h3 className="dashboard-card-title">章节进度</h3>
        <ProgressBar 
          value={totalChapters} 
          max={targetChapters} 
          label={`已创建章节: ${totalChapters} / 目标: ${targetChapters}`}
          showValue
          color="success"
        />
      </div>
    </div>
  );
};

export default ProgressDashboard;
