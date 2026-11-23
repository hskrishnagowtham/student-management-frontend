
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import "./PerformanceAnalysis.css";

function PerformanceAnalysis() {
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);

    const analyzePerformance = async () => {
        setLoading(true);
        setAnalysis("");

        try {
            const response = await fetch("/ai/performance", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.text();

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error(
                        "Daily AI request limit reached. Please try again after the quota resets."
                    );
                }

                if (response.status === 503) {
                    throw new Error(
                        "AI service is temporarily busy. Please try again later."
                    );
                }

                throw new Error(data || "Unable to analyze performance.");
            }

            setAnalysis(data);

        } catch (error) {
            setAnalysis(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="performance-analysis">
            <h2>AI Performance Analysis</h2>

            <p>
                Get AI feedback based on your academic performance.
            </p>

            <button
                onClick={analyzePerformance}
                disabled={loading}
            >
                {loading ? "Analyzing..." : "Analyze My Performance"}
            </button>

            {analysis && (
                <div className="analysis-result">
                    <h3>Performance Report</h3>
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export default PerformanceAnalysis;
