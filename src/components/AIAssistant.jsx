
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./AIAssistant.css";

const API_URL = "https://studentmanagementsystem-0xvp.onrender.com";

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

        const token = localStorage.getItem("token");

        if (!token) {
            setAnswer("Your session may have expired. Please log in again.");
            return;
        }

        setLoading(true);
        setAnswer("");

        try {
            const response = await fetch(
                `${API_URL}/ai/student-assistant`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        "Accept": "text/plain"
                    },
                    body: JSON.stringify({
                        prompt: question.trim()
                    })
                }
            );

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

                throw new Error(
                    errorMessage || `Failed to get AI response (${response.status}).`
                );
            }

            const data = await response.text();

            if (!data.trim()) {
                throw new Error("AI returned an empty response. Please try again.");
            }

            setAnswer(data);

        } catch (error) {
            console.error("AI Assistant error:", error);
            setAnswer(
                error.message || "Something went wrong. Please try again."
            );
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
                disabled={loading}
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
