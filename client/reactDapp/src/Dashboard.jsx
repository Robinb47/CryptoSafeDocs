import React, { useState } from "react";
import { useCurrentUser } from "./hooks/useCurrentUser";
import WalletAuth from "./WalletAuth";
import PdfUpload from './PdfUpload';
import PdfUpload2 from "./PdfUpload2";
import AccessList from "./AccessList";
import PdfWithListUpload from "./PdfWithListUpload";

import Home from './Home';
import CreateKey from "./CreateKey";

//Tester für Smart Contract Anbindung
import ScIntegration from "./SCIntegration";
import KeyRegistry from "./KeyRegistry";

//import ReactDOM from "react-dom";
//import PdfUpload from "./PdfUpload";
/*
function Dashboard() {
  const { isLoading, isAuthorized, username } = useCurrentUser();
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  if (isLoading) {
    return null;
  }


  const authorizedBody = (
    <>
      You successfully signed in with Passage.
      <br />
      <br />
      Your email is: <b>{username}</b>
    </>
  );

  const unauthorizedBody = (
    <>
      You have not logged in and cannot view the dashboard.
      <br />
      <br />
      <a>Login to continue.</a>
    </>
  );

  const closeUploader = () => {
    setIsUploaderOpen(false);
  };

  const openHasher = () => {
    setIsUploaderOpen(true);
  };

  if (isAuthorized) {
    return (
      <div id="actionArea">
        <button onClick={openHasher}>Upload</button>
        <button>Download</button>
        {isUploaderOpen && <PdfUpload />}{" "}
        {/* Hier wird die PdfUpload-Komponente gerendert HIER MUSS KOMMENTAR ENDEN} 
        <br></br>
        {isUploaderOpen && (
          <button onClick={closeUploader}>Close Uploader</button>
        )}
      </div>
    );
  } else {
    return (
      <>
        <p>Falscher Account bro</p>
      </>
    );
  }
}

export default Dashboard;
*/

function Dashboard() {
    const {isLoading, isAuthorized, username} = useCurrentUser();

    if (isLoading) {
        return null;
    } 

    const authorizedBody = 
    <>
        You successfully signed in with Passage.
        <Home />
    </>

    /* war vorher so 
       const authorizedBody = 
    <>
        You successfully signed in with Passage.
        <Home />
        <PdfWithListUpload/> 
        <WalletAuth/>     
    </>
    
    */ 

    const unauthorizedBody = 
    <>
        You have not logged in and cannot view the dashboard.
        <br></br>
    </>

    /*
    const {isLoading, isAuthorized, username} = useCurrentUser();

    if (isLoading) {
        return null;
    }
    const authorizedBody = 
    <>
        You successfully signed in with Passage.
        <br></br>
        Your email is: <b>{username}</b>
    </>

    const unauthorizedBody = 
    <>
        You have not logged in and cannot view the dashboard.
        <br></br>
    </>
    */
    return (
        <>
        <div>
            {isAuthorized ? 'Welcome' : 'Unauthorized'}
        </div>
        <div>
            { isAuthorized ? authorizedBody : unauthorizedBody }
        </div>
        </>
    )
}

export default Dashboard;