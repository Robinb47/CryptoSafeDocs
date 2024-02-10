import React, { useState } from "react";
import { useCurrentUser } from "./hooks/useCurrentUser";
import './App.css'

import Home from './Home';


// Dashboard component to display user-specific information based on their authentication status.
function Dashboard() {
    // Custom hook to check current user's loading state, authorization status, and username.
    const {isLoading, isAuthorized, username} = useCurrentUser();

    // Return nothing if data is still loading to prevent flashing of unauthorized content.
    if (isLoading) {
        return null;
    } 

    // Content displayed to authorized users
    const authorizedBody = 
    <> 
    <br/>
    You successfully  authorized with your biometric identification. <br/>
    Before you send data, you have to authorize with your connected MetaMask Account.
        <Home />
    </>

    // Content displayed to users who are not logged in
    const unauthorizedBody = 
    <>
        You have not logged in and cannot view the dashboard. <br/>
    </>

    /* 
      Render either the welcome message and authorized content
      or a message indicating the user is unauthorized based
      on their authorization status. 
    */
    return (
        <>
        <div>
          {/* Display 'Welcome' for authorized users or 'Unauthorized' for others. */}
            {isAuthorized ? 'Welcome' : 'Unauthorized'}
        </div>
        <div>
          {/* Conditionally render content based on user's authorization status. */}
            { isAuthorized ? authorizedBody : unauthorizedBody }
        </div>
        </>
    )
}

export default Dashboard;