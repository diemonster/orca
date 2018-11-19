import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { rolebindingList } from '../../actions/rolebindings';

import RolebindingListItem from './RolebindingListItem';

class RolebindingList extends React.Component {
  componentDidMount() {
    const { dispatchRolebindingList, namespace } = this.props;

    dispatchRolebindingList(namespace);
  }

  render() {
    const { namespace, namespacedRolebindings } = this.props;

    let rolebindingNames = [];
    if (Object.prototype.hasOwnProperty.call(namespacedRolebindings, namespace)) {
      rolebindingNames = namespacedRolebindings[namespace];
    }

    let rolebindingListItems = [];
    if (rolebindingNames.length > 0) {
      rolebindingListItems = rolebindingNames.map(name => (
        <RolebindingListItem key={name} rolebindingName={name} />
      ));
    }

    return (
      <div className="rolebinding-container">
        <h5>Role Bindings:</h5>
        <ul className="rolebinding-list">
          {rolebindingListItems}
        </ul>
      </div>
    );
  }
}

RolebindingList.propTypes = {
  dispatchRolebindingList: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  namespacedRolebindings: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.string.isRequired,
    ).isRequired,
  ).isRequired,
};

const mapStateToProps = state => ({
  namespacedRolebindings: state.rolebinding.namespacedRolebindings,
});

const mapDispatchToProps = dispatch => ({
  dispatchRolebindingList: namespace => dispatch(rolebindingList(namespace)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RolebindingList);
