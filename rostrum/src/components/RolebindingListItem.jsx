import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { rolebindingDelete } from '../actions/rolebindingActions';


export class RolebindingListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    const {
      dispatchRolebindingDelete,
      rolebindingName,
      selectedNamespace,
    } = this.props;
    dispatchRolebindingDelete(selectedNamespace, rolebindingName);
  }

  render() {
    const {
      rolebindingName,
    } = this.props;

    return (
      <li className="rolebinding-list-item">
        {rolebindingName}
        <button
          type="button"
          className="rolebinding-delete-button"
          onClick={this.handleDelete}
        >
        X
        </button>
      </li>
    );
  }
}

RolebindingListItem.propTypes = {
  dispatchRolebindingDelete: PropTypes.func.isRequired,
  rolebindingName: PropTypes.string.isRequired,
  selectedNamespace: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  selectedNamespace: state.namespace.selectedNamespace,
});

const mapDispatchToProps = dispatch => ({
  dispatchRolebindingDelete: (namespace, rolebinding) => {
    dispatch(rolebindingDelete(namespace, rolebinding));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RolebindingListItem);
