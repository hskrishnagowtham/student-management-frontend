
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./LearningRecommendations.css";


function LearningRecommendations() {
    const [recommendations, setRecommendations] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getRecommendations = async () => {
        setLoading(true);
        setError("");
        setRecommendations("");

        try {
            const response = await fetch("/ai/learning-recommendations", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(
                    message || "Failed to load learning recommendations."
                );
            }

            const data = await response.text();
            const cleanedData = data
                .replace(/\\<br\s*\/?>/gi, "\n")
                .replace(/<br\s*\/?>/gi, "\n");

            setRecommendations(cleanedData);

        } catch (err) {
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
