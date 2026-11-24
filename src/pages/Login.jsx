
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (event) => {
        event.preventDefault()
        setError('')

        if (!username.trim()) {
            setError('Please enter your username.')
            return
        }

        if (!password) {
            setError('Please enter your password.')
            return
        }

        setLoading(true)

        try {
            // Send login request to the local backend through Vite proxy
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password
                })
            })

            const text = await response.text()
            let data = null

            if (text) {
                try {
                    data = JSON.parse(text)
                } catch {
                    data = text
                }
            }

            // Debug information without exposing the JWT token
            console.log('LOGIN DETAILS:', {
                httpStatus: response.status,
                message: data?.message,
                username: data?.username,
                role: data?.role,
                tokenReceived: !!data?.token,
                responseType: typeof data
            })

            if (!response.ok) {
                throw new Error(
                    typeof data === 'string'
                        ? data
                        : data?.message || 'Invalid username or password.'
                )
            }

            if (!data?.token) {
                throw new Error(
                    'Login successful, but no token was received.'
                )
            }

            if (!data?.role) {
                throw new Error(
                    'Login successful, but no user role was received.'
                )
            }

            // Save login details
            localStorage.setItem('token', data.token)
            localStorage.setItem('role', data.role)
            localStorage.setItem('username', data.username)

            // Navigate to dashboard
            navigate('/dashboard')

        } catch (error) {
            console.error('Login error:', error)
            setError(error.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-header">
                    <div className="auth-icon">🔐</div>
                    <h1>Welcome Back</h1>
                    <p>Login to your Student Management System</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            autoComplete="username"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="current-password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account?</p>
                    <Link to="/register">Create an account</Link>
                </div>

            </div>
        </div>
    )
}

export default Login
