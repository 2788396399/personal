/* src/components/common/ProgressBar/ProgressBar.jsx */
import React from 'react';
import './ProgressBar.css';

/**
 * ProgressBar component
 * 
 * @param {number} value - current value
 * @param {number} max - max value
 * @param {string} label - optional label
 * @param {string} color - optional color variant (success, warning, danger)
 * @param {boolean} showValue - whether to show percentage value
 * @param {string} className - additional CSS classes
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  color,
  showValue = true,
  className = '',
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const containerClass = `progress-container ${color ? `progress--${color}` : ''} ${className}`;

  return (
    <div className={containerClass} {...props}>
      {(label || showValue) && (
        <div className="progress-info">
          {label && <span className="progress-label">{label}</span>}
          {showValue && <span className="progress-value">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
