//alte App.jsx die funktioniert
//Versuchter Datenempfang scheitert


import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import logo from './assets/logo-frontpage.png';
import './App.css'
import { Routes, Route } from "react-router-dom";

//import Login from './Login'
//import Dashboard from './Dashboard'

//import PdfUpload from './PdfUpload';


const App = () => {



  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null); // Neuer Zustand für den IPFS-Hash

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('pdf', file);

      try {
        const response = await fetch('http://localhost:5050/upload', {
          method: 'Post',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('HTTP-Fehler! Status: ${response.status}');
        }

        const responseData = await response.json();
        console.log('Antwort an Server:', responseData);

        setResponseData(responseData);



      } catch (error) {
        console.error('Fehler beim Hochladen der Datei:', error)
      }
    }
  };
      /* geht nicht
      const data = response.json();

      setIpfsHash("Hallo");

      //setIpfsHash(data.ipfsLink);
      setIpfsHash("Hallo");
*/

      return (
        <div>
          <input type="file" onChange={handleFileChange} accept=".pdf" />
          <button onClick={handleFileUpload}>Upload PDF</button>
          <p>IPFS-Hash: {responseData}</p>
        </div>
      );
    };

export default App;
