// Import React hook for state management and assets including logos
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import logo from './assets/logo.jpeg';
// Import application stylesheet
import './App.css';
// Import React Router components for navigation
import { Routes, Route } from "react-router-dom";

// Import components for the application
import Login from './Login';
import Dashboard from './Dashboard.jsx';
import Home from './Home';


/**
 * App component serving as the root of the application.
 * It manages application routes and global state.
 */
function App() {
  // State for managing a counter, not utilized in the provided snippet.
  const [count, setCount] = useState(0)

  // Handler for logo click event to navigate to Home component
  const handleLogoClick = () => {
    <Home/>
  }

  return (
    <>
      <div>
        <a target="_blank" onClick={handleLogoClick}>
          {/* Application logo with inline styling */}
          <img src={logo} className="logo react" alt="React logo" style={{ width: '200px', height: '200px' }} />
        </a>
      </div>
         {/* Container for application routes */}
      <div className="login">
        <Routes>
          {/* Route configuration for Login and Dashboard components */}
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
