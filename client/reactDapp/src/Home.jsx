import React, { useState } from 'react';

import KeyRegistry from './KeyRegistry';
//import PdfWithListUpload from './PdfWithListUpload';

import PdfWithRecipient from './PdfWithRecipient';


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
            {showKeyRegistry && <KeyRegistry />}
            {!showUploader && <button onClick={openUploader}>Open Uploader</button>}
            {showUploader && <PdfWithRecipient/>}
            <button>Download File</button>
        </div>
    )
}

export default Home;