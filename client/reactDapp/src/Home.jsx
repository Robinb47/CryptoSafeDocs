import React, { useState } from 'react';

//AB HIER NEUER VERSUCH FÜR NEUE SMART CONTRACT
//import KeyManager from './KeyManager';
import KeyAndLinkManager from './KeyAndLinkManager';

import Uploader from './Uploader';
import Downloader from './Downloader';


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
            {!showKeyRegistry &&  <button onClick={openKeyRegistry}>Create Key</button>}
            {showKeyRegistry && <KeyAndLinkManager />}
            <br/>
            <br/>
            {!showUploader && <button onClick={openUploader}>open Uploader</button>}
            {showUploader && <Uploader/>}
            {!showDownloader && <button onClick={openDownloader}>open Downloader</button>}
            {showDownloader && <Downloader/>}
        </div>
    )
}

export default Home;