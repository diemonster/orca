import React from 'react';

function NamespaceInput(props) {
  const {
    namespaceInput,
    handleChange,
    handleSubmit,
  } = props;

  return (
    <form className='namespace-input-form' onSubmit={handleSubmit}>
      <label className='namespace-label' htmlFor='namespace'>
        Namespace:
        <input
          type='text'
          value={namespaceInput}
          onChange={handleChange}
          placeholder='enter namespace'
          id='namespace'
        />
        <button
          className='button'
          type='submit'
          value='submit'
        >
          Submit
        </button>
      </label>
    </form>
  );
}

export default NamespaceInput;
