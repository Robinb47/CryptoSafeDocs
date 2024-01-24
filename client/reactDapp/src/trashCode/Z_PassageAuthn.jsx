import React, { useState } from 'react';
//import Passage from '@passageidentity/passage-node';

const PassageAuthn = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthenticate = async () => {
    try {
      const response = await fetch('http://localhost:3000/authenticatedRoute', {
        method: 'GET',
        credentials: 'include', // include cookies in the request
      });

      if (response.ok) {
        // Authentication successful
        setAuthenticated(true);
      } else {
        // Handle authentication error
        console.error('Authentication failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  return (
    <div>
      {authenticated ? (
        <p>You are authenticated!</p>
      ) : (
        <button onClick={handleAuthenticate}>Authenticate</button>
      )}
    </div>
  );
};

export default PassageAuthn;
