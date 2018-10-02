import React from 'react';
import { connect } from 'react-redux';

import { rolebindingList } from '../../actions/rolebindings';

import RolebindingListItem from './RolebindingListItem';

class RolebindingList extends React.Component {
  componentDidMount() {
    const { rolebindingList, namespace } = this.props;
    rolebindingList(namespace);
  }

  render() {
    // namespace is passed in already from the parent function
    // rolebindingObjects is populated through rolebindingList()
    const { namespace, rolebindingObjects } = this.props;

    var namespacedRolebindings = null;
    if (rolebindingObjects) {
      namespacedRolebindings = rolebindingObjects[namespace];
    }

    var rolebindingListItems = null;
    if (namespacedRolebindings) {
      rolebindingListItems = namespacedRolebindings.map((rolebinding, idx) =>
        <RolebindingListItem key={idx} rolebinding={rolebinding.metadata.name} />
      );
    }

    return (
      <div className='rolebinding-container'>
        <h5>Role Bindings:</h5>
        <ul className='rolebinding-list'>
          {rolebindingListItems}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rolebindingObjects: state.rolebinding.rolebindingObjects
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    rolebindingList: (namespace) => dispatch(rolebindingList(namespace))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RolebindingList);
