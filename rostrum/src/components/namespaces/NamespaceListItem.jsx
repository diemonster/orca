import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { namespaceDelete, namespaceSelect } from '../../actions/namespaces';

export class NamespaceListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleDelete() {
    const { dispatchNamespaceDelete, namespace } = this.props;
    dispatchNamespaceDelete(namespace);
  }

  handleSelect() {
    const { dispatchNamespaceSelect, namespace } = this.props;
    dispatchNamespaceSelect(namespace);
  }

  render() {
    const { namespace, phase, selectedNamespace } = this.props;
    const phaseClass = (phase === 'Terminating' ? 'phase-terminating' : 'phase-active');
    const selectedClass = (namespace === selectedNamespace ? 'selected' : '');

    return (
      <li className="namespace-list-item">
        <div className="namespace-button-container">
          <button
            type="button"
            className={`namespace-select-button ${phaseClass} ${selectedClass}`}
            onClick={this.handleSelect}
          >
            {namespace}
          </button>
          <button
            type="button"
            className={`namespace-delete-button ${phaseClass} ${selectedClass}`}
            onClick={this.handleDelete}
          >
          X
          </button>
        </div>
      </li>
    );
  }
}

NamespaceListItem.propTypes = {
  dispatchNamespaceDelete: PropTypes.func.isRequired,
  dispatchNamespaceSelect: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  phase: PropTypes.string.isRequired,
  selectedNamespace: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  selectedNamespace: state.namespace.selectedNamespace,
});

const mapDispatchToProps = dispatch => ({
  dispatchNamespaceDelete: namespace => dispatch(namespaceDelete(namespace)),
  dispatchNamespaceSelect: namespace => dispatch(namespaceSelect(namespace)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NamespaceListItem);
