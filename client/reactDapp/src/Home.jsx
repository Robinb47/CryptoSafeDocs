import React, { useState } from 'react';


import KeyAndLinkManager from './KeyAndLinkManager';

import Uploader from './Uploader';
import Downloader from './Downloader';

import './App.css';

/**
 * This component is the start menue from this dApp.
 * At the beginning it shows all menue options: KeyGenerator, Downloader, Uploader
 * Then it shows the two other options.
 */
function Home() {

    const [showKeyRegistry, setShowKeyRegistry] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const [showDownloader, setShowDownloader] = useState(false);

    const openKeyRegistry = () => {
        setShowDownloader(false);
        setShowUploader(false);
        setShowKeyRegistry(true);
    }
    
    const openUploader = () => {
        setShowKeyRegistry(false);
        setShowDownloader(false);
        setShowUploader(true);
    }

    const openDownloader = () => {
        setShowKeyRegistry(false);
        setShowUploader(false);
        setShowDownloader(true);
    }
    

    return (
        <div>
            <br/>
            {showKeyRegistry && <KeyAndLinkManager />}
            {showUploader && <Uploader/>}
            {showDownloader && <Downloader/>}
            {!showKeyRegistry &&  <button onClick={openKeyRegistry}>Keycreater</button>}
            {!showUploader && <button onClick={openUploader}>Upload</button>}
            {!showDownloader && <button onClick={openDownloader}>Download</button>}
        </div>
    )
}

export default Home;