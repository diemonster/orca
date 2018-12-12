import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RolebindingCreate from './RolebindingCreate';
import RolebindingList from './RolebindingList';

export function Rolebindings(props) {
  const { selectedNamespace } = props;
  if (selectedNamespace !== '') {
    return (
      <div className="rolebinding-container">
        <RolebindingCreate />
        <RolebindingList />
      </div>
    );
  }

  return (
    <div className="rolebinding-container">
      <h2>(No Namespace Selected)</h2>
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
