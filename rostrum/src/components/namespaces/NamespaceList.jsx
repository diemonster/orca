import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { namespaceList } from '../../actions/namespaces';

import NamespaceListItem from './NamespaceListItem';

class NamespaceList extends React.Component {
  componentDidMount() {
    const { dispatchNamespaceList } = this.props;

    dispatchNamespaceList();
  }

  render() {
    const { namespaceObjects } = this.props;

    if (!namespaceObjects) {
      return (
        <div className="namespace-list-container">
          <h2>List Namespaces</h2>
          <p>Loading namespaces...</p>
        </div>
      );
    }

    const namespaceListItems = namespaceObjects.map(namespace => (
      <NamespaceListItem key={namespace.name} namespace={namespace.name} phase={namespace.status} />
    ));

    return (
      <div className="namespace-list-container">
        <h2>List Namespaces</h2>
        <ul className="namespace-list">
          {namespaceListItems}
        </ul>
      </div>
    );
  }
}

NamespaceList.propTypes = {
  dispatchNamespaceList: PropTypes.func.isRequired,
  namespaceObjects: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const mapStateToProps = state => ({
  namespaceObjects: state.namespace.namespaceObjects,
});

const mapDispatchToProps = dispatch => ({
  dispatchNamespaceList: () => dispatch(namespaceList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NamespaceList);
