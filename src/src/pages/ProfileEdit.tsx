import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfileEdit.css'

interface ProfileEditProps {
  user: any
  onUpdate: (user: any) => void
}

export default function ProfileEdit({ user, onUpdate }: ProfileEditProps) {
  const [firstName, setFirstName] = useState(user.profile.firstName)
  const [lastName, setLastName] = useState(user.profile.lastName)
  const [title, setTitle] = useState(user.profile.title)
  const [bio, setBio] = useState(user.profile.bio)
  const [location, setLocation] = useState(user.profile.location)
  const [skills, setSkills] = useState(user.profile.skills.join(', '))
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/.netlify/functions/profiles/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profile: {
            firstName,
            lastName,
            title,
            bio,
            location,
            skills: skills.split(',').map(s => s.trim()).filter(s => s)
          }
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Update failed')
        return
      }

      onUpdate(data)
      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        navigate(`/profile/${user.username}`)
      }, 1500)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-edit-container">
      <div className="container">
        <div className="edit-card">
          <h1>Edit Profile</h1>
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Professional Title</label>
              <input
                type="text"
                placeholder="e.g., Software Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="e.g., San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                rows={4}
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <textarea
                rows={3}
                placeholder="e.g., Python, JavaScript, AWS, Security"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="secondary" onClick={() => navigate(`/profile/${user.username}`)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
