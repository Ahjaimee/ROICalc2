import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './ErrorBoundary';

const rootElement = document.getElementById('root');

if (!rootElement) {
  const fallback = document.createElement('div');
  fallback.innerText = 'Unable to load the NHM ROI calculator. The root container is missing.';
  fallback.style.padding = '1.5rem';
  fallback.style.fontFamily = 'Inter, system-ui, sans-serif';
  document.body.appendChild(fallback);
  console.error('Root element with id "root" was not found.');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
