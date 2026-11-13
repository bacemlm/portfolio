import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/** Used only at build time by scripts/prerender.mjs to write the hero into index.html. */
export const render = () =>
  renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
