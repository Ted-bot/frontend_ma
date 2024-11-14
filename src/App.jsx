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
import PublicCalendarPage from './pages/PublicCalendarPage.jsx'
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
// import { Provider } from 'react-redux'
// import { store } from './store/index.js'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TabsProvider } from './store/tabs-context'
import LoginDashboardLoader from './loader/LoginDashboardLoader.jsx'
import { StoreProvider } from './hooks/store/StoreProvider.jsx'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { unstable_createMuiStrictModeTheme } from '@mui/material/styles'

const theme = unstable_createMuiStrictModeTheme();

function App() {

  const router = createBrowserRouter([
    { 
      path: '/', 
      element: <RootLayout />,
      // errorElement: <ErrorPage />,
      id: 'root',
      // loader: () => {
      //   let logoutEventName = 'ra-logout'
      //   window.addEventListener('storage', (event) => {
      //     console.log("GotLogoutTOken", event)
      //     if (event.key === logoutEventName) {
      //         console.log("GotLogoutTOken", logoutEventName)
      //         setLoggedIn(false)
      //         return
      //     }
      //     console.log("GotLogoutTOken", logoutEventName)
      //     setLoggedIn(true)
      // })
      // },
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/sign-up', element: <SignUpPage />, loader: SignUpLoader },
        { path: '/work', element: <LoginPage /> },
        { path: '/calendar', element: <PublicCalendarPage />, loader: CalendarLoader},
        { path: '/subscribe', element: <OrderPage />},
        { path: '/payment', element: <PaymentPage />}, //, loader: PaymentLoader
        { path: '/dashboard/*', element: <DashboardPage />}, //,  loader: UserLoader
        { path: '/contact', element: <ContactPage />},
      ]  
    }
  ])

  return (
    // <Provider store={store}>
    <StoreProvider>
        <TabsProvider>
            <ReactQueryClientProvider>
              <ThemeProvider theme={theme}>
                <UserFormContextProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <RouterProvider router={router} ></RouterProvider>
                  </LocalizationProvider>        
                </UserFormContextProvider>
              </ThemeProvider>
          </ReactQueryClientProvider>
        </TabsProvider>
    </StoreProvider>
    // </Provider>
  )
}

export default App
