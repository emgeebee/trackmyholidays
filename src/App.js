import React from 'react';
import { shallowEqual, useSelector } from 'react-redux'

import { Calendar, Config } from './ui';

import './App.css';

function App() {

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div>
        <Calendar />
      </div>
      <Config />
    </div>
  );
}

export default App;
