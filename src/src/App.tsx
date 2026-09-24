import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import JobBoard from './pages/JobBoard'
import JobCreate from './pages/JobCreate'
import Messages from './pages/Messages'

interface User {
  id: string
  email: string
  username: string
  profile: {
    firstName: string
    lastName: string
    title: string
    bio: string
    location: string
    skills: string[]
    profileImageUrl?: string
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Validate token by attempting a protected request
      const user = localStorage.getItem('user')
      if (user) {
        setUser(JSON.parse(user))
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const handleUpdateProfile = (updated: User) => {
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <BrowserRouter>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />} />
        <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
        <Route path="/profile/edit" element={user ? <ProfileEdit user={user} onUpdate={handleUpdateProfile} /> : <Navigate to="/login" />} />
        <Route path="/jobs" element={user ? <JobBoard user={user} /> : <Navigate to="/login" />} />
        <Route path="/jobs/create" element={user ? <JobCreate user={user} /> : <Navigate to="/login" />} />
        <Route path="/messages" element={user ? <Messages user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
