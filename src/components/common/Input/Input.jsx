/* src/components/common/Input/Input.jsx */
import React from 'react';
import './Input.css';

/**
 * Input component
 * 
 * @param {string} label - optional label
 * @param {string} type - input type
 * @param {string} placeholder - input placeholder
 * @param {string} value - input value
 * @param {function} onChange - change handler
 * @param {string} error - error message
 * @param {string} helperText - helper message
 * @param {boolean} disabled - whether the input is disabled
 * @param {string} className - additional CSS classes
 */
const Input = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  className = '',
  ...props
}) => {
  const containerClass = `input-container ${error ? 'input--error' : ''} ${className}`;

  return (
    <div className={containerClass}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        <input
          type={type}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <span className="input-error-msg">{error}</span>}
      {helperText && !error && <span className="input-helper-msg">{helperText}</span>}
    </div>
  );
};

export default Input;
