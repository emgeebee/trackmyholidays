import React from "react";
import { Container, createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { mainStore } from "./core/store";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container as Container);
export const storeInstance = mainStore();

root.render(
  <React.StrictMode>
    <Provider store={storeInstance}>
      <App />
    </Provider>
  </React.StrictMode>
);

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux'

// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
// import { mainStore } from './core/store';
// export const storeInstance = mainStore();

// ReactDOM.render(<Provider store={storeInstance}>
//     <App />
// </Provider>, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
