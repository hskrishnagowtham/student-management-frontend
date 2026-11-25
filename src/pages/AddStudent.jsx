
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddStudent() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        rollNumber: '',
        name: '',
        year: '',
        semester: '',
        course: '',
        totalMarks: '',
        maximumMarks: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // HANDLE INPUT CHANGE
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setError('');
        setMessage('');
    };

    // HANDLE SUBMIT
    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage('');
        setError('');

        const token = localStorage.getItem('token');

        if (!token) {
            setError('Please login first.');
            return;
        }

        // VALIDATION
        if (!formData.rollNumber) {
            setError('Please enter the roll number.');
            return;
        }

        if (!formData.name.trim()) {
            setError('Please enter the student name.');
            return;
        }

        if (!formData.year || !formData.semester) {
            setError('Please enter the year and semester.');
            return;
        }

        if (!formData.course.trim()) {
            setError('Please enter the course.');
            return;
        }

        if (formData.totalMarks === '' || formData.maximumMarks === '') {
            setError('Please enter both total marks and maximum marks.');
            return;
        }

        const totalMarks = Number(formData.totalMarks);
        const maximumMarks = Number(formData.maximumMarks);

        if (!Number.isInteger(totalMarks) || totalMarks < 0) {
            setError('Total marks must be a non-negative whole number.');
            return;
        }

        if (!Number.isInteger(maximumMarks) || maximumMarks <= 0) {
            setError('Maximum marks must be a positive whole number.');
            return;
        }

        if (totalMarks > maximumMarks) {
            setError('Total marks cannot exceed maximum marks.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                'https://studentmanagementsystem-0xvp.onrender.com/students',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
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
                }
            );

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
                    typeof data === 'string'
                        ? data
                        : data?.message ||
                        `Failed to add student (${response.status})`
                );
            }

            // Prevent HTML or unexpected responses from showing false success
            if (typeof data === 'string') {
                throw new Error(
                    'Unexpected response from backend. Student was not confirmed as saved.'
                );
            }

            setMessage('Student added successfully!');

            setFormData({
                rollNumber: '',
                name: '',
                year: '',
                semester: '',
                course: '',
                totalMarks: '',
                maximumMarks: ''
            });

        } catch (error) {
            console.error('Add student error:', error);
            setError(error.message || 'Failed to add student.');
        } finally {
            setLoading(false);
        }
    };

    // BACK TO STUDENTS
    const handleBack = () => {
        navigate('/students');
    };

    return (
        <div className="student-form-page">
            <div className="student-form-card">

                <div className="student-form-header">
                    <div className="student-form-icon">👨‍🎓</div>
                    <h1>Add Student</h1>
                    <p>
                        Enter the student's academic information below.
                    </p>
                </div>

                {message && (
                    <div className="form-success">
                        ✅ {message}
                    </div>
                )}

                {error && (
                    <div className="form-error">
                        ❌ {error}
                    </div>
                )}

                <form
                    className="student-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-field">
                        <label htmlFor="rollNumber">Roll Number</label>
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

                    <div className="form-field">
                        <label htmlFor="name">Student Name</label>
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

                    <div className="form-field">
                        <label htmlFor="year">Year</label>
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

                    <div className="form-field">
                        <label htmlFor="semester">Semester</label>
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

                    <div className="form-field">
                        <label htmlFor="course">Course</label>
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

                    <div className="form-field">
                        <label htmlFor="totalMarks">Total Marks</label>
                        <input
                            id="totalMarks"
                            type="number"
                            name="totalMarks"
                            placeholder="Enter obtained marks"
                            value={formData.totalMarks}
                            onChange={handleChange}
                            disabled={loading}
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
                            disabled={loading}
                            min="1"
                            required
                        />
                    </div>

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
                            {loading ? 'Adding Student...' : 'Add Student'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddStudent;
