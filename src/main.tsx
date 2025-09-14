import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { makeServer } from "./mirage/server";
import { seedDatabase } from './mirage/seed';

// Conditionally start the MirageJS server and seed the database
// only when the app is running in development mode.

  makeServer();
  seedDatabase();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);