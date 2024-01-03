const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const fs = require("fs");

//Generate an RSA key pair
const key = new NodeRSA({b: 512});

//Get the public and private key
//const publicKey = key.exportKey('public');
//const privateKey = key.exportKey('private');

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlS8sZA46MAxi6IDujAF9
pkcv2tpR3NnG6BMejqUXrFxNP8nKqWtXA1oE5LDC/WilohNs08lQlux85Ru9aR81
BvMKKSXM2L5dmLcN9T9UjZcys8avwB8fXpvAR0+XYwnV6lsLgOBOHXX4zku4uI8C
HUrgCrwFKHlCZofNMwEl2it/M12psKN5tG1a5iorh9jt71G6gTNGT5Xo4kUHmDnU
QBelxyRa/hwaGeMNBR41OQrIZvDdTW8q8iO8ia3u3kqwp2j/09JdwANjWHOGJ7d+
C/OpSKy5zV6JoBfKaCt92gZ1zF+ugRX8kHXocAS/lnjVRcgxxduf/3pz3ND/6acb
KwIDAQAB
-----END PUBLIC KEY-----`;

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAlS8sZA46MAxi6IDujAF9pkcv2tpR3NnG6BMejqUXrFxNP8nK
qWtXA1oE5LDC/WilohNs08lQlux85Ru9aR81BvMKKSXM2L5dmLcN9T9UjZcys8av
wB8fXpvAR0+XYwnV6lsLgOBOHXX4zku4uI8CHUrgCrwFKHlCZofNMwEl2it/M12p
sKN5tG1a5iorh9jt71G6gTNGT5Xo4kUHmDnUQBelxyRa/hwaGeMNBR41OQrIZvDd
TW8q8iO8ia3u3kqwp2j/09JdwANjWHOGJ7d+C/OpSKy5zV6JoBfKaCt92gZ1zF+u
gRX8kHXocAS/lnjVRcgxxduf/3pz3ND/6acbKwIDAQABAoIBACET05DfwrESnf+V
Ts8GKZjrocWxsIL6WmrsilLwcf5KfOpO0LudzC43EGywcJuFT2xPSErxEQhVqR+X
dfjP7Y775l3XPsMz+ka5F8Qv5Yx7YMeRnzhG7kqo2Ao3sIZKEP8kbrmFgmxv0tnS
2kM5mitqhaB7rd0afcmEBNBxSbZEpc78HIpGjqF5Sd9XyPsF1/+9gPPeMBz5eUXo
X4tyfgXxMeBkdGxyPl/0Z7SN+5RGdWAC8OEUUN1XXx/mEdP6UW7qyxT+dgxQfnhJ
tCMkSpSMI35jpTaaQQ6pupwecW9Kkd9ASPu39JnG6Agbay7r3snMdouKGAM7LFhY
JHs86/ECgYEA0dPDfL0/o56aLL9xc1GvQ3uIF/8AW3yerSmcPUtGfGSQWeZcTJOF
Wu3eyiXqDPxwmNSkYn0CWhKb+xAXggVXqrPBzX8y4/w2wEdk1T6g8yuh8R/UbPnC
QMaOsG8wGRDhJXdCRqclrrHDUN8DCLbQUs/jXQ2nrKYkaaZ+8ujMo/MCgYEAtgMz
KCJkS8UITv8tIV+1OzkBu/6ce1HsvxshO7ClutM1jepuFkIFh1+xUvCUgUVki/MM
bKY6SjYCrrmkNPbBbDeeEhykfvLGlJI+VsOyNzaq5gI1EDNM8Pme7LvHIWLFNRlV
/S1gVApu1qeMloof0gttRcDgiiGpV8pjFwniUekCgYEAqoHy8YK4HDXeA07u2k8e
pS/VP+qwV6fFKeIOXKC2/o6Z3vQbPP8D9wglaw+0Sik5NnhVvNLo/ljw9+vzrmy4
+LZqXptmt21U8JsTjVX/ZJuoVVEQRh4PhKPVf/pak4Pr8Y4gBVn+fR9nIGiZBpPI
ZgMZN5zJDLtWC6SItMwIv5ECgYA2h0riMTt+/653jDdHEldHQNLmMWdMAsU8k7In
Icrk57XZqGwGuwzQ+7gyMuUqvVFcJBqKyloYNYokMnWhcHOOKjNvFamqZq1bgVyv
vb08kWItumePTO82GnKkVbVYqTCPseFzEg8T3nRKVrPlvce+s7Gu/hPHDkKfjICX
PFzTUQKBgC6X66aqBsb/PWXtuJN83/eG3DE31z2jRzwziUOP5pHx7wPICmU74B7G
tg4XR9BK5Wl5VoibJLMT9kSZP1z/6QZoXUaZPkB93bZMAyWsT/9Ts4jur0QshocG
STbD7rHvqha9+IOh+LQghSt+Fu4B7tG0YSII0SAFLaCHhqjd5DcU
-----END RSA PRIVATE KEY-----`;

//const publicKeyFile = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/public.pem', 'utf-8');
const publicKeyFile = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/public.pem', 'utf-8');
const privateKeyFile = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/private.pem', 'utf-8');


key.importKey(publicKeyFile, 'public');
key.importKey(privateKeyFile, 'private');

console.log("hier public Key von encrypt: " , publicKeyFile);
console.log("hier private Key von decrypt ", privateKeyFile);

//encrypt a message using the public key
const message = 'https://ipfs.moralis.io:2053/ipfs/QmQTTeF1sQfSn9A7gbXapwJkCLvwTEnSMiaws8i1RBW6E9/uploads/d8d93a5d5e11e1dba850b44e4dc7c14a';
const encryptedMessage = key.encrypt(message, 'base64');
console.log('encrypted: ', encryptedMessage);

//decrypt a message using the private key
const decrypted = key.decrypt(encryptedMessage, 'utf-8');
console.log('decrypted: ', decrypted);

console.log("Test beendet");



/*
const text = "Hello RSA";
const encrypted = key.encrypt(text, 'base64');
console.log('encrypted: ', encrypted);
const decrypted = key.decrypt(encrypted, 'utf-8');
console.log('decrypted: ', decrypted);
*/