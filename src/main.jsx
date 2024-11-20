import React from 'react'
// import { ErrorBoundary } from 'react-error-boundary'
// import { FallBackRender } from './components/errors/FallBackRender.jsx'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorPage from './pages/ErrorPage.jsx'
import { ReactQueryClientProvider } from './dataProvider/main/ReactQueryClientProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>    
    {/* <ErrorBoundary FallbackComponent={FallBackRender} onError={(error) => console.log("Error Boundray:",error)}> */}
        <App />   
    {/* </ErrorBoundary>   */}
  </React.StrictMode>
)

// ReactDOM.hydrateRoot(document.getElementById('root'),<React.StrictMode>   <App /></React.StrictMode>)