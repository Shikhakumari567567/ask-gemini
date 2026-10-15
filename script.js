const askForm = document.getElementById("askForm");
const questionInput = document.getElementById("question");
const askButton = document.getElementById("askButton");
const answerBox = document.getElementById("answer");

askForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const question = questionInput.value.trim();

    if (!question) {
        answerBox.textContent = "Please enter a question.";
        return;
    }

    askButton.disabled = true;
    askButton.textContent = "Thinking...";
    answerBox.textContent = "Gemini is thinking...";

    try {

        const response = await fetch("/ask", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        answerBox.textContent = data.answer;

    } catch (error) {

        console.error(error);

        answerBox.textContent =
            error.message || "Something went wrong.";

    } finally {

        askButton.disabled = false;
        askButton.textContent = "Ask Gemini";

    }
});
















