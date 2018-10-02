import React from 'react';

import RolebindingList from '../rolebindings/RolebindingList';

function NamespaceListItem(props) {
  const { namespace, phase } = props;

  var cls = null;
  switch(phase) {
    case "Terminating":
      cls="phase-terminating";
      break;
    default:
      cls="phase-active";
  }

  return (
    <li className={`namespace-list-item ${cls}`}>
      <h4>{namespace}</h4>
      <RolebindingList namespace={namespace} />
    </li>
  );
}

export default NamespaceListItem;
