
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        year: '',
        semester: '',
        course: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (
            !formData.username.trim() ||
            !formData.password ||
            !formData.name.trim() ||
            !formData.year ||
            !formData.semester ||
            !formData.course.trim()
        ) {
            setError('Please fill in all fields.');
            return;
        }

        if (formData.username.trim().length < 3) {
            setError('Username must contain at least 3 characters.');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must contain at least 8 characters.');
            return;
        }

        setLoading(true);

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
                        username: formData.username.trim(),
                        password: formData.password,
                        name: formData.name.trim(),
                        year: Number(formData.year),
                        semester: Number(formData.semester),
                        course: formData.course.trim()
                    })
                }
            );

            const text = await response.text();

            if (!response.ok) {
                throw new Error(
                    text || `Registration failed (${response.status})`
                );
            }

            setSuccess(
                'Registration successful! Redirecting to login...'
            );

            setFormData({
                username: '',
                password: '',
                name: '',
                year: '',
                semester: '',
                course: ''
            });

            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);

            setError(
                error.message || 'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-header">
                    <div className="auth-icon">👤</div>
                    <h1>Create Account</h1>
                    <p>Register for the Student Management System</p>
                </div>

                {error && (
                    <div className="auth-error">{error}</div>
                )}

                {success && (
                    <div className="auth-success">{success}</div>
                )}

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Create a username"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="year">Year</label>
                        <select
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="semester">Semester</label>
                        <select
                            id="semester"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Select Semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                <option key={sem} value={sem}>
                                    Semester {sem}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="course">Course</label>
                        <input
                            id="course"
                            name="course"
                            type="text"
                            placeholder="Example: CSE"
                            value={formData.course}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                </form>

                <div className="auth-footer">
                    <p>Already have an account?</p>
                    <Link to="/login">Login here</Link>
                </div>

            </div>
        </div>
    );
}

export default Register;
