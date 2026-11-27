
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./LearningRecommendations.css";

const API_BASE_URL = "https://studentmanagementsystem-0xvp.onrender.com";

function LearningRecommendations() {
    const [recommendations, setRecommendations] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getRecommendations = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Your session may have expired. Please log in again.");
            return;
        }

        setLoading(true);
        setError("");
        setRecommendations("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/ai/learning-recommendations`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(
                    data || `Request failed: ${response.status}`
                );
            }

            if (!data.trim()) {
                throw new Error("No learning recommendations were returned.");
            }

            const cleanedData = data
                .replace(/\\<br\s*\/?>/gi, "\n")
                .replace(/<br\s*\/?>/gi, "\n");

            setRecommendations(cleanedData);

        } catch (err) {
            console.error("Learning Recommendations Error:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="learning-recommendations">
            <h2>AI Learning Recommendations</h2>

            <p>
                Get personalized learning suggestions based on your
                academic performance.
            </p>

            <button
                onClick={getRecommendations}
                disabled={loading}
            >
                {loading ? "Generating..." : "Get Learning Recommendations"}
            </button>

            {error && (
                <p className="error-message">{error}</p>
            )}

            {recommendations && (
                <div className="recommendations-result">
                    <h3>Your Learning Plan</h3>

                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {recommendations}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export default LearningRecommendations;
