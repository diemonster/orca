import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { namespaceDelete, namespaceDeleteChangeInput } from '../../actions/namespaces';
import K8sClient from '../../k8s/client';

class NamespaceDelete extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();

    const { dispatchNamespaceDeleteChangeInput } = this.props;

    dispatchNamespaceDeleteChangeInput(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();

    const { client, dispatchNamespaceDelete, namespaceDeleteInput} = this.props;

    dispatchNamespaceDelete(namespaceDeleteInput, client);
  }

  render() {
    const { namespaceDeleteInput } = this.props;

    return (
      <div className="create-namespace">
        <h2>Delete Namespace</h2>
        <form className="namespace-input-form" onSubmit={this.handleSubmit}>
          <label className="namespace-label" htmlFor="namespace">
            Delete Namespace:
            <input
              type="text"
              value={namespaceDeleteInput}
              onChange={this.handleChange}
              placeholder="enter namespace"
              id="namespace"
            />
            <button
              className="button"
              type="submit"
              value="submit"
            >
              Delete
            </button>
          </label>
        </form>
      </div>
    );
  }
}

NamespaceDelete.propTypes = {
  client: PropTypes.instanceOf(K8sClient).isRequired,
  dispatchNamespaceDelete: PropTypes.func.isRequired,
  dispatchNamespaceDeleteChangeInput: PropTypes.func.isRequired,
  namespaceDeleteInput: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  namespaceDeleteInput: state.namespace.namespaceDeleteInput,
});

const mapDispatchToProps = dispatch => ({
  dispatchNamespaceDelete: (name, client) => dispatch(namespaceDelete(name, client)),
  dispatchNamespaceDeleteChangeInput: namespaceDeleteInput => (
    dispatch(namespaceDeleteChangeInput(namespaceDeleteInput))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(NamespaceDelete);
