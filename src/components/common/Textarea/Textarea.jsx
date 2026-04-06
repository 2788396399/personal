/* src/components/common/Textarea/Textarea.jsx */
import React from 'react';
import './Textarea.css';

/**
 * Textarea component
 * 
 * @param {string} label - optional label
 * @param {string} placeholder - placeholder
 * @param {string} value - value
 * @param {function} onChange - change handler
 * @param {string} error - error message
 * @param {string} helperText - helper message
 * @param {boolean} disabled - whether the textarea is disabled
 * @param {string} className - additional CSS classes
 * @param {number} rows - number of rows
 */
const Textarea = ({
  label,
  placeholder = '',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  className = '',
  rows = 4,
  ...props
}) => {
  const containerClass = `textarea-container ${error ? 'textarea--error' : ''} ${className}`;

  return (
    <div className={containerClass}>
      {label && <label className="textarea-label">{label}</label>}
      <textarea
        className="textarea-field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        {...props}
      />
      {error && <span className="textarea-error-msg">{error}</span>}
      {helperText && !error && <span className="textarea-helper-msg">{helperText}</span>}
    </div>
  );
};

export default Textarea;
