import React from 'react';

import NamespaceList from './NamespaceList';
import NamespaceCreate from './NamespaceCreate';

function Namespaces() {
  return (
    <div className="sidebar">
      <h2>Namespaces</h2>
      <NamespaceCreate />
      <NamespaceList />
    </div>
  );
}

export default Namespaces;
