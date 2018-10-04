import React from 'react';

function Profile(props) {
  return (
    <h3 id="profile">
    Welcome, {props.name}
    </h3>
  );
}

export default Profile;
