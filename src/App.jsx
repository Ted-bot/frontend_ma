import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import React from 'react'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {Root} from './pages/Root.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import PublicCalendarPage from './pages/PublicCalendarPage.jsx'
import OrderPage from './pages/OrderPage.jsx'
import {PaymentPage} from './pages/client/PaymentPage.jsx'
import { CalendarLoader } from './loader/CalendarLoader.jsx'

import {tokenLoader} from './js/util/auth.js'
import ContactPage from './pages/ContactPage.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import { ReactQueryClientProvider } from './dataProvider/main/ReactQueryClientProvider.jsx'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { SignUpLoader } from './loader/SignUpLoader.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TabsProvider } from './store/tabs-context'
import { StoreProvider } from './hooks/store/StoreProvider.jsx'
import { ThemeProvider } from '@mui/material/styles'
import { unstable_createMuiStrictModeTheme } from '@mui/material/styles'
import { ErrorBoundary } from 'react-error-boundary'
// import { useQuery } from 'react-query';

const theme = unstable_createMuiStrictModeTheme();

function App() {
  const queryClient = new QueryClient()

  const router = createBrowserRouter([
    { 
      path: '/', 
      element: <Root />,
      // errorElement: <ErrorPage />,
      id: 'root',
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/sign-up', element: <SignUpPage />, loader: SignUpLoader },
        { path: '/work', element: <LoginPage /> },
        { path: '/calendar', element: <PublicCalendarPage />, loader: CalendarLoader},
        { path: '/subscribe', element: <OrderPage />},
        { path: '/payment', element: <ErrorBoundary fallback={<h1>Error</h1>} ><PaymentPage /></ErrorBoundary>}, //, loader: PaymentLoader
        { path: '/dashboard/*', element: <DashboardPage />}, //,  loader: UserLoader
        { path: '/contact', element: <ContactPage />},
      ]  
    }
  ])

  return (
    <StoreProvider>
        <TabsProvider>
            <ReactQueryClientProvider>
              <QueryClientProvider client={queryClient} contextSharing={true}>
                <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <RouterProvider router={router} ></RouterProvider>
                    </LocalizationProvider>        
                </ThemeProvider>
            </QueryClientProvider>
          </ReactQueryClientProvider>
        </TabsProvider>
    </StoreProvider>
  )
}

export default App
