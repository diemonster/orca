import React from 'react';
import PropTypes from 'prop-types';

import K8sClient from '../../k8s/client';

import RolebindingList from '../rolebindings/RolebindingList';

function NamespaceListItem(props) {
  const { client, namespace, phase } = props;

  let cls = null;
  switch (phase) {
    case 'Terminating':
      cls = 'phase-terminating';
      break;
    default:
      cls = 'phase-active';
  }

  return (
    <li className={`namespace-list-item ${cls}`}>
      <h4>{namespace}</h4>
      <RolebindingList client={client} namespace={namespace} />
    </li>
  );
}

NamespaceListItem.propTypes = {
  client: PropTypes.instanceOf(K8sClient).isRequired,
  namespace: PropTypes.string.isRequired,
  phase: PropTypes.string.isRequired,
};

export default NamespaceListItem;
