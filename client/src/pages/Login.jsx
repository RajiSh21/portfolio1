import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, register, user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) { navigate('/admin/dashboard'); return null }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Admin {mode === 'login' ? 'Login' : 'Setup'}</h1>
        <p className="subtitle">{mode === 'login' ? 'Sign in to view visitor analytics' : 'Create your admin account (one-time setup)'}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>
        <p className="login-register-link">
          {mode === 'login'
            ? <> First time? <button type="button" onClick={()=>{setMode('register');setError('')}}>Create admin account</button> </>
            : <> Already have an account? <button type="button" onClick={()=>{setMode('login');setError('')}}>Sign in</button> </>}
        </p>
        <p className="login-register-link" style={{marginTop:8}}>
          <Link to="/" className="back-to-portfolio">← Back to Portfolio</Link>
        </p>
      </div>
    </div>
  )
}
