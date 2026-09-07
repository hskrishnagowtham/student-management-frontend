import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('USER')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [loading, setLoading] = useState(false)


    const handleRegister = async (event) => {

        event.preventDefault()

        setError('')
        setSuccess('')


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!username.trim()) {

            setError(
                'Please enter a username.'
            )

            return
        }


        if (username.trim().length < 3) {

            setError(
                'Username must contain at least 3 characters.'
            )

            return
        }


        if (!password) {

            setError(
                'Please enter a password.'
            )

            return
        }


        if (password.length < 6) {

            setError(
                'Password must contain at least 6 characters.'
            )

            return
        }


        setLoading(true)


        try {

            const response = await fetch(
                'https://studentmanagementsystem-0xvp.onrender.com/auth/register',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },

                    body: JSON.stringify({
                        username: username.trim(),
                        password: password,
                        role: role
                    })
                }
            )


            const text = await response.text()

            let data = null


            if (text) {

                try {

                    data = JSON.parse(text)

                } catch {

                    data = text

                }
            }


            if (!response.ok) {

                if (typeof data === 'string') {

                    throw new Error(data)

                }

                throw new Error(
                    data?.message ||
                    `Registration failed (${response.status})`
                )
            }


            // ==========================================
            // SUCCESS
            // ==========================================

            setSuccess(
                'Registration successful! Redirecting to login...'
            )


            setUsername('')
            setPassword('')


            // ==========================================
            // GO TO LOGIN
            // ==========================================

            setTimeout(() => {

                navigate('/login')

            }, 1500)


        } catch (error) {

            console.error(
                'Registration error:',
                error
            )

            setError(
                error.message ||
                'Registration failed. Please try again.'
            )

        } finally {

            setLoading(false)

        }
    }


    return (

        <div className="auth-page">


            <div className="auth-card">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="auth-header">

                    <div className="auth-icon">
                        👤
                    </div>

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Register for the Student Management System
                    </p>

                </div>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <div className="auth-error">
                        {error}
                    </div>

                )}


                {/* ==================================
                    SUCCESS
                ================================== */}

                {success && (

                    <div className="auth-success">
                        {success}
                    </div>

                )}


                {/* ==================================
                    FORM
                ================================== */}

                <form onSubmit={handleRegister}>


                    {/* USERNAME */}

                    <div className="form-group">

                        <label htmlFor="register-username">
                            Username
                        </label>

                        <input
                            id="register-username"
                            type="text"
                            placeholder="Create a username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            autoComplete="username"
                            disabled={loading}
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            disabled={loading}
                        />

                    </div>


                    {/* ROLE */}

                    <div className="form-group">

                        <label htmlFor="role">
                            Role
                        </label>

                        <select
                            id="role"
                            value={role}
                            onChange={(event) =>
                                setRole(event.target.value)
                            }
                            disabled={loading}
                        >

                            <option value="USER">
                                User
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>

                        </select>

                    </div>


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >

                        {loading
                            ? 'Creating Account...'
                            : 'Create Account'}

                    </button>


                </form>


                {/* ==================================
                    LOGIN LINK
                ================================== */}

                <div className="auth-footer">

                    <p>
                        Already have an account?
                    </p>

                    <Link to="/login">
                        Login here
                    </Link>

                </div>


            </div>

        </div>
    )
}

export default Register