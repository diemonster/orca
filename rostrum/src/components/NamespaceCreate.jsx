import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { namespaceCreateChangeInput, namespaceCreate } from '../actions/namespaceActions';

export class NamespaceCreate extends React.Component {
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

    const { dispatchNamespaceCreate, namespaceCreateInput, username } = this.props;

    dispatchNamespaceCreate(namespaceCreateInput, username);
  }

  render() {
    const { namespaceCreateInput } = this.props;

    return (
      <div className="create-namespace">
        <form className="namespace-input-form" id="namespace-create-input-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={namespaceCreateInput}
            onChange={this.handleChange}
            placeholder="new namespace"
            name="namespace-create-input"
            id="namespace-create-input"
          />
          <button
            className="button"
            type="submit"
            value="submit"
          >
            Create
          </button>
        </form>
      </div>
    );
  }
}

NamespaceCreate.propTypes = {
  dispatchNamespaceCreate: PropTypes.func.isRequired,
  dispatchNamespaceCreateChangeInput: PropTypes.func.isRequired,
  namespaceCreateInput: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  namespaceCreateInput: state.namespace.namespaceCreateInput,
  username: state.auth.username,
});

const mapDispatchToProps = dispatch => ({
  dispatchNamespaceCreateChangeInput: namespaceCreateInput => (
    dispatch(namespaceCreateChangeInput(namespaceCreateInput))
  ),
  dispatchNamespaceCreate: (namespace, username) => dispatch(namespaceCreate(namespace, username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NamespaceCreate);