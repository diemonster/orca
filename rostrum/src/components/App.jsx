import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Namespaces from './namespaces/Namespaces';
import Rolebindings from './rolebindings/Rolebindings';

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Orca: the Kubernetes permissions manager</h1>
        <div className="kube-container">
          <Namespaces />
          <Rolebindings />
        </div>
      </div>
    </Router>
  );
}

export default App;
