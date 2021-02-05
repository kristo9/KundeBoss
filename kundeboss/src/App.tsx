import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Funker det nå?
        </p>
        <a
          className="App-link"
          href="https://timiansfuncapp.azurewebsites.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          Log In
        </a>
      </header>
    </div>
  );
}

export default App;
