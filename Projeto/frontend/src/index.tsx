import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './shared/css/style.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);

