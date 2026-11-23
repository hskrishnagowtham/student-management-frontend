
import { useState } from "react";

function AIAssistant() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const askQuestion = async () => {
        if (!question.trim()) {
            alert("Please enter a question");
            return;
        }

        setLoading(true);
        setAnswer("");

        try {
            const response = await fetch(
                "/ai/student-assistant",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ prompt: question })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to get AI response");
            }

            const data = await response.text();
            setAnswer(data);

        } catch (error) {
            setAnswer("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
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

            {answer && (
                <div>
                    <h3>AI Answer</h3>
                    <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>
                </div>
            )}
        </div>
    );
}

export default AIAssistant;
