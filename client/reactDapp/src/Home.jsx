import React, { useState } from 'react';


import KeyAndLinkManager from './KeyAndLinkManager';

import Uploader from './Uploader';
import Downloader from './Downloader';

import './App.css';


function Home() {

    //useStates for Button oppertunities
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
            {!showKeyRegistry &&  <button onClick={openKeyRegistry}>Keycreater</button>}
            {showKeyRegistry && <KeyAndLinkManager />}
            {!showUploader && <button onClick={openUploader}>Upload</button>}
            {showUploader && <Uploader/>}
            {!showDownloader && <button onClick={openDownloader}>Download</button>}
            {showDownloader && <Downloader/>}
        </div>
    )
}

export default Home;