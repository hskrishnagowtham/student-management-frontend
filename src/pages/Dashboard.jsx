
import { useEffect, useState } from "react";

function Dashboard() {
    const [student, setStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const role = localStorage.getItem("role");
    const isAdmin = role === "ADMIN";

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first.");
                setLoading(false);
                return;
            }

            try {
                // ADMIN DASHBOARD
                if (isAdmin) {
                    const response = await fetch(
                        "https://studentmanagementsystem-0xvp.onrender.com/students",
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: "application/json"
                            }
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message || "Failed to load students."
                        );
                    }

                    setStudents(Array.isArray(data) ? data : []);
                }

                // USER DASHBOARD
                else {
                    const response = await fetch(
                        "https://studentmanagementsystem-0xvp.onrender.com/students/my-profile",
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: "application/json"
                            }
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message || "Failed to load your profile."
                        );
                    }

                    setStudent(data);
                }

            } catch (err) {
                console.error("Dashboard error:", err);
                setError(err.message || "Failed to load dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [isAdmin]);

    // Loading
    if (loading) {
        return (
            <div className="dashboard-page">
                <h1>Dashboard</h1>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="dashboard-page">
                <h1>Dashboard</h1>

                <div className="error-message">
                    <p>{error}</p>

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            window.location.href = "/login";
                        }}
                    >
                        Login Again
                    </button>
                </div>
            </div>
        );
    }

    // ADMIN DASHBOARD
    if (isAdmin) {
        const totalStudents = students.length;

        const averagePercentage =
            totalStudents > 0
                ? students.reduce(
                (sum, student) =>
                    sum + Number(student.percentage || 0),
                0
            ) / totalStudents
                : 0;

        const gradeAStudents = students.filter(
            student =>
                student.grade === "A" ||
                student.grade === "A+"
        ).length;

        const failedStudents = students.filter(
            student => student.grade === "F"
        ).length;

        return (
            <div className="dashboard-page">

                <h1>Admin Dashboard</h1>

                <p className="dashboard-subtitle">
                    Welcome, Administrator! Here's an overview
                    of student performance.
                </p>

                <div className="dashboard-cards">

                    <div className="dashboard-card">
                        <div className="dashboard-icon">🎓</div>
                        <div>
                            <h3>Total Students</h3>
                            <p>{totalStudents}</p>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-icon">📊</div>
                        <div>
                            <h3>Average Percentage</h3>
                            <p>{averagePercentage.toFixed(2)}%</p>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-icon">🏆</div>
                        <div>
                            <h3>A/A+ Students</h3>
                            <p>{gradeAStudents}</p>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-icon">⚠️</div>
                        <div>
                            <h3>Failed Students</h3>
                            <p>{failedStudents}</p>
                        </div>
                    </div>

                </div>

                <div className="grade-section">
                    <h2>Student Overview</h2>

                    <div className="dashboard-summary">
                        <p>
                            <strong>Total Students:</strong>
                            {" "}{totalStudents}
                        </p>

                        <p>
                            <strong>Average Percentage:</strong>
                            {" "}{averagePercentage.toFixed(2)}%
                        </p>

                        <p>
                            <strong>Students with A/A+:</strong>
                            {" "}{gradeAStudents}
                        </p>

                        <p>
                            <strong>Failed Students:</strong>
                            {" "}{failedStudents}
                        </p>
                    </div>
                </div>

            </div>
        );
    }

    // USER DASHBOARD
    if (!student) {
        return (
            <div className="dashboard-page">
                <h1>Dashboard</h1>
                <p>Student profile not found.</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <h1>My Dashboard</h1>

            <p className="dashboard-subtitle">
                Welcome, {student.name}! Here is your academic overview.
            </p>

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <div className="dashboard-icon">🎓</div>
                    <div>
                        <h3>Roll Number</h3>
                        <p>{student.rollNumber}</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon">📚</div>
                    <div>
                        <h3>Course</h3>
                        <p>{student.course}</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon">📈</div>
                    <div>
                        <h3>Percentage</h3>
                        <p>
                            {Number(student.percentage || 0).toFixed(2)}%
                        </p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon">🏆</div>
                    <div>
                        <h3>Grade</h3>
                        <p>{student.grade}</p>
                    </div>
                </div>

            </div>

            <div className="grade-section">

                <h2>My Academic Details</h2>

                <div className="dashboard-summary">

                    <p>
                        <strong>Name:</strong> {student.name}
                    </p>

                    <p>
                        <strong>Roll Number:</strong> {student.rollNumber}
                    </p>

                    <p>
                        <strong>Year:</strong> {student.year}
                    </p>

                    <p>
                        <strong>Semester:</strong> {student.semester}
                    </p>

                    <p>
                        <strong>Course:</strong> {student.course}
                    </p>

                    <p>
                        <strong>Total Marks:</strong> {student.totalMarks}
                    </p>

                    <p>
                        <strong>Percentage:</strong>
                        {" "}{Number(student.percentage || 0).toFixed(2)}%
                    </p>

                    <p>
                        <strong>Grade:</strong> {student.grade}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
