import React from 'react';
import './panel.css';

function Panel({className, children}) {
  return (
    <div className={`panel ${className || ''}`}>
      {children}
    </div>
  );
}

export default Panel;
