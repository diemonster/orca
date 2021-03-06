import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { namespaceDelete, namespaceDeleteChangeInput } from '../../actions/namespaces';

export class NamespaceDelete extends React.Component {
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

    const { dispatchNamespaceDelete, namespaceDeleteInput } = this.props;

    dispatchNamespaceDelete(namespaceDeleteInput);
  }

  render() {
    const { namespaceDeleteInput } = this.props;

    return (
      <div className="delete-namespace">
        <h2>Delete Namespace</h2>
        <form className="namespace-input-form" id="namespace-delete-input-form" onSubmit={this.handleSubmit}>
          <label className="namespace-input-label" htmlFor="namespace-delete-input">
            Delete Namespace:
          </label>
          <input
            type="text"
            value={namespaceDeleteInput}
            onChange={this.handleChange}
            placeholder="enter namespace"
            name="namespace-delete-input"
            id="namespace-delete-input"
          />
          <button
            className="button"
            type="submit"
            value="submit"
          >
            Delete
          </button>
        </form>
      </div>
    );
  }
}

NamespaceDelete.propTypes = {
  dispatchNamespaceDelete: PropTypes.func.isRequired,
  dispatchNamespaceDeleteChangeInput: PropTypes.func.isRequired,
  namespaceDeleteInput: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  namespaceDeleteInput: state.namespace.namespaceDeleteInput,
});

const mapDispatchToProps = dispatch => ({
  dispatchNamespaceDelete: name => dispatch(namespaceDelete(name)),
  dispatchNamespaceDeleteChangeInput: namespaceDeleteInput => (
    dispatch(namespaceDeleteChangeInput(namespaceDeleteInput))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(NamespaceDelete);
