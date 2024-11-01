import React from 'react'
import {  ErrorBoundary } from 'react-error-boundary'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorPage from './pages/ErrorPage.jsx'
import { ReactQueryClientProvider } from './dataProvider/main/ReactQueryClientProvider.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>    
        <App />   
  </React.StrictMode>
)
