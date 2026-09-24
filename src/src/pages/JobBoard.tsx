import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './JobBoard.css'

interface JobBoardProps {
  user: any
}

interface Job {
  id: string
  title: string
  company: string
  description: string
  location: string
  salary?: string
  postedBy: string
  createdAt: string
}

export default function JobBoard({ user }: JobBoardProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchCompany, setSearchCompany] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/.netlify/functions/jobs/all')
        const data = await res.json()
        if (res.ok) {
          setJobs(data.jobs)
          setFilteredJobs(data.jobs)
        }
      } catch (err) {
        console.error('Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (searchQuery) params.append('q', searchQuery)
    if (searchLocation) params.append('location', searchLocation)
    if (searchCompany) params.append('company', searchCompany)

    try {
      const res = await fetch(`/.netlify/functions/jobs/search?${params}`)
      const data = await res.json()
      if (res.ok) {
        setFilteredJobs(data.jobs)
      }
    } catch (err) {
      console.error('Search failed')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="jobboard-container">
      <div className="container">
        <div className="jobboard-header">
          <h1>Job Board</h1>
          <Link to="/jobs/create" className="primary">
            Post a Job
          </Link>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search jobs by title, company, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Company"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
          />
          <button type="submit" className="primary">
            Search
          </button>
        </form>

        {loading ? (
          <div className="loading">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <p>No jobs found. {jobs.length === 0 ? 'Be the first to post one!' : 'Try adjusting your search.'}</p>
            <Link to="/jobs/create" className="primary">
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="jobs-list">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="company">{job.company}</p>
                  </div>
                  <span className="posted-time">{formatDate(job.createdAt)}</span>
                </div>
                <p className="description">{job.description.substring(0, 150)}...</p>
                <div className="job-meta">
                  <span className="location">📍 {job.location}</span>
                  {job.salary && <span className="salary">💰 {job.salary}</span>}
                </div>
                <div className="job-actions">
                  <a href={`#job-${job.id}`} className="secondary">
                    View Details
                  </a>
                  <a href={`/messages`} className="secondary">
                    Contact Poster
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
