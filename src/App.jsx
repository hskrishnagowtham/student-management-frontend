
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate,
    Navigate
} from 'react-router-dom';

import './App.css';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Students from './pages/Students.jsx';
import AddStudent from './pages/AddStudent.jsx';
import UpdateStudent from './pages/UpdateStudent.jsx';
import DeleteStudent from './pages/DeleteStudent.jsx';

import AIAssistant from './components/AIAssistant.jsx';
import PerformanceAnalysis from './components/PerformanceAnalysis.jsx';
import QuestionGenerator from './components/QuestionGenerator.jsx';
import LearningRecommendations from './components/LearningRecommendations.jsx';

// ======================================================
// PROTECTED ROUTE
// ======================================================

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// ======================================================
// ADMIN-ONLY ROUTE
// ======================================================

function AdminRoute({ children }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== 'ADMIN') {
        return <Navigate to="/students" replace />;
    }

    return children;
}

// ======================================================
// HOME PAGE
// ======================================================

function Home() {
    const role = localStorage.getItem('role');
    const isAdmin = role === 'ADMIN';

    return (
        <>
            <main>
                <section id="home" className="hero-section">
                    <div className="hero-content">
                        <div className="hero-badge">
                            🎓 Student Management Platform
                        </div>

                        <h1>Student Management System</h1>

                        <p>
                            Manage student records easily with our
                            secure, simple and user-friendly system.
                        </p>

                        <div className="hero-buttons">
                            <Link to="/students">
                                <button className="primary-btn">
                                    View Students
                                </button>
                            </Link>

                            {isAdmin && (
                                <Link to="/students/add">
                                    <button className="secondary-btn">
                                        Add Student
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                <section id="students" className="students-section">
                    <h2>Student Management</h2>

                    <p className="section-subtitle">
                        Everything you need to manage student
                        information in one place.
                    </p>

                    <div className="cards">
                        <div className="card">
                            <div className="card-icon">👨‍🎓</div>
                            <h3>View Students</h3>
                            <p>
                                View all registered students and
                                their academic details.
                            </p>
                            <Link to="/students">
                                <button>View Students</button>
                            </Link>
                        </div>

                        {isAdmin && (
                            <>
                                <div className="card">
                                    <div className="card-icon">➕</div>
                                    <h3>Add Student</h3>
                                    <p>
                                        Add a new student to the management
                                        system.
                                    </p>
                                    <Link to="/students/add">
                                        <button>Add Student</button>
                                    </Link>
                                </div>

                                <div className="card">
                                    <div className="card-icon">✏️</div>
                                    <h3>Update Student</h3>
                                    <p>
                                        Update existing student information
                                        whenever required.
                                    </p>
                                    <Link to="/students">
                                        <button>Update</button>
                                    </Link>
                                </div>

                                <div className="card">
                                    <div className="card-icon">🗑️</div>
                                    <h3>Delete Student</h3>
                                    <p>
                                        Safely remove student records from
                                        the system.
                                    </p>
                                    <Link to="/students">
                                        <button>Delete</button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                <section id="about" className="about-section">
                    <div className="about-content">
                        <h2>About the System</h2>

                        <p>
                            The Student Management System is a
                            full-stack web application designed
                            to manage student academic records.
                        </p>

                        <p>
                            It provides secure authentication,
                            student CRUD operations, academic
                            calculations and a dashboard for
                            viewing important statistics.
                        </p>

                        <div className="about-features">
                            <div>🔐 <strong>Secure Authentication</strong></div>
                            <div>📊 <strong>Student Dashboard</strong></div>
                            <div>📝 <strong>CRUD Operations</strong></div>
                            <div>⚡ <strong>React + Spring Boot</strong></div>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <p>© 2026 Student Management System</p>
                <p className="footer-subtitle">
                    Built with React, Spring Boot and MySQL
                </p>
            </footer>
        </>
    );
}

// ======================================================
// NAVBAR
// ======================================================

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');

        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="navbar-icon">🎓</span>
                <span>Student Management System</span>
            </Link>

            <div className="nav-links">
                <Link to="/">Home</Link>

                {token && (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/students">Students</Link>
                        <Link to="/ai-assistant">AI Assistant</Link>
                        <Link to="/performance-analysis">
                            Performance Analysis
                        </Link>
                        <Link to="/question-generator">
                            Question Generator
                        </Link>
                        <Link to="/learning-recommendations">
                            Learning Recommendations
                        </Link>
                    </>
                )}

                <a href="/#about">About</a>

                {!token && (
                    <>
                        <Link to="/login">
                            <button className="nav-login-btn">Login</button>
                        </Link>

                        <Link to="/register">
                            <button className="nav-register-btn">
                                Register
                            </button>
                        </Link>
                    </>
                )}

                {token && (
                    <button
                        className="nav-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

// ======================================================
// MAIN APPLICATION CONTENT
// ======================================================

function AppContent() {
    return (
        <div className="app">
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/students"
                    element={
                        <ProtectedRoute>
                            <Students />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/students/add"
                    element={
                        <AdminRoute>
                            <AddStudent />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/students/update/:rollNumber"
                    element={
                        <AdminRoute>
                            <UpdateStudent />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/students/delete/:rollNumber"
                    element={
                        <AdminRoute>
                            <DeleteStudent />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/ai-assistant"
                    element={
                        <ProtectedRoute>
                            <AIAssistant />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/performance-analysis"
                    element={
                        <ProtectedRoute>
                            <PerformanceAnalysis />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/question-generator"
                    element={
                        <ProtectedRoute>
                            <QuestionGenerator />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/learning-recommendations"
                    element={
                        <ProtectedRoute>
                            <LearningRecommendations />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

// ======================================================
// APP
// ======================================================

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
