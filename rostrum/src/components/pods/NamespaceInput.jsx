import React from 'react';
import PropTypes from 'prop-types';

function NamespaceInput(props) {
  const { namespaceInput, handleChange, handleSubmit } = props;

  return (
    <form className="namespace-input-form" onSubmit={handleSubmit}>
      <label className="namespace-label" htmlFor="namespace">
        Namespace:
        <input
          type="text"
          value={namespaceInput}
          onChange={handleChange}
          placeholder="enter namespace"
          id="namespace"
        />
        <button
          className="button"
          type="submit"
          value="submit"
        >
          Submit
        </button>
      </label>
    </form>
  );
}

NamespaceInput.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  namespaceInput: PropTypes.string.isRequired,
};

export default NamespaceInput;
