// import { useState } from 'react'
import { createBrowserRouter,
  RouterProvider,
  // useLocation,
  // matchPath
 } from 'react-router-dom'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import RootLayout from './pages/Root.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import {logoutAction} from './pages/ActionLogout.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import OrderPage from './pages/OrderPage.jsx'
import PaymentPage from './pages/client/PaymentPage.jsx'

import {tokenLoader} from './js/util/auth.js'
// import UsersPage from './pages/admin/UsersPage.jsx'

function App() {
  // const {pathname} = useLocation()

  // const patterns = [
  //   "/:dashboard/:firstKey/:secondKey/:thirdKey/:fourthKey",
  //   "/:dashboard/:firstKey/:secondKey/:thirdKey",
  //   "/:dashboard/:firstKey/:secondKey",
  //   "/:dashboard/:firstKey"
  // ]

  // const match = patterns.reduce(
  //   (match, pattern) => (matchPath(pattern, match) ? match : patter),
  //   pathname
  // )
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
        { path: '/dashboard/*', element: <DashboardPage />},
        { path: '/calendar', element: <CalendarPage />},
        { path: '/order', element: <OrderPage />},
        { path: '/payment', element: <PaymentPage />},
      ]  
    }
  ])

  return (<RouterProvider router={router} ></RouterProvider>
  )
}

export default App
