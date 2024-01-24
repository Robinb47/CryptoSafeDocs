import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import logo from './assets/react.svg';
import logo from './assets/logo.jpeg';
import './App.css';
import { Routes, Route } from "react-router-dom";

import Login from './Login';
import Dashboard from './Dashboard.jsx';

import Home from './Home';



function App() {
  const [count, setCount] = useState(0)

  const handleLogoClick = () => {
    <Home/>
  }

  return (
    <>
      <div>
        <a target="_blank" onClick={handleLogoClick}>
          <img src={logo} className="logo react" alt="React logo" style={{ width: '200px', height: '200px' }} />
        </a>
      </div>
      <div className="login">
        <Routes>
          <Route path ="/" element={<Login/>}></Route>
          <Route path ="/dapp" element={<Dashboard/>}></Route>
        </Routes>      

      </div>
      <p className="read-the-docs">
        2023 CryptoSafeDoc's | Entwickelt von Robin Bayval
      </p>
    </>
  )
}

export default App;
