import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Profile from './pages/Profile.tsx'
import MatchMaker from './pages/MatchMaker.tsx'
import Registration from './pages/Registration.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/match" element={<MatchMaker />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
