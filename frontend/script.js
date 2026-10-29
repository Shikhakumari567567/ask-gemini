const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("question");
const submitBtn = document.getElementById("submitBtn");
const statusText = document.getElementById("status");
const answerSection = document.getElementById("answerSection");
const answerText = document.getElementById("answer");

questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (!question) {
    statusText.textContent = "Please enter a question.";
    return;
  }

  submitBtn.disabled = true;
  statusText.textContent = "Generating answer...";
  answerSection.hidden = true;

  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    answerText.textContent = data.answer;
    answerSection.hidden = false;
    statusText.textContent = "Answer generated successfully!";
  } catch (error) {
    statusText.textContent = error.message;
  } finally {
    submitBtn.disabled = false;
  }
});

