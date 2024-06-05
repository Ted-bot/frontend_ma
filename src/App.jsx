// import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import RootLayout from './pages/Root.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import {logoutAction} from './pages/Logout.jsx'
import {tokenLoader} from './js/util/auth.js'
// import UsersPage from './pages/admin/UsersPage.jsx'

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
        { path: '/dashboard/*', element: <Dashboard /> },
        // { path: '/users/*', element: <Dashboard /> },
      ]  
    }
  ])

  return (<RouterProvider router={router} ></RouterProvider>
  )
}

export default App
