import React from 'react';
import { connect } from 'react-redux';

import { namespaceDelete, namespaceDeleteChangeInput } from '../../actions/namespaces';

class NamespaceDelete extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();

    const { namespaceDeleteChangeInput } = this.props;

    namespaceDeleteChangeInput(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();

    const { namespaceDelete, namespaceDeleteInput } = this.props;

    namespaceDelete(namespaceDeleteInput);
  }

  render() {
    const { namespaceDeleteInput } = this.props;

    return (
      <div className='create-namespace'>
        <h2>Delete Namespace</h2>
        <form className='namespace-input-form' onSubmit={this.handleSubmit}>
          <label className='namespace-label' htmlFor='namespace'>
            Delete Namespace:
            <input
              type='text'
              value={namespaceDeleteInput}
              onChange={this.handleChange}
              placeholder='enter namespace'
              id='namespace'
            />
            <button
              className='button'
              type='submit'
              value='submit'
            >
              Delete
            </button>
          </label>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    namespaceDeleteInput: state.namespace.namespaceDeleteInput
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    namespaceDelete: (name) => dispatch(namespaceDelete(name)),
    namespaceDeleteChangeInput: (namespaceDeleteInput) => dispatch(namespaceDeleteChangeInput(namespaceDeleteInput))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NamespaceDelete);
