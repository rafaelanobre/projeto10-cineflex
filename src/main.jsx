import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import axios from 'axios'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    axios.defaults.headers.common['Authorization'] = 'Da3XNfDHx4X7NJWZEq9v7eO1';
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
