import React from 'react';

import PodListItem from './PodListItem';

function PodList(props) {
  const {
    podObjects,
  } = props;

  const podListItems = podObjects.map((pod, idx) =>
    <PodListItem key={idx} value={pod.metadata.name} />
  );

  return (
    <ul className='podlist'>
      {podListItems}
    </ul>
  );
}

export default PodList;
