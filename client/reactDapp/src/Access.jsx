import React, { useState, useEffect } from 'react';

function Access() {

    const [accessWallet, setAccessWallet] = useState([]);

    //
    const handleWalletInput = () => {
        

    }

    //sending tokens to accessed wallets 
    const sendTokens = () => {

    }


    return (
        <div>
            <input type="text" onChange={handleWalletInput}>Enter public Key</input>
            <button onClick={sendTokens}>send</button>
        </div>

    );
}