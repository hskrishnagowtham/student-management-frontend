
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./AIAssistant.css";

function AIAssistant() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const clearChat = () => {
        setQuestion("");
        setAnswer("");
    };

    const askQuestion = async () => {
        if (!question.trim()) {
            alert("Please enter a question");
            return;
        }

        setLoading(true);
        setAnswer("");

        try {
            const response = await fetch("/ai/student-assistant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ prompt: question })
            });

            if (!response.ok) {
                const errorMessage = await response.text();

                if (response.status === 429) {
                    throw new Error(
                        "AI request limit reached. Please try again later."
                    );
                }

                if (response.status === 503) {
                    throw new Error(
                        "AI service is temporarily busy. Please try again later."
                    );
                }

                if (response.status === 401 || response.status === 403) {
                    throw new Error(
                        "Your session may have expired. Please log in again."
                    );
                }

                throw new Error(errorMessage || "Failed to get AI response.");
            }

            const data = await response.text();
            setAnswer(data);

        } catch (error) {
            setAnswer(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-assistant">
            <h2>AI Student Assistant</h2>

            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask your academic question..."
                rows="4"
            />

            <br />

            <button onClick={askQuestion} disabled={loading}>
                {loading ? "Thinking..." : "Ask AI"}
            </button>

            <button onClick={clearChat} disabled={loading}>
                Clear Chat
            </button>

            {answer && (
                <div className="ai-answer">
                    <h3>AI Answer</h3>

                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {answer}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export default AIAssistant;
