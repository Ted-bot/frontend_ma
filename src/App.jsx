import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import React from 'react'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import RootLayout from './pages/Root.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import OrderPage from './pages/OrderPage.jsx'
import PaymentPage from './pages/client/PaymentPage.jsx'
import { PaymentLoader } from './loader/PaymentLoader.jsx'
import { CalendarLoader } from './loader/CalendarLoader.jsx'

import {tokenLoader} from './js/util/auth.js'
import ContactPage from './pages/ContactPage.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import { ReactQueryClientProvider } from './dataProvider/main/ReactQueryClientProvider.jsx'
import { useUserFormContext, UserFormContextProvider } from './store/user-form-context.jsx'
import { SignUpLoader } from './loader/SignUpLoader.jsx'
import { Provider } from 'react-redux'
import { store } from './store/index.js'

function App() {

  const router = createBrowserRouter([
    { 
      path: '/', 
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      id: 'root',
      loader: tokenLoader,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/sign-up', element: <SignUpPage />, loader: SignUpLoader },
        { path: '/work', element: <LoginPage /> },
        { path: '/calendar', element: <CalendarPage />, loader: CalendarLoader},
        { path: '/subscribe', element: <OrderPage />},
        { path: '/payment', element: <PaymentPage />},
        { path: '/dashboard/*', element: <DashboardPage />}, //,  loader: UserLoader
        { path: '/contact', element: <ContactPage />},
      ]  
    }
  ])

  return (
    <Provider store={store}>
      <ReactQueryClientProvider>
          <UserFormContextProvider>
        
            <RouterProvider router={router} ></RouterProvider>
        
          </UserFormContextProvider>
      </ReactQueryClientProvider>
    </Provider>
  )
}

export default App
