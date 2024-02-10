// Import the necessary modules from React and ReactDOM for UI rendering
import React from 'react'
import ReactDOM from 'react-dom/client'
// Import the main App component
import App from './App.jsx'
// Import the main stylesheet for the application
import './index.css'

// Import BrowserRouter from react-router-dom for client-side routing
import { BrowserRouter as Router } from "react-router-dom";

// Find the 'root' DOM element and attach the React app to it, wrapping the App component with <Router> for routing support
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)
 