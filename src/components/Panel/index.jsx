import React from 'react';
import './panel.css';

function Panel({className, loading, children}) {
  // TODO: Design better loading animation
  return (
    <div className={`panel ${className || ''}`}>
      {loading ? <div>loading...</div> : children}
    </div>
  );
}

export default Panel;
