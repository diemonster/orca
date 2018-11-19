import React from 'react';
import PropTypes from 'prop-types';

import RolebindingList from '../rolebindings/RolebindingList';

function NamespaceListItem(props) {
  const { namespace, phase } = props;

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
      <RolebindingList namespace={namespace} />
    </li>
  );
}

NamespaceListItem.propTypes = {
  namespace: PropTypes.string.isRequired,
  phase: PropTypes.string.isRequired,
};

export default NamespaceListItem;
