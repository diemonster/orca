import React from 'react';
import './sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><a href="namespace">Namespaces</a></li>
        <li><a href="pod">Pods</a></li>
      </ul>
    </div>
  );
}

export default Sidebar;
