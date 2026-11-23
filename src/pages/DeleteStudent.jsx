import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function DeleteStudent() {

    const { rollNumber } = useParams()

    const navigate = useNavigate()

    const [student, setStudent] = useState(null)

    const [loading, setLoading] = useState(true)

    const [deleting, setDeleting] = useState(false)

    const [error, setError] = useState('')


    // ==========================================
    // FETCH STUDENT
    // ==========================================

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

            const response = await fetch(
                `/students/${rollNumber}`,
                {
                    method: 'GET',

                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json'
                    }
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
                    `Failed to find student (${response.status})`
                )
            }


            setStudent(data)


        } catch (error) {

            console.error(
                'Fetch student error:',
                error
            )

            setError(error.message)

        } finally {

            setLoading(false)

        }
    }


    // ==========================================
    // DELETE STUDENT
    // ==========================================

    const handleDelete = async () => {

        const token = localStorage.getItem('token')


        if (!token) {

            setError('Please login first.')

            return
        }


        setDeleting(true)

        setError('')


        try {

            const response = await fetch(
                `/students/${rollNumber}`,
                {
                    method: 'DELETE',

                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json'
                    }
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
                    `Failed to delete student (${response.status})`
                )
            }


            // ==================================
            // DELETE SUCCESS
            // ==================================

            alert('Student deleted successfully!')

            navigate('/students')


        } catch (error) {

            console.error(
                'Delete student error:',
                error
            )

            setError(error.message)

            setDeleting(false)

        }
    }


    // ==========================================
    // CANCEL
    // ==========================================

    const handleCancel = () => {

        navigate('/students')

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="delete-page">

                <h1>
                    Delete Student
                </h1>

                <p className="delete-loading">
                    Loading student details...
                </p>

            </div>
        )
    }


    // ==========================================
    // ERROR / STUDENT NOT FOUND
    // ==========================================

    if (error && !student) {

        return (

            <div className="delete-page">

                <div className="delete-card">

                    <h1>
                        Delete Student
                    </h1>

                    <p className="error-message">
                        {error}
                    </p>


                    <button
                        className="cancel-btn"
                        onClick={handleCancel}
                    >
                        Back to Students
                    </button>

                </div>

            </div>
        )
    }


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (

        <div className="delete-page">


            <div className="delete-card">


                <div className="delete-icon">
                    ⚠️
                </div>


                <h1>
                    Delete Student
                </h1>


                <p className="delete-warning">

                    Are you sure you want to delete this student?

                </p>


                <p className="delete-subtitle">

                    This action cannot be undone.

                </p>


                {error && (

                    <p className="error-message">
                        {error}
                    </p>

                )}


                {student && (

                    <div className="student-delete-details">


                        <div className="detail-row">

                            <span>
                                Roll Number
                            </span>

                            <strong>
                                {student.rollNumber}
                            </strong>

                        </div>


                        <div className="detail-row">

                            <span>
                                Name
                            </span>

                            <strong>
                                {student.name}
                            </strong>

                        </div>


                        <div className="detail-row">

                            <span>
                                Year
                            </span>

                            <strong>
                                {student.year}
                            </strong>

                        </div>


                        <div className="detail-row">

                            <span>
                                Semester
                            </span>

                            <strong>
                                {student.semester}
                            </strong>

                        </div>


                        <div className="detail-row">

                            <span>
                                Course
                            </span>

                            <strong>
                                {student.course}
                            </strong>

                        </div>


                    </div>

                )}


                <div className="delete-actions">


                    <button
                        className="cancel-btn"
                        onClick={handleCancel}
                        disabled={deleting}
                    >
                        Cancel
                    </button>


                    <button
                        className="confirm-delete-btn"
                        onClick={handleDelete}
                        disabled={deleting}
                    >

                        {deleting
                            ? 'Deleting...'
                            : 'Delete Student'}

                    </button>


                </div>


            </div>

        </div>
    )
}

export default DeleteStudent