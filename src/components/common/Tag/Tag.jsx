/* src/components/common/Tag/Tag.jsx */
import React from 'react';
import './Tag.css';

/**
 * Tag component
 * 
 * @param {string} color - primary, secondary, success, warning, danger, muted
 * @param {boolean} closable - whether the tag is closable
 * @param {function} onClose - close handler
 * @param {string} className - additional CSS classes
 * @param {React.ReactNode} children - tag content
 * @param {React.ReactNode} icon - optional icon
 */
const Tag = ({
  color = 'muted',
  closable = false,
  onClose,
  className = '',
  children,
  icon,
  ...props
}) => {
  const tagClass = `tag tag--${color} ${closable ? 'tag--closable' : ''} ${className}`;

  return (
    <span className={tagClass} {...props}>
      {icon && <span className="tag-icon">{icon}</span>}
      <span className="tag-content">{children}</span>
      {closable && (
        <span className="tag-close" onClick={onClose}>
          &times;
        </span>
      )}
    </span>
  );
};

export default Tag;
