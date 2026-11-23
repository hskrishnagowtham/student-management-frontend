
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function UpdateStudent() {
    const { rollNumber } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        rollNumber: '',
        name: '',
        year: '',
        semester: '',
        course: '',
        totalMarks: '',
        maximumMarks: ''
    })

    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    // FETCH STUDENT
    useEffect(() => {
        fetchStudent()
    }, [rollNumber])

    const fetchStudent = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
            setError('Please login first.')
            setLoading(false)
            return
        }

        try {
            const response = await fetch(`/students/${rollNumber}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json'
                }
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

            if (!response.ok) {
                throw new Error(
                    typeof data === 'string'
                        ? data
                        : data?.message || `Failed to load student (${response.status})`
                )
            }

            setFormData({
                rollNumber: data.rollNumber ?? '',
                name: data.name ?? '',
                year: data.year ?? '',
                semester: data.semester ?? '',
                course: data.course ?? '',
                totalMarks: data.totalMarks ?? '',
                maximumMarks: data.maximumMarks ?? ''
            })
        } catch (error) {
            console.error('Fetch student error:', error)
            setError(error.message || 'Failed to load student.')
        } finally {
            setLoading(false)
        }
    }

    // HANDLE INPUT CHANGE
    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value
        })

        setError('')
        setMessage('')
    }

    // HANDLE UPDATE
    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setMessage('')

        const token = localStorage.getItem('token')

        if (!token) {
            setError('Please login first.')
            return
        }

        if (!formData.name.trim()) {
            setError('Please enter the student name.')
            return
        }

        if (!formData.year || !formData.semester) {
            setError('Please enter the year and semester.')
            return
        }

        if (!formData.course.trim()) {
            setError('Please enter the course.')
            return
        }

        if (formData.totalMarks === '' || formData.maximumMarks === '') {
            setError('Please enter both total marks and maximum marks.')
            return
        }

        const totalMarks = Number(formData.totalMarks)
        const maximumMarks = Number(formData.maximumMarks)

        if (!Number.isInteger(totalMarks) || totalMarks < 0) {
            setError('Total marks must be a non-negative whole number.')
            return
        }

        if (!Number.isInteger(maximumMarks) || maximumMarks <= 0) {
            setError('Maximum marks must be a positive whole number.')
            return
        }

        if (totalMarks > maximumMarks) {
            setError('Total marks cannot exceed maximum marks.')
            return
        }

        setUpdating(true)

        try {
            const response = await fetch(`/students/${rollNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    rollNumber: Number(formData.rollNumber),
                    name: formData.name.trim(),
                    year: Number(formData.year),
                    semester: Number(formData.semester),
                    course: formData.course.trim(),
                    totalMarks,
                    maximumMarks
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

            if (!response.ok) {
                throw new Error(
                    typeof data === 'string'
                        ? data
                        : data?.message || `Failed to update student (${response.status})`
                )
            }

            setMessage('Student updated successfully!')

            setTimeout(() => {
                navigate('/students')
            }, 1000)
        } catch (error) {
            console.error('Update student error:', error)
            setError(error.message || 'Failed to update student.')
            setUpdating(false)
        }
    }

    const handleBack = () => {
        navigate('/students')
    }

    // LOADING
    if (loading) {
        return (
            <div className="student-form-page">
                <div className="student-form-card">
                    <div className="student-form-header">
                        <div className="student-form-icon">✏️</div>
                        <h1>Update Student</h1>
                        <p>Loading student information...</p>
                    </div>
                </div>
            </div>
        )
    }

    // ERROR WHILE LOADING
    if (error && !formData.rollNumber) {
        return (
            <div className="student-form-page">
                <div className="student-form-card">
                    <div className="student-form-header">
                        <div className="student-form-icon">⚠️</div>
                        <h1>Update Student</h1>
                    </div>

                    <div className="form-error">❌ {error}</div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="back-btn"
                            onClick={handleBack}
                        >
                            ← Back to Students
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // MAIN FORM
    return (
        <div className="student-form-page">
            <div className="student-form-card">

                <div className="student-form-header">
                    <div className="student-form-icon">✏️</div>
                    <h1>Update Student</h1>
                    <p>Update the student's academic information below.</p>
                </div>

                {message && (
                    <div className="form-success">✅ {message}</div>
                )}

                {error && (
                    <div className="form-error">❌ {error}</div>
                )}

                <form className="student-form" onSubmit={handleSubmit}>

                    <div className="form-field">
                        <label htmlFor="rollNumber">Roll Number</label>
                        <input
                            id="rollNumber"
                            type="number"
                            name="rollNumber"
                            value={formData.rollNumber}
                            readOnly
                        />
                        <small>Roll number cannot be changed.</small>
                    </div>

                    <div className="form-field">
                        <label htmlFor="name">Student Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter student name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={updating}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="year">Year</label>
                        <input
                            id="year"
                            type="number"
                            name="year"
                            placeholder="Enter year"
                            value={formData.year}
                            onChange={handleChange}
                            disabled={updating}
                            min="1"
                            max="4"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="semester">Semester</label>
                        <input
                            id="semester"
                            type="number"
                            name="semester"
                            placeholder="Enter semester"
                            value={formData.semester}
                            onChange={handleChange}
                            disabled={updating}
                            min="1"
                            max="8"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="course">Course</label>
                        <input
                            id="course"
                            type="text"
                            name="course"
                            placeholder="Example: Computer Science"
                            value={formData.course}
                            onChange={handleChange}
                            disabled={updating}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="totalMarks">Total Marks</label>
                        <input
                            id="totalMarks"
                            type="number"
                            name="totalMarks"
                            placeholder="Enter obtained marks"
                            value={formData.totalMarks}
                            onChange={handleChange}
                            disabled={updating}
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="maximumMarks">Maximum Marks</label>
                        <input
                            id="maximumMarks"
                            type="number"
                            name="maximumMarks"
                            placeholder="Example: 1000"
                            value={formData.maximumMarks}
                            onChange={handleChange}
                            disabled={updating}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="back-btn"
                            onClick={handleBack}
                            disabled={updating}
                        >
                            ← Back to Students
                        </button>

                        <button
                            type="submit"
                            className="submit-student-btn"
                            disabled={updating}
                        >
                            {updating ? 'Updating Student...' : 'Update Student'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default UpdateStudent
