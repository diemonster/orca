import React from 'react';
import PropTypes from 'prop-types';

function PodListItem(props) {
  const { podName } = props;

  return <li>{podName}</li>;
}

PodListItem.propTypes = {
  podName: PropTypes.string.isRequired,
};

export default PodListItem;
