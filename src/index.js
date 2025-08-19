import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Approutes from 'routes.js'; // Ensure the path is correct  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Approutes />
  </React.StrictMode>
);

  
