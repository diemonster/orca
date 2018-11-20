/* eslint react/jsx-filename-extension: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import '../node_modules/toastr/build/toastr.min.css';

import Root from './components/Root';

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
);

registerServiceWorker();
