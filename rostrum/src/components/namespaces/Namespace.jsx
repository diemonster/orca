import React from 'react';
import PropTypes from 'prop-types';

import K8sClient from '../../k8s/client';

import NamespaceList from './NamespaceList';
import NamespaceCreate from './NamespaceCreate';
import NamespaceDelete from './NamespaceDelete';

function Namespace(props) {
  const { client } = props;
  return (
    <div className="kube-display">
      <NamespaceList client={client} />
      <NamespaceCreate client={client} />
      <NamespaceDelete client={client} />
    </div>
  );
}

Namespace.propTypes = {
  client: PropTypes.instanceOf(K8sClient).isRequired,
};

export default Namespace;
