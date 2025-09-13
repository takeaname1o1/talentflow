import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { makeServer } from './mirage/server.ts'

// Start MirageJS server in development mode
if (import.meta.env.MODE === 'development') {
  makeServer({ environment: 'development' });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)