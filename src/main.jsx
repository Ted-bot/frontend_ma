import React from 'react'
import {  ErrorBoundary } from 'react-error-boundary'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorPage from './pages/ErrorPage.jsx'
import { ReactQueryClientProvider } from './dataProvider/main/ReactQueryClientProvider.jsx'


// function ErrorBoundaryLayout(){ 
//       return (<>
//         <ErrorBoundary FallbackComponent={FallBackRender} onError={() => console.log("Error (bubbeled up) caught")}>
//           <Outlet />
//         </ErrorBoundary>
//       </>)
// }


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     {/* <ReactQueryClientProvider> */}
      <ErrorBoundary FallbackComponent={ErrorPage} onError={() => console.log("Error (bubbeled up) caught")}>
        <App />
      </ErrorBoundary>      
     {/* </ReactQueryClientProvider> */}
  </React.StrictMode>,
)
