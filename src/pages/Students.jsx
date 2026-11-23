
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Get logged-in user's role
    const role = localStorage.getItem("role");
    const isAdmin = role === "ADMIN";

    useEffect(() => {
        fetchStudents();
    }, []);

    // Fetch students
    const fetchStudents = async (isRefresh = false) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            setLoading(false);
            return;
        }

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const response = await fetch("/students", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "application/json"
                }
            });

            const text = await response.text();
            let data = null;

            if (text) {
                try {
                    data = JSON.parse(text);
                } catch {
                    data = text;
                }
            }

            if (!response.ok) {
                throw new Error(
                    typeof data === "string"
                        ? data
                        : data?.message ||
                        `Failed to load students (${response.status})`
                );
            }

            setStudents(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error("Fetch students error:", error);
            setError(error.message || "Failed to load students.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Search students
    const filteredStudents = students.filter((student) => {
        const search = searchTerm.toLowerCase().trim();

        return (
            String(student.rollNumber ?? "").toLowerCase().includes(search) ||
            String(student.name ?? "").toLowerCase().includes(search) ||
            String(student.course ?? "").toLowerCase().includes(search) ||
            String(student.year ?? "").toLowerCase().includes(search)
        );
    });

    // Loading screen
    if (loading) {
        return (
            <div className="students-page">
                <div className="page-loading">
                    <div className="loading-spinner">⏳</div>
                    <h2>Loading Students...</h2>
                    <p>Please wait while we fetch student records.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="students-page">

            {/* Page Header */}
            <div className="students-header">
                <div>
                    <h1>Students</h1>
                    <p className="students-subtitle">
                        Manage and view all student records
                    </p>
                </div>

                <div className="students-header-actions">

                    <button
                        className="refresh-btn"
                        onClick={() => fetchStudents(true)}
                        disabled={refreshing}
                    >
                        {refreshing ? "Refreshing..." : "↻ Refresh"}
                    </button>

                    {isAdmin && (
                        <Link to="/students/add">
                            <button className="primary-btn">
                                + Add Student
                            </button>
                        </Link>
                    )}

                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="students-error">
                    <strong>Error: </strong>
                    {error}

                    <button
                        onClick={() => fetchStudents()}
                        className="retry-btn"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Statistics and Search */}
            {!error && (
                <div className="students-info-bar">

                    <div>
                        <span className="info-label">Total Students</span>
                        <strong className="info-value">
                            {students.length}
                        </strong>
                    </div>

                    <div>
                        <span className="info-label">Showing</span>
                        <strong className="info-value">
                            {filteredStudents.length}
                        </strong>
                    </div>

                    <div className="students-search">
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            className="search-input"
                        />

                        {searchTerm && (
                            <button
                                className="clear-search-btn"
                                onClick={() => setSearchTerm("")}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                </div>
            )}

            {/* No Students */}
            {!error && students.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">👨‍🎓</div>
                    <h2>No Students Found</h2>
                    <p>There are currently no students in the system.</p>

                    {isAdmin && (
                        <Link to="/students/add">
                            <button className="primary-btn">
                                Add Your First Student
                            </button>
                        </Link>
                    )}
                </div>
            )}

            {/* Students Table */}
            {!error && filteredStudents.length > 0 && (
                <div className="students-table-container">

                    <table className="students-table">

                        <thead>
                        <tr>
                            <th>Roll Number</th>
                            <th>Name</th>
                            <th>Year</th>
                            <th>Semester</th>
                            <th>Course</th>
                            <th>Total Marks</th>
                            <th>Percentage</th>
                            <th>Grade</th>
                            {isAdmin && <th>Action</th>}
                        </tr>
                        </thead>

                        <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.rollNumber}>

                                <td>
                                    <strong>{student.rollNumber}</strong>
                                </td>

                                <td>{student.name}</td>
                                <td>{student.year}</td>
                                <td>{student.semester}</td>
                                <td>{student.course}</td>
                                <td>{student.totalMarks}</td>

                                <td>
                                    {Number(
                                        student.percentage || 0
                                    ).toFixed(2)}%
                                </td>

                                <td>
                                        <span
                                            className={`grade-badge grade-${(
                                                student.grade || ""
                                            )
                                                .replace("+", "plus")
                                                .toLowerCase()}`}
                                        >
                                            {student.grade}
                                        </span>
                                </td>

                                {isAdmin && (
                                    <td>
                                        <div className="action-buttons">

                                            <Link
                                                to={`/students/update/${student.rollNumber}`}
                                            >
                                                <button className="update-btn">
                                                    Update
                                                </button>
                                            </Link>

                                            <Link
                                                to={`/students/delete/${student.rollNumber}`}
                                            >
                                                <button className="delete-btn">
                                                    Delete
                                                </button>
                                            </Link>

                                        </div>
                                    </td>
                                )}

                            </tr>
                        ))}
                        </tbody>

                    </table>
                </div>
            )}

            {/* No Search Results */}
            {!error &&
                students.length > 0 &&
                filteredStudents.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h2>No Matching Students</h2>

                        <p>
                            No students match your search for
                            <strong> "{searchTerm}"</strong>
                        </p>

                        <button
                            className="secondary-btn"
                            onClick={() => setSearchTerm("")}
                        >
                            Clear Search
                        </button>
                    </div>
                )}

        </div>
    );
}

export default Students;
