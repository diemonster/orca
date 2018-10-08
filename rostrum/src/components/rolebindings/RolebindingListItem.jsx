import React from 'react';
import PropTypes from 'prop-types';

function RolebindingListItem(props) {
  const {
    rolebindingName,
  } = props;

  return (
    <li className="rolebinding-list-item">
      {rolebindingName}
    </li>
  );
}

RolebindingListItem.propTypes = {
  rolebindingName: PropTypes.string.isRequired,
};

export default RolebindingListItem;
