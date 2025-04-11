import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Profile from './pages/Profile.tsx'
import MatchMaker from './pages/MatchMaker.tsx'
import Registration from './pages/Registration.tsx'
import Friends from './pages/Friends.tsx'
import './index.css'
import './styles/y2k.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/match" element={<MatchMaker />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
