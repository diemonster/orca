import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RolebindingList from './RolebindingList';

export function Rolebindings(props) {
  const { selectedNamespace } = props;
  if (selectedNamespace !== '') {
    return (
      <RolebindingList />
    );
  }

  return (
    <div className="rolebinding-container">
      <h3>no namespace selected</h3>
    </div>
  );
}

Rolebindings.propTypes = {
  selectedNamespace: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  selectedNamespace: state.namespace.selectedNamespace,
});

export default connect(mapStateToProps)(Rolebindings);
