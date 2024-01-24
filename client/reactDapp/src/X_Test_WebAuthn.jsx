import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WebAuthnComponent = () => {
    const [webAuthnChallenge, setWebAuthnChallenge] = useState(null);
  
    useEffect(() => {
      const register = async () => {
        try {
          const response = await axios.post('http://localhost:3000/webauthn/register');
          setWebAuthnChallenge(response.data.challenge);
        } catch (error) {
          console.error('WebAuthn registration error:', error);
        }
      };
  
      register();
    }, []);

    const handleLogin = async () => {
        try {
          const response = await axios.post('http://localhost:3000/webauthn/login');
          setWebAuthnChallenge(response.data.challenge);
          // Handle the WebAuthn response on the client side
          // (use navigator.credentials API)
        } catch (error) {
          console.error('WebAuthn login error:', error);
        }
      };

      // React component or frontend code
const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/webauthn/register', { userId: 'user123' }); // Replace with the actual user ID
      const credential = await navigator.credentials.create(response.data);
      // Send the credential data to the server for attestation
      const attestationResponse = await axios.post('/webauthn/register/attestation', { credential });
      console.log('Registration successful:', attestationResponse.data);
    } catch (error) {
      console.error('WebAuthn registration error:', error);
    }
  };
  

// Render your component with a button to trigger login
  return (
    <div>
      <button onClick={handleLogin}>Login with WebAuthn</button>
    </div>
  );
};

export default WebAuthnComponent;