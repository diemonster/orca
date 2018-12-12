import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  rolebindingCreate,
  rolebindingCreateChangeInput,
} from '../actions/rolebindingActions';


export class RolebindingCreate extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const { dispatchRolebindingCreateChangeInput } = this.props;
    const inputType = event.target.name;
    const inputValue = event.target.value;
    dispatchRolebindingCreateChangeInput(inputType, inputValue);
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      dispatchRolebindingCreate,
      rolebindingCreateRoleInput,
      rolebindingCreateSubjectInput,
      selectedNamespace,
    } = this.props;

    dispatchRolebindingCreate(
      selectedNamespace,
      rolebindingCreateRoleInput,
      rolebindingCreateSubjectInput,
    );
  }

  render() {
    const {
      rolebindingCreateSubjectInput,
      rolebindingCreateRoleInput,
      roleOptions,
    } = this.props;

    const rolebindingOptions = roleOptions.map(option => (
      <option key={option} value={option}>{option}</option>
    ));

    return (
      <div className="create-rolebinding">
        <h2>Create New Rolebinding</h2>
        <form className="rolebinding-input-form" id="rolebinding-create-input-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="subject"
            value={rolebindingCreateSubjectInput}
            onChange={this.handleChange}
            placeholder="user"
            id="rolebinding-create-subject-input"
          />
          <select
            name="role"
            required
            value={rolebindingCreateRoleInput}
            onChange={this.handleChange}
          >
            {rolebindingOptions}
          </select>
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

RolebindingCreate.propTypes = {
  dispatchRolebindingCreate: PropTypes.func.isRequired,
  dispatchRolebindingCreateChangeInput: PropTypes.func.isRequired,
  rolebindingCreateRoleInput: PropTypes.string.isRequired,
  rolebindingCreateSubjectInput: PropTypes.string.isRequired,
  roleOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedNamespace: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  rolebindingCreateRoleInput: state.rolebinding.roleInput,
  rolebindingCreateSubjectInput: state.rolebinding.subjectInput,
  roleOptions: state.rolebinding.roleOptions,
  selectedNamespace: state.namespace.selectedNamespace,
});

const mapDispatchToProps = dispatch => ({
  dispatchRolebindingCreate: (namespace, role, subject) => {
    dispatch(rolebindingCreate(namespace, role, subject));
  },
  dispatchRolebindingCreateChangeInput: (inputType, inputValue) => {
    dispatch(rolebindingCreateChangeInput(inputType, inputValue));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RolebindingCreate);
