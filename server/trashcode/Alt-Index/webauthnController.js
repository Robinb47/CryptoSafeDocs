// webauthnController.js
const fido2 = require('fido2-lib');
console.log('fido2-lib version: ', fido2.version);

// Dummy storage for registered users
const registeredUsers = {};

const registerWebAuthn = async (req, res) => {
  const userId = req.body.userId; // Replace with the actual user ID from your authentication system

  try {
    // Generate WebAuthn registration options
    const publicKeyOptions = await fido2.generateAttestationOptions({
      rpName: 'Your App',
      rpID: 'example.com',
      userID: userId,
      userName: 'user@example.com',
      timeout: 60000,
    });

    // Save the challenge for later verification
    registeredUsers[userId] = {
      challenge: publicKeyOptions.challenge,
    };

    res.json(publicKeyOptions);
  } catch (error) {
    console.error('WebAuthn registration error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// webauthnController.js
const registerWebAuthnAttestation = async (req, res) => {
    const userId = req.body.userId; // Replace with the actual user ID from your authentication system
    const attestation = req.body.credential;
  
    try {
      // Verify the attestation against the stored challenge
      const verification = await fido2.verifyAttestation({
        credential: attestation,
        expectedChallenge: registeredUsers[userId].challenge,
      });
  
      if (verification.verified) {
        // Save the public key credential for future authentication
        registeredUsers[userId].credential = attestation;
  
        res.json({ success: true, message: 'Registration successful' });
      } else {
        res.status(400).json({ success: false, message: 'Attestation verification failed' });
      }
    } catch (error) {
      console.error('WebAuthn attestation error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  module.exports = {
    registerWebAuthn,
    registerWebAuthnAttestation,
  };
  
