import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { namespaceCreateChangeInput, namespaceCreate } from '../../actions/namespaces';
import K8sClient from '../../k8s/client';

class NamespaceCreate extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();

    const { dispatchNamespaceCreateChangeInput } = this.props;

    dispatchNamespaceCreateChangeInput(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();

    const { client, dispatchNamespaceCreate, namespaceCreateInput} = this.props;

    dispatchNamespaceCreate(namespaceCreateInput, client);
  }

  render() {
    const { namespaceCreateInput } = this.props;

    return (
      <div className="create-namespace">
        <h2>Create Namespace</h2>
        <form className="namespace-input-form" onSubmit={this.handleSubmit}>
          <label className="namespace-label" htmlFor="namespace">
            New Namespace:
            <input
              type="text"
              value={namespaceCreateInput}
              onChange={this.handleChange}
              placeholder="enter namespace"
              id="namespace"
            />
            <button className="button" type="submit" value="submit">
              Create
            </button>
          </label>
        </form>
      </div>
    );
  }
}

NamespaceCreate.propTypes = {
  client: PropTypes.instanceOf(K8sClient).isRequired,
  dispatchNamespaceCreate: PropTypes.func.isRequired,
  dispatchNamespaceCreateChangeInput: PropTypes.func.isRequired,
  namespaceCreateInput: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  namespaceCreateInput: state.namespace.namespaceCreateInput,
});

const mapDispatchToProps = dispatch => ({
  dispatchNamespaceCreateChangeInput: namespaceCreateInput => (
    dispatch(namespaceCreateChangeInput(namespaceCreateInput))
  ),
  dispatchNamespaceCreate: (name, client) => dispatch(namespaceCreate(name, client)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NamespaceCreate);
