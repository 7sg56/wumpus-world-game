import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!;
const loaderElement = document.getElementById('initial-loader');

if (loaderElement) loaderElement.style.display = 'none';
rootElement.style.display = 'block';

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
