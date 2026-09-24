import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

interface HomeProps {
  user: any
}

export default function Home({ user }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSkill, setSearchSkill] = useState('')
  const [searchLocation, setSearchLocation] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality would redirect to a search results page
  }

  return (
    <div className="home-container">
      <div className="container">
        <div className="hero">
          <h1>Welcome back, {user.profile.firstName || user.username}!</h1>
          <p>ProNet: The secure, affordable professional network</p>
          <div className="hero-cta">
            <Link to="/jobs" className="btn-primary">
              Browse Jobs
            </Link>
            <Link to="/jobs/create" className="btn-secondary">
              Post a Job
            </Link>
          </div>
        </div>

        <div className="search-section">
          <h2>Find Professionals</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by name, title, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
              type="text"
              placeholder="Skill (optional)"
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location (optional)"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <button type="submit" className="primary">
              Search
            </button>
          </form>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>One Price for Everything</h3>
            <p>$12.99/month includes all features. No hidden charges.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Privacy First</h3>
            <p>Built by security experts. Your data stays yours.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Find Jobs & Talent</h3>
            <p>Post jobs for $2 or discover top professionals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Direct Messaging</h3>
            <p>Connect directly with professionals you're interested in.</p>
          </div>
        </div>

        <div className="cta-section">
          <h2>Complete Your Profile</h2>
          <p>Help others find you and build your professional network</p>
          <Link to="/profile/edit" className="primary">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
