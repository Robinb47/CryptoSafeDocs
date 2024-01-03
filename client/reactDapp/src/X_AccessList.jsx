import React, { useState, useEffect } from 'react';

function AccessList() {

    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState([]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
          // Neues Element zur Liste hinzufügen
          setItems([...items, inputValue.trim()]);
          // Eingabefeld leeren
          setInputValue('');
        }
      };

        
    return (
        <div>
        <h3>Wallets with Access</h3>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="enter public key"
        />
        <button onClick="">send list</button>
      </div>
    );
}

export default AccessList;