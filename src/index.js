import React from 'react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IntlProvider locale="en">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </IntlProvider>,
);

reportWebVitals();
