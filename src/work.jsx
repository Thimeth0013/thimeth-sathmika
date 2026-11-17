import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { WorkPage } from './WorkPage.jsx';

// Entry for the separate "All work" page (work/index.html), opened from Featured Work's "View all work".
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorkPage />
  </StrictMode>
);
