import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RolebindingListItem from './RolebindingListItem';

export function RolebindingList(props) {
  const { rolebindings, selectedNamespace } = props;

  const rolebindingListItems = rolebindings.map(name => (
    <RolebindingListItem key={name} rolebindingName={name} />
  ));

  return (
    <div className="rolebinding-container">
      <h3>{`${selectedNamespace} rolebindings:`}</h3>
      <ul className="rolebinding-list">{rolebindingListItems}</ul>
    </div>
  );
}

RolebindingList.propTypes = {
  rolebindings: PropTypes.arrayOf(PropTypes.string),
  selectedNamespace: PropTypes.string.isRequired,
};

RolebindingList.defaultProps = {
  rolebindings: [],
};

const mapStateToProps = state => ({
  rolebindings: state.rolebinding.rolebindings,
  selectedNamespace: state.namespace.selectedNamespace,
});

export default connect(mapStateToProps)(RolebindingList);
