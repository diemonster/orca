import React from 'react';

import NamespaceList from './NamespaceList';
import NamespaceCreate from './NamespaceCreate';
import NamespaceDelete from './NamespaceDelete';

function Namespace() {
  return (
    <div className='kube-display'>
      <NamespaceList />
      <NamespaceCreate />
      <NamespaceDelete />
    </div>
  );
}

export default Namespace;
