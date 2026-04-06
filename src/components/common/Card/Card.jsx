/* src/components/common/Card/Card.jsx */
import React from 'react';
import './Card.css';

/**
 * Card component
 * 
 * @param {string} title - card title
 * @param {boolean} hover - whether the card has hover effect
 * @param {string} className - additional CSS classes
 * @param {React.ReactNode} children - card body content
 * @param {React.ReactNode} footer - card footer content
 * @param {React.ReactNode} extra - extra content in header
 * @param {function} onClick - click handler
 */
const Card = ({
  title,
  hover = true,
  className = '',
  children,
  footer,
  extra,
  onClick,
  ...props
}) => {
  const cardClass = `card ${hover ? 'card--hover' : ''} ${className}`;

  return (
    <div className={cardClass} onClick={onClick} {...props}>
      {title && (
        <div className="card-header">
          <h4 className="card-title">{title}</h4>
          {extra && <div className="card-extra">{extra}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
