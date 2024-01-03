import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import logo from './assets/react.svg';
import './App.css'
import { Routes, Route } from "react-router-dom";

import Login from './Login';
import Dashboard from './Dashboard.jsx';


import WalletAuth from './WalletAuth';


/* Test Area
//import Ipfs from './Ipfs.jsx';
*/
//import Ipfs from './Ipfs.js';
//import IpfsUpload from './IpfsUpload.cjs';

//import IpfsGpt from './IpfsGpt';
//import Moralis from 'moralis';




//import KeySafer from './KeySafer';
//import UploadWithKey from './UploadWithKey';

import Decrypter from './Decrypter';

//neuer Versuch
//import WebAuthnComponent from './WebAuthn';
//war nicht erfolgreich

//neuster Versuch für WebAuthn Login

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <p></p>
        <a href="https://react.dev" target="_blank">
          <img src={logo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Crypto Documents</h1>
      <div className="login">
        <Routes>
          <Route path ="/" element={<Login/>}></Route>
          <Route path ="/dapp" element={<Dashboard/>}></Route>
        </Routes>      
  
      </div>
      <p className="read-the-docs">
        2023 CryptoDocuments | Entwickelt von Robin
      </p>
    </>
  )
}

export default App;
