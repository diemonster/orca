import React from 'react';

function KubeNav() {
  return (
    <div className='kube-nav'>
      <h2>KubeNav</h2>
      <ul>
        <li><a href='/'>Home</a></li>
        <li><a href='namespace'>Namespaces</a></li>
        <li><a href='pod'>Pods</a></li>
      </ul>
    </div>
  )
}

export default KubeNav;
