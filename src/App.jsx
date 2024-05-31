// import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import RootLayout from './pages/Root.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import {logoutAction} from './pages/Logout.jsx'
import {tokenLoader} from './js/util/auth.js'

function App() {
  // const [count, setCount] = useState(0)
  const router = createBrowserRouter([
    { 
      path: '/', 
      element: <RootLayout />,
      id: 'root',
      loader: tokenLoader,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/sign-up', element: <SignUpPage /> },
        { path: '/login', element: <LoginPage /> },
        { path: '/logout', action: logoutAction },
      ]  
    }
  ])

  return (<RouterProvider router={router} ></RouterProvider>
  )
}

export default App
