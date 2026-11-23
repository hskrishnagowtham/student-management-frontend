
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import "./QuestionGenerator.css";

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
            const response = await fetch("/ai/generate-questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ topic: topic.trim() })
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(
                    message || "Failed to generate questions."
                );
            }

            const data = await response.text();
            setQuestions(data);

        } catch (err) {
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
                <p>Please wait. AI is generating your questions...</p>
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
