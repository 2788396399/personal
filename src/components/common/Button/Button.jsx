/* src/components/common/Button/Button.jsx */
import React from 'react';
import './Button.css';

/**
 * Button component
 * 
 * @param {string} type - HTML button type (button, submit, reset)
 * @param {string} variant - primary, secondary, outline, ghost, danger
 * @param {string} size - sm, md, lg
 * @param {boolean} fullWidth - whether the button should take full width
 * @param {boolean} disabled - whether the button is disabled
 * @param {string} className - additional CSS classes
 * @param {function} onClick - click handler
 * @param {React.ReactNode} children - button content
 * @param {React.ReactNode} icon - optional icon before text
 */
const Button = ({
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
  children,
  icon,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const fullWidthClass = fullWidth ? 'btn--full' : '';
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
