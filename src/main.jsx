import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { startSkyClock } from './lib/theme';

startSkyClock(); // the sky drifts with the visitor's clock (src/lib/theme.js)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
