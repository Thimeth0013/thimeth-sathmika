import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { NotFound } from './NotFound.jsx';
import { startSkyClock } from './lib/theme';

startSkyClock(); // the sky drifts with the visitor's clock (src/lib/theme.js)

// Entry for the 404 page (404.html), which GitHub Pages serves for any path under the site that does
// not exist.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotFound />
  </StrictMode>
);
