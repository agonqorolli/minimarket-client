import React from 'react';
import './button.css';

function Button({label, disabled, onClick}) {
  return (
    <button type="button" disabled={disabled} className="button" onClick={onClick}><strong>{label}</strong></button>
  );
}

export default Button;
