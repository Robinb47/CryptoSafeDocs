import React, { useState } from 'react';

// Imports components for key management, uploading, and downloading
import KeyAndLinkManager from './KeyAndLinkManager';
import Uploader from './Uploader';
import Downloader from './Downloader';

// Import of the main stylesheet file
import './App.css';

/**
 * Serves as the starting menu of the dApp, offering users the choice between key creation, uploading, and downloading.
 * Based on the user's selection, the corresponding components (KeyAndLinkManager, Uploader, Downloader) are displayed.
 */
function Home() {
     // State hooks to control the display of the different components
    const [showKeyRegistry, setShowKeyRegistry] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const [showDownloader, setShowDownloader] = useState(false);

    // Function to open the key management area, hiding other component displays.
    const openKeyRegistry = () => {
        setShowDownloader(false);
        setShowUploader(false);
        setShowKeyRegistry(true);
    }
    
    // Function to open the upload area, hiding other component displays.
    const openUploader = () => {
        setShowKeyRegistry(false);
        setShowDownloader(false);
        setShowUploader(true);
    }

    // Function to open the download area, hiding other component displays.
    const openDownloader = () => {
        setShowKeyRegistry(false);
        setShowUploader(false);
        setShowDownloader(true);
    }
    

    return (
        <div>
            <br/>
            {/* Conditionally rendering components based on state */}
            {showKeyRegistry && <KeyAndLinkManager />}
            {showUploader && <Uploader/>}
            {showDownloader && <Downloader/>}
            {/* Navigation buttons: Displayed when their corresponding component is not rendered */}
            {!showKeyRegistry &&  <button onClick={openKeyRegistry}>KeyGenerator</button>}
            {!showUploader && <button onClick={openUploader}>Upload</button>}
            {!showDownloader && <button onClick={openDownloader}>Download</button>}
        </div>
    )
}

export default Home;