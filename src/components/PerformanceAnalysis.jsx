
import React, { useState } from "react";

const API_BASE_URL =
    "https://studentmanagementsystem-0xvp.onrender.com";

function PerformanceAnalysis() {
    const [report, setReport] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyzePerformance = async () => {
        setLoading(true);
        setError("");
        setReport("");

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Your session may have expired. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/ai/performance`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(
                    responseText || `Request failed: ${response.status}`
                );
            }

            setReport(responseText);
        } catch (err) {
            console.error("Performance Analysis Error:", err);
            setError(
                err.message || "Unable to analyze performance. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>AI Performance Analysis</h2>

            <p>
                Get AI feedback based on your academic performance.
            </p>

            <button
                onClick={analyzePerformance}
                disabled={loading}
                style={styles.button}
            >
                {loading ? "Analyzing..." : "Analyze My Performance"}
            </button>

            <div style={styles.reportContainer}>
                <h3>Performance Report</h3>

                {loading && <p>AI is analyzing your performance. Please wait...</p>}

                {error && (
                    <p style={styles.error}>
                        {error}
                    </p>
                )}

                {report && (
                    <div style={styles.report}>
                        {report}
                    </div>
                )}

                {!loading && !error && !report && (
                    <p>Your performance report will appear here.</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "900px",
        margin: "30px auto",
        padding: "25px",
        fontFamily: "Arial, sans-serif",
    },

    button: {
        backgroundColor: "#2563eb",
        color: "white",
        padding: "12px 24px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "15px",
    },

    reportContainer: {
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        border: "1px solid #ddd",
    },

    report: {
        whiteSpace: "pre-wrap",
        lineHeight: "1.7",
        color: "#222",
    },

    error: {
        color: "red",
        whiteSpace: "pre-wrap",
    },
};

export default PerformanceAnalysis;
