import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './JobCreate.css'

interface JobCreateProps {
  user: any
}

export default function JobCreate({ user }: JobCreateProps) {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
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
      const res = await fetch('/.netlify/functions/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          company,
          description,
          location,
          salary: salary || undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create job')
        return
      }

      setSuccess('Job posted successfully!')
      setTimeout(() => {
        navigate('/jobs')
      }, 1500)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="job-create-container">
      <div className="container">
        <div className="create-card">
          <h1>Post a Job</h1>
          <p className="subtitle">$2.00 per listing</p>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                placeholder="e.g., Senior Software Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                placeholder="e.g., Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  placeholder="e.g., San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Salary (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., $100k - $150k"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                rows={8}
                placeholder="Describe the role, responsibilities, requirements, and benefits..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Posting...' : 'Post Job - $2.00'}
              </button>
              <button type="button" className="secondary" onClick={() => navigate('/jobs')}>
                Cancel
              </button>
            </div>
          </form>

          <div className="pricing-info">
            <h3>Pricing</h3>
            <p>Job posts are $2.00 each. Premium subscribers post unlimited jobs at no extra cost.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
