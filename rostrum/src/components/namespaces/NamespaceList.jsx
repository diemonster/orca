import React from 'react';
import { connect } from 'react-redux';

import { namespaceList } from '../../actions/namespaces';

import NamespaceListItem from './NamespaceListItem';

const apiPollInterval = 2000; // milliseconds

class NamespaceList extends React.Component {
  componentDidMount() {
    const { namespaceList } = this.props;

    namespaceList();
    this.timer = setInterval(() => namespaceList(), apiPollInterval);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    const { namespaceObjects } = this.props;

    if (!namespaceObjects) {
      return (
        <div className='namespace-list-container'>
          <h2>List Namespaces</h2>
          <p>Loading namespaces...</p>
        </div>
      );
    };

    const namespaceListItems = namespaceObjects.map((namespace, idx) =>
      <NamespaceListItem key={idx} namespace={namespace.metadata.name} phase={namespace.status.phase} />
    );

    return (
      <div className='namespace-list-container'>
        <h2>List Namespaces</h2>
        <ul className='namespace-list'>
          {namespaceListItems}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    namespaceObjects: state.namespace.namespaceObjects
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    namespaceList: () => dispatch(namespaceList())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NamespaceList);
