// import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import RootLayout from './pages/Root.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'

function App() {
  // const [count, setCount] = useState(0)
  const router = createBrowserRouter([
    { 
      path: '/', 
      element: <RootLayout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/sign-up', element: <SignUpPage /> },
      ]  
    }
  ])

  return (<RouterProvider router={router} ></RouterProvider>
  )
}

export default App
