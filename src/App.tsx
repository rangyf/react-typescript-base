import React, { Component } from 'react';
import logo from '@assets/files/logo.svg';
import '@src/App.css';

class App extends Component {
  
  componentDidMount () {
    setTimeout(() => {
      alert('hi');
    }, 1000);
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
}

export default App;
