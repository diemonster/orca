import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { namespaceList } from '../../actions/namespaces';
import K8sClient from '../../k8s/client';

import NamespaceListItem from './NamespaceListItem';

class NamespaceList extends React.Component {
  componentDidMount() {
    const { client, dispatchNamespaceList } = this.props;

    dispatchNamespaceList(client);
  }

  render() {
    const { client, namespaceObjects } = this.props;

    if (!namespaceObjects) {
      return (
        <div className="namespace-list-container">
          <h2>List Namespaces</h2>
          <p>Loading namespaces...</p>
        </div>
      );
    }

    const namespaceListItems = namespaceObjects.map(namespace => (
      <NamespaceListItem
        client={client}
        key={namespace.name}
        namespace={namespace.name}
        phase={namespace.status}
      />
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
  client: PropTypes.instanceOf(K8sClient).isRequired,
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
  dispatchNamespaceList: client => dispatch(namespaceList(client)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NamespaceList);
