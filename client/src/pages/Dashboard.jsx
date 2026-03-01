import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/visits/stats')
      .then(res => setStats(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  function formatDate(iso) {
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
  }

  function truncateUA(ua) {
    if (!ua) return '—'
    const m = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/)
    return m ? m[0] : ua.substring(0, 40)
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>📊 Visitor Dashboard</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <Link to="/" className="back-to-portfolio">← Portfolio</Link>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-body">
        {loading && <div className="dashboard-loading">Loading analytics…</div>}
        {error && <div className="dashboard-loading" style={{color:'#f87171'}}>{error}</div>}

        {stats && (
          <>
            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Visits</span>
                <span className="stat-value">{stats.totalVisits.toLocaleString()}</span>
                <span className="stat-sub">All time</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Today</span>
                <span className="stat-value">{stats.todayVisits.toLocaleString()}</span>
                <span className="stat-sub">Visits today</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">This Week</span>
                <span className="stat-value">{stats.dailyData.reduce((s,d)=>s+d.count,0).toLocaleString()}</span>
                <span className="stat-sub">Last 7 days</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Pages Tracked</span>
                <span className="stat-value">{stats.pageBreakdown.length}</span>
                <span className="stat-sub">Unique pages</span>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="chart-section">
              <h3>Daily Visits — Last 7 Days</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.dailyData} margin={{top:0,right:0,left:-10,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="_id" tick={{fill:'#94a3b8',fontSize:12}} />
                  <YAxis tick={{fill:'#94a3b8',fontSize:12}} allowDecimals={false} />
                  <Tooltip contentStyle={{background:'#1a1a2e',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'#e2e8f0'}} />
                  <Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Visits Table */}
            <div className="table-section">
              <h3>Recent Visits</h3>
              {stats.recentVisits.length === 0
                ? <p style={{color:'var(--text-muted)'}}>No visits recorded yet.</p>
                : (
                  <div style={{overflowX:'auto'}}>
                    <table className="visits-table">
                      <thead>
                        <tr><th>Time</th><th>Page</th><th>IP</th><th>Referrer</th><th>Browser</th></tr>
                      </thead>
                      <tbody>
                        {stats.recentVisits.map(v => (
                          <tr key={v._id}>
                            <td>{formatDate(v.timestamp)}</td>
                            <td>{v.page}</td>
                            <td>{v.ip === '::1' ? 'localhost' : v.ip}</td>
                            <td>{v.referrer || '—'}</td>
                            <td className="td-ua">{truncateUA(v.userAgent)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </div>
          </>
        )}
      </div>
    </div>
  )
}
