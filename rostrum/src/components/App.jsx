import React from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';

import Sidebar from './sidebar/Sidebar';
import Namespace from './namespaces/Namespace';
import Pod from './pods/Pod';

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Orca: the Kubernetes permissions manager</h1>
        <div className="kube-container">
          <Sidebar />
          <Switch>
            <Route exact path="/namespace/" component={Namespace} />
            <Route exact path="/pod/" component={Pod} />
            { /* default behavior: reroute to "/" */ }
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
