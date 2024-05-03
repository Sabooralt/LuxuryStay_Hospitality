import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/toaster.jsx'
import { StaffsContextProvider } from './context/staffContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StaffsContextProvider>

    <App />
    </StaffsContextProvider>
    <Toaster />
  </React.StrictMode>
)
