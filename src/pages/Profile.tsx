import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './Profile.css'

interface ProfileProps {
  user: any
}

export default function Profile({ user }: ProfileProps) {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/.netlify/functions/profiles?username=${username}`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Profile not found')
          return
        }

        setProfile(data)
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchProfile()
    }
  }, [username])

  if (loading) {
    return <div className="container" style={{ padding: '40px 0' }}>Loading...</div>
  }

  if (error || !profile) {
    return <div className="container" style={{ padding: '40px 0' }}><div className="alert error">{error}</div></div>
  }

  const isOwnProfile = user.username === profile.username

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.profile.profileImageUrl ? (
              <img src={profile.profile.profileImageUrl} alt={profile.username} />
            ) : (
              <div className="avatar-placeholder">{profile.username.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="profile-info">
            <h1>
              {profile.profile.firstName} {profile.profile.lastName}
            </h1>
            <p className="username">@{profile.username}</p>
            {profile.profile.title && <p className="title">{profile.profile.title}</p>}
            {profile.profile.location && <p className="location">📍 {profile.profile.location}</p>}
            {isOwnProfile && (
              <Link to="/profile/edit" className="btn-primary">
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {profile.profile.bio && (
          <div className="profile-section">
            <h2>About</h2>
            <p>{profile.profile.bio}</p>
          </div>
        )}

        {profile.profile.skills && profile.profile.skills.length > 0 && (
          <div className="profile-section">
            <h2>Skills</h2>
            <div className="skills-grid">
              {profile.profile.skills.map((skill: string, i: number) => (
                <span key={i} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {!isOwnProfile && (
          <div className="profile-actions">
            <Link to="/messages" className="primary">
              Send Message
            </Link>
            <Link to="/jobs" className="secondary">
              View Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
