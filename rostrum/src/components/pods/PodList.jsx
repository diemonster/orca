import React from 'react';
import PropTypes from 'prop-types';

import PodListItem from './PodListItem';

function PodList(props) {
  const { podNames } = props;

  const podListItems = podNames.map(name => (
    <PodListItem key={name} podName={name} />
  ));

  return (
    <ul className="podlist">
      {podListItems}
    </ul>
  );
}

PodList.propTypes = {
  podNames: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
};

export default PodList;
