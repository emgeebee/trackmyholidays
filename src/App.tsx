import React from "react";
import { Calendar, Config } from "./ui";
import "./App.css";

function App(): JSX.Element {
  return (
    <div className="App">
      <Config />
      <Calendar />
    </div>
  );
}

export default App;
