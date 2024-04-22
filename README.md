# CryptoSafeDocs

Im Rahmen meiner Bachelorarbeit mit dem Titel "Implementierung einer gesicherten Dokumentenfreigabe unter Verwendung der Blockchain-Technologie und moderner Sicherheitsmechanismen" habe ich die dApp CryptoSafeDocs entwickelt.

## Beschreibung

Dieses Projekt ermöglicht die gesicherte Freigabe von Dokumenten zwischen zwei Teilnehmern unter Verwendung der Blockchain- und IPFS-Technologie sowie der RSA-Verschlüsselung. Zusätzlich wurde ein WebAuthn-Loginformular eingebunden.

Nutzer können sichere Schlüsselpaare generieren, verschlüsselte IPFS-Zugriffslinks auf der Blockchain hinterlegen und zugewiesene Dokumente sicher abrufen. Diese Anwendung integriert Smart Contracts, die in Solidity geschrieben sind, und interagiert mit der Blockchain über die MetaMask-Erweiterung, wodurch eine hohe Sicherheit und Dezentralisierung gewährleistet wird.

## Technologien

- **Frontend:** ReactJS
- **Backend:** JavaScript (Node.js)
- **Blockchain Interaktion:** Solidity Smart Contract, MetaMask Erweiterung
- **Datenfreigabe:** InterPlanetary File System (IPFS)

## Installation

1. **Voraussetzungen**

   Stellen Sie sicher, dass Node.js und npm auf Ihrem System installiert sind. MetaMask sollte als Browser-Erweiterung installiert und konfiguriert sein. Die Ports 5173, 5051 und 5052 sollten frei sein.

2. **Repository clonen**

```bash
cd <Zielverzeichnis>
git clone https://github.com/Robinb47/CryptoSafeDocs.git
```

3. **Abhängigkeiten installieren im Frontend:**

```bash
cd CryptoSafeDocs/client/reactDapp
npm install ethers
npm install "@passageidentity/passage-elements/passage-auth"
npm install react-dom
npm install react-router-dom
```

4. **Abhängigkeiten installieren im Backend**

```bash
cd CryptoSafeDocs/server
npm install moralis
npm install fs
npm install cors
npm install "@passageidentity/passage-node"
npm install crypto
npm install node-rsa
npm install express
npm install body-parser
npm install multer
```

## Benutzung

1. **Starten des Backends**

```bash
cd CryptoSafeDocs/server
node index.js
node keymanager.js
```

2. **Starten des Frontends**

```bash
cd CryptoSafeDocs/client/reactDapp
npm run dev
```

Das Frontend ist nun unter `http://localhost:5173/` erreichbar.
