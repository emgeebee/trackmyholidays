import React from 'react';
import { shallowEqual, useSelector } from 'react-redux'

import { Calendar, Config } from './ui';

import './App.css';

function App() {

  return (
    <div className="App">
      <Calendar />
      <Config />
    </div>
  );
}

export default App;
