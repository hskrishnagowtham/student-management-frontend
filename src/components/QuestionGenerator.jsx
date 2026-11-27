
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./QuestionGenerator.css";

const API_BASE_URL =
    "https://studentmanagementsystem-0xvp.onrender.com";

function QuestionGenerator() {
    const [topic, setTopic] = useState("");
    const [questions, setQuestions] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateQuestions = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic.");
            return;
        }

        setLoading(true);
        setError("");
        setQuestions("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "Your session may have expired. Please log in again."
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/ai/generate-questions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        topic: topic.trim()
                    })
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(
                    data || "Failed to generate questions."
                );
            }

            if (!data.trim()) {
                throw new Error(
                    "The AI returned an empty response. Please try again."
                );
            }

            setQuestions(data);

        } catch (err) {
            console.error("Question Generator Error:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const clearQuestions = () => {
        setTopic("");
        setQuestions("");
        setError("");
    };

    return (
        <div className="question-generator">

            <h2>AI Question Generator</h2>

            <p>
                Enter a topic and let AI generate practice questions
                for your learning.
            </p>

            <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g. Java Collections)"
                disabled={loading}
            />

            <button
                onClick={generateQuestions}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Questions"}
            </button>

            <button
                onClick={clearQuestions}
                disabled={loading}
            >
                Clear
            </button>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {loading && (
                <p>
                    Please wait. AI is generating your questions...
                </p>
            )}

            {questions && (
                <div className="generated-questions">
                    <h3>Generated Questions</h3>

                    <ReactMarkdown>
                        {questions}
                    </ReactMarkdown>
                </div>
            )}

        </div>
    );
}

export default QuestionGenerator;
