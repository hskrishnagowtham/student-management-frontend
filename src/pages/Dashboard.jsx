import { useEffect, useState } from 'react'

function Dashboard() {

    // ==========================================
    // STATE
    // ==========================================

    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')


    // ==========================================
    // FETCH STUDENTS
    // ==========================================

    useEffect(() => {
        fetchStudents()
    }, [])


    const fetchStudents = async () => {

        const token = localStorage.getItem('token')

        if (!token) {
            setError('Please login first.')
            setLoading(false)
            return
        }

        try {

            const response = await fetch(
                'https://studentmanagementsystem-0xvp.onrender.com/students',
                {
                    method: 'GET',

                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json'
                    }
                }
            )


            // ==================================
            // READ RESPONSE
            // ==================================

            const text = await response.text()

            let data = null


            if (text) {

                try {
                    data = JSON.parse(text)
                } catch {
                    data = text
                }

            }


            // ==================================
            // HANDLE ERROR
            // ==================================

            if (!response.ok) {

                if (typeof data === 'string') {
                    throw new Error(data)
                }

                throw new Error(
                    data?.message ||
                    `Failed to load students (${response.status})`
                )
            }


            // ==================================
            // SET STUDENTS
            // ==================================

            if (Array.isArray(data)) {
                setStudents(data)
            } else {
                setStudents([])
            }

        } catch (error) {

            console.error(
                'Dashboard error:',
                error
            )

            setError(error.message)

        } finally {

            setLoading(false)

        }
    }


    // ==========================================
    // STATISTICS
    // ==========================================

    // Total students

    const totalStudents = students.length


    // Total courses

    const totalCourses = new Set(
        students.map(student => student.course)
    ).size


    // Average percentage

    const averagePercentage =
        totalStudents > 0

            ? students.reduce(
            (sum, student) =>
                sum + Number(student.percentage || 0),
            0
        ) / totalStudents

            : 0


    // Top student

    const topStudent =
        totalStudents > 0

            ? students.reduce(
                (top, student) =>

                    Number(student.percentage || 0) >
                    Number(top.percentage || 0)

                        ? student
                        : top
            )

            : null


    // ==========================================
    // GRADE COUNTS
    // ==========================================

    const gradeCounts = {

        'A+': 0,

        'A': 0,

        'B': 0,

        'C': 0,

        'D': 0,

        'F': 0
    }


    students.forEach(student => {

        const grade = student.grade

        if (gradeCounts[grade] !== undefined) {

            gradeCounts[grade]++

        }

    })


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="dashboard-page">

                <h1>
                    Dashboard
                </h1>

                <p>
                    Loading dashboard...
                </p>

            </div>

        )
    }


    // ==========================================
    // DASHBOARD PAGE
    // ==========================================

    return (

        <div className="dashboard-page">


            {/* ==================================
                TITLE
            ================================== */}

            <h1>
                Dashboard
            </h1>


            <p className="dashboard-subtitle">

                Overview of student performance
                and statistics

            </p>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <p className="error-message">

                    {error}

                </p>

            )}


            {!error && (

                <>


                    {/* ==================================
                        STATISTICS CARDS
                    ================================== */}

                    <div className="dashboard-cards">


                        {/* TOTAL STUDENTS */}

                        <div className="dashboard-card">

                            <div className="dashboard-icon">
                                👨‍🎓
                            </div>

                            <div>

                                <h3>
                                    Total Students
                                </h3>

                                <p>
                                    {totalStudents}
                                </p>

                            </div>

                        </div>


                        {/* TOTAL COURSES */}

                        <div className="dashboard-card">

                            <div className="dashboard-icon">
                                📚
                            </div>

                            <div>

                                <h3>
                                    Total Courses
                                </h3>

                                <p>
                                    {totalCourses}
                                </p>

                            </div>

                        </div>


                        {/* AVERAGE PERCENTAGE */}

                        <div className="dashboard-card">

                            <div className="dashboard-icon">
                                📈
                            </div>

                            <div>

                                <h3>
                                    Average Percentage
                                </h3>

                                <p>
                                    {averagePercentage.toFixed(2)}%
                                </p>

                            </div>

                        </div>


                        {/* TOP STUDENT */}

                        <div className="dashboard-card">

                            <div className="dashboard-icon">
                                🏆
                            </div>

                            <div>

                                <h3>
                                    Top Student
                                </h3>


                                <p>

                                    {topStudent
                                        ? topStudent.name
                                        : 'N/A'}

                                </p>


                                {topStudent && (

                                    <small>

                                        {Number(
                                            topStudent.percentage
                                        ).toFixed(2)}%

                                    </small>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        GRADE DISTRIBUTION
                    ================================== */}

                    <div className="grade-section">

                        <h2>
                            Grade Distribution
                        </h2>


                        <div className="grade-cards">


                            {/* A+ */}

                            <div className="grade-card">

                                <h3>
                                    A+
                                </h3>

                                <p>
                                    {gradeCounts['A+']}
                                </p>

                            </div>


                            {/* A */}

                            <div className="grade-card">

                                <h3>
                                    A
                                </h3>

                                <p>
                                    {gradeCounts['A']}
                                </p>

                            </div>


                            {/* B */}

                            <div className="grade-card">

                                <h3>
                                    B
                                </h3>

                                <p>
                                    {gradeCounts['B']}
                                </p>

                            </div>


                            {/* C */}

                            <div className="grade-card">

                                <h3>
                                    C
                                </h3>

                                <p>
                                    {gradeCounts['C']}
                                </p>

                            </div>


                            {/* D */}

                            <div className="grade-card">

                                <h3>
                                    D
                                </h3>

                                <p>
                                    {gradeCounts['D']}
                                </p>

                            </div>


                            {/* F */}

                            <div className="grade-card">

                                <h3>
                                    F
                                </h3>

                                <p>
                                    {gradeCounts['F']}
                                </p>

                            </div>


                        </div>

                    </div>


                    {/* ==================================
                        STUDENT SUMMARY
                    ================================== */}

                    <div className="dashboard-summary">

                        <h2>
                            Student Summary
                        </h2>


                        <p>
                            Currently managing{' '}
                            <strong>
                                {totalStudents}
                            </strong>{' '}
                            students across{' '}
                            <strong>
                                {totalCourses}
                            </strong>{' '}
                            courses.
                        </p>


                        {topStudent && (

                            <p>

                                Highest performing student:{' '}

                                <strong>
                                    {topStudent.name}
                                </strong>

                                {' '}with{' '}

                                <strong>
                                    {Number(
                                        topStudent.percentage
                                    ).toFixed(2)}%
                                </strong>

                            </p>

                        )}

                    </div>


                </>

            )}

        </div>

    )
}

export default Dashboard