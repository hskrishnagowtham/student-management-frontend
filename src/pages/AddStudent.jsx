import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddStudent() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        rollNumber: '',
        name: '',
        year: '',
        semester: '',
        course: '',
        totalMarks: ''
    })

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    // ======================================================
    // HANDLE INPUT CHANGE
    // ======================================================

    const handleChange = (event) => {

        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value
        })

        setError('')
        setMessage('')
    }


    // ======================================================
    // HANDLE SUBMIT
    // ======================================================

    const handleSubmit = async (event) => {

        event.preventDefault()

        setMessage('')
        setError('')


        // ==========================================
        // GET TOKEN
        // ==========================================

        const token = localStorage.getItem('token')

        if (!token) {

            setError('Please login first.')

            return
        }


        // ==========================================
        // FRONTEND VALIDATION
        // ==========================================

        if (!formData.rollNumber) {

            setError('Please enter the roll number.')

            return
        }

        if (!formData.name.trim()) {

            setError('Please enter the student name.')

            return
        }

        if (!formData.year) {

            setError('Please enter the year.')

            return
        }

        if (!formData.semester) {

            setError('Please enter the semester.')

            return
        }

        if (!formData.course.trim()) {

            setError('Please enter the course.')

            return
        }

        if (!formData.totalMarks) {

            setError('Please enter the total marks.')

            return
        }


        // ==========================================
        // VALIDATE MARKS
        // ==========================================

        const totalMarks = Number(formData.totalMarks)

        if (totalMarks < 0 || totalMarks > 1000) {

            setError(
                'Total marks must be between 0 and 1000.'
            )

            return
        }


        setLoading(true)


        try {

            // ==========================================
            // SEND REQUEST
            // ==========================================

            const response = await fetch(
                'https://studentmanagementsystem-0xvp.onrender.com/students',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },

                    body: JSON.stringify({

                        rollNumber:
                            Number(formData.rollNumber),

                        name:
                            formData.name.trim(),

                        year:
                            Number(formData.year),

                        semester:
                            Number(formData.semester),

                        course:
                            formData.course.trim(),

                        totalMarks:
                        totalMarks

                    })
                }
            )


            // ==========================================
            // READ RESPONSE
            // ==========================================

            const text = await response.text()

            let data = null


            if (text) {

                try {

                    data = JSON.parse(text)

                } catch {

                    data = text

                }
            }


            // ==========================================
            // HANDLE ERROR
            // ==========================================

            if (!response.ok) {

                console.log(
                    'Status:',
                    response.status
                )

                console.log(
                    'Response:',
                    data
                )


                throw new Error(

                    typeof data === 'string'

                        ? data

                        : data?.message ||
                        `Failed to add student (${response.status})`

                )
            }


            // ==========================================
            // SUCCESS
            // ==========================================

            setMessage(
                'Student added successfully!'
            )


            // Clear form

            setFormData({
                rollNumber: '',
                name: '',
                year: '',
                semester: '',
                course: '',
                totalMarks: ''
            })


        } catch (error) {

            console.error(
                'Add student error:',
                error
            )


            setError(
                error.message ||
                'Failed to add student.'
            )


        } finally {

            setLoading(false)

        }
    }


    // ======================================================
    // BACK TO STUDENTS
    // ======================================================

    const handleBack = () => {

        navigate('/students')

    }


    // ======================================================
    // JSX
    // ======================================================

    return (

        <div className="student-form-page">

            <div className="student-form-card">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="student-form-header">

                    <div className="student-form-icon">
                        👨‍🎓
                    </div>

                    <h1>
                        Add Student
                    </h1>

                    <p>
                        Enter the student's academic information
                        below.
                    </p>

                </div>


                {/* ==========================================
                    SUCCESS MESSAGE
                ========================================== */}

                {message && (

                    <div className="form-success">

                        ✅ {message}

                    </div>

                )}


                {/* ==========================================
                    ERROR MESSAGE
                ========================================== */}

                {error && (

                    <div className="form-error">

                        ❌ {error}

                    </div>

                )}


                {/* ==========================================
                    STUDENT FORM
                ========================================== */}

                <form
                    className="student-form"
                    onSubmit={handleSubmit}
                >


                    {/* ROLL NUMBER */}

                    <div className="form-field">

                        <label htmlFor="rollNumber">
                            Roll Number
                        </label>

                        <input
                            id="rollNumber"
                            type="number"
                            name="rollNumber"
                            placeholder="Enter roll number"
                            value={formData.rollNumber}
                            onChange={handleChange}
                            disabled={loading}
                            min="1"
                            required
                        />

                    </div>


                    {/* NAME */}

                    <div className="form-field">

                        <label htmlFor="name">
                            Student Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter student name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />

                    </div>


                    {/* YEAR */}

                    <div className="form-field">

                        <label htmlFor="year">
                            Year
                        </label>

                        <input
                            id="year"
                            type="number"
                            name="year"
                            placeholder="Enter year"
                            value={formData.year}
                            onChange={handleChange}
                            disabled={loading}
                            min="1"
                            max="4"
                            required
                        />

                    </div>


                    {/* SEMESTER */}

                    <div className="form-field">

                        <label htmlFor="semester">
                            Semester
                        </label>

                        <input
                            id="semester"
                            type="number"
                            name="semester"
                            placeholder="Enter semester"
                            value={formData.semester}
                            onChange={handleChange}
                            disabled={loading}
                            min="1"
                            max="8"
                            required
                        />

                    </div>


                    {/* COURSE */}

                    <div className="form-field">

                        <label htmlFor="course">
                            Course
                        </label>

                        <input
                            id="course"
                            type="text"
                            name="course"
                            placeholder="Example: Computer Science"
                            value={formData.course}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />

                    </div>


                    {/* TOTAL MARKS */}

                    <div className="form-field">

                        <label htmlFor="totalMarks">
                            Total Marks
                        </label>

                        <input
                            id="totalMarks"
                            type="number"
                            name="totalMarks"
                            placeholder="Enter marks out of 1000"
                            value={formData.totalMarks}
                            onChange={handleChange}
                            disabled={loading}
                            min="0"
                            max="1000"
                            required
                        />

                    </div>


                    {/* ==========================================
                        FORM ACTIONS
                    ========================================== */}

                    <div className="form-actions">


                        <button
                            type="button"
                            className="back-btn"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            ← Back to Students
                        </button>


                        <button
                            type="submit"
                            className="submit-student-btn"
                            disabled={loading}
                        >

                            {loading
                                ? 'Adding Student...'
                                : 'Add Student'}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default AddStudent