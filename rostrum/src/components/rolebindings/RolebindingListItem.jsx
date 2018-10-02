import React from 'react';

function RolebindingListItem(props) {
  const {
    rolebinding,
  } = props;

  return (
    <li className={`rolebinding-list-item`}>
      {rolebinding}
    </li>
  );
}

export default RolebindingListItem;
