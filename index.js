// Get elements
const burger = document.getElementById("burger");
const navList = document.querySelector("header nav ul");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const ContinueQuiz = document.getElementById("ContinueQuiz");
const ExitQuiz = document.getElementById("ExitQuiz");
const Quiz = document.getElementById("quiz");
const MainContent = document.getElementById("mainContent");
const QuizContent = document.getElementById("QuizContent");
const quizIdeas = document.getElementById("quiz-ideas");
const SartQuiz = document.getElementById("GoToQuiz");
const countQuestion = document.getElementById("count-question");
const totalNumQue = document.getElementById("tol-num-que");
const questionNumber = document.getElementById("question-number");
const questionTitle = document.getElementById("question");
const answerLabel = document.querySelectorAll(".answer-label");
const nextQuestion = document.getElementById("next-question-btn");
const AllInputs = document.querySelectorAll("input[type='radio']");
const submitQuiz = document.getElementById("submit");
const resultShow = document.getElementById("result");
const Reload = document.getElementById("Reload");
const correctAnswersEl = document.getElementById("correct-answers");
const wrongAnswersEl = document.getElementById("wrong-answers");
const timeTakenEl = document.getElementById("time-taken");
const timerEl = document.getElementById('timer');  // Make sure there's a timer element in HTML

// Initialize state variables
let currentQtn = 0;
let answeredQtn = 0;
let wrongQtn = 0;
let data;
let timeLeft = 10;
let countdownInterval;
let quizStarted = false;  // Flag to track if quiz has started
let quizStartTime; // Variable to track the start time of the quiz
let totalTimeTaken = 0; // Variable to accumulate total time taken for the quiz

// Timer function that handles countdown per question
// Timer function that handles countdown per question
// Timer function that handles countdown per question
function startTimer() {
    if (!quizStarted) return;  // Ensure timer starts only after quiz begins

    // Reset the timer for the current question
    timeLeft = 10; 
    timerEl.textContent = `00:${String(timeLeft).padStart(2, '0')}`; // Display 00:10

    // Clear any existing timer intervals to prevent overlapping
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `00:${String(timeLeft).padStart(2, '0')}`; // Update timer

        if (timeLeft <= 0) {
            clearInterval(countdownInterval); // Stop the timer when it hits 0
            goToNextQuestion(); // Automatically go to next question when time is up
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdownInterval);  // Stop the timer
    countdownInterval = null;  // Reset the interval variable
}

// Go to the next question logic
function goToNextQuestion() {
    let selectedAnswer = getSelected(); // Get the selected answer

    if (selectedAnswer !== null) {
        // Check if the selected answer is correct
        if (selectedAnswer === data[currentQtn].correct_answer) {
            answeredQtn++; // Increment correct answers count
        } else {
            wrongQtn++; // Increment wrong answers count
        }
    }

    currentQtn++; // Move to the next question
    if (currentQtn < data.length) {
        loadQuiz(data); // Load the next question
        startTimer(); // Restart timer for next question
    } else {
        showResults(); // End the quiz if all questions are answered
    }
}
// Function to load quiz data from JSON
function getData() {
    let myreq = new XMLHttpRequest();
    myreq.onreadystatechange = function () {
        if (myreq.readyState === 4) {
            if (myreq.status === 200) {
                data = JSON.parse(this.responseText);
                loadQuiz(data); // Load the quiz after getting the data
            } else {
                console.error("Error loading data:", myreq.statusText);
            }
        }
    };
    myreq.open("GET", "data.json", true);
    myreq.send();
}

// Call getData to load the quiz questions
getData();

// Load quiz content dynamically
const loadQuiz = (loadedData) => {
    data = loadedData;
    countQuestion.innerHTML = `${currentQtn + 1}`;
    questionNumber.innerHTML = `${currentQtn + 1}`;
    questionTitle.innerHTML = data[currentQtn].question;
    answerLabel[0].innerHTML = data[currentQtn].answers[0];
    answerLabel[1].innerHTML = data[currentQtn].answers[1];
    answerLabel[2].innerHTML = data[currentQtn].answers[2];
    answerLabel[3].innerHTML = data[currentQtn].answers[3];

    // Remove the correct answer from the labels to prevent displaying it to the user
    AllInputs.forEach(input => input.checked = false);  // Deselect all answers

    if (currentQtn < data.length - 1) {
        nextQuestion.style.display = "block";
        submitQuiz.style.display = "none";
    } else {
        nextQuestion.style.display = "none";
        submitQuiz.style.display = "block";
    }
};

// Get the selected answer
const getSelected = () => {
    let answer = null;
    AllInputs.forEach((input) => {
        if (input.checked) {
            answer = input.value;
        }
    });
    return answer;
};

// Event listener for next question button
nextQuestion.addEventListener("click", () => {
    goToNextQuestion();
});

// Event listener for submit quiz button
submitQuiz.addEventListener("click", () => {
    let selectedAnswer = getSelected();
    if (selectedAnswer !== null) {
        // Check if the selected answer is correct
        if (selectedAnswer === data[currentQtn].correct_answer) {
            answeredQtn++; // Increment correct answers count
        } else {
            wrongQtn++; // Increment wrong answers count
        }
    }

    stopTimer(); // Stop the timer when quiz is submitted
    showResults(); // Show the results at the end of the quiz
});

function showResults() {
    Quiz.classList.remove("show");
    resultShow.style.display = "flex"; // Display results

    // Calculate total time taken (in seconds)
    const quizEndTime = new Date();
    totalTimeTaken = Math.floor((quizEndTime - quizStartTime) / 1000); // Convert to seconds

    const totalQuestions = data.length;
    const wrongAnswers = totalQuestions - answeredQtn;

    correctAnswersEl.textContent = `✅ Correct Answers: ${answeredQtn}`;
    wrongAnswersEl.textContent = `❌ Wrong Answers: ${wrongAnswers}`;
    timeTakenEl.textContent = `⏱️ Time Taken: ${totalTimeTaken}s`; // Display actual time taken
}


// Restart quiz function
function restartQuiz() {
    currentQtn = 0;
    answeredQtn = 0;
    wrongQtn = 0;
    quizStarted = false;  // Reset the quiz start flag
    quizIdeas.classList.remove("hide");
    QuizContent.classList.remove("show");
    resultShow.style.display = "none";
    Quiz.classList.add("show");

    loadQuiz(data); // Load first question
    stopTimer();  // Stop any ongoing timers
}

// Restart quiz when Reload button is clicked
Reload.onclick = () => {
    restartQuiz();
    window.scrollTo({ top: 0, behavior: "smooth" });
};



// Burger menu toggle
burger.addEventListener("click", () => {
    navList.classList.toggle("show");
});

// Open Modal logic
openModalBtn.addEventListener("click", () => {
    modal.classList.add("show");

    ExitQuiz.onclick = () => {
        modal.classList.remove("show");
    };

    ContinueQuiz.onclick = () => {
        modal.classList.remove("show");
        MainContent.style.display = "none";
        Quiz.classList.add("show");
        quizStarted = true;  // Mark that quiz has started
        quizStartTime = new Date(); // Record the time the quiz starts
        startTimer();  // Start the timer when the quiz begins
    };
});

// Close modal logic
closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
});

// Close modal when clicking outside the modal-content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


// Start quiz when Go to Quiz button is clicked
SartQuiz.onclick = () => {
    quizIdeas.classList.add("hide");
    QuizContent.classList.add("show");
    quizStarted = true;  // Mark that quiz has started
    quizStartTime = new Date(); // Record the time the quiz starts
    startTimer();  // Start the timer when quiz begins
};
