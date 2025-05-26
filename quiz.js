// Import from questions.js (must be included before this script)
let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let username = ''; // username made global so it can be used in showResults()

const startForm = document.getElementById('start-form');
const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz-container');

// Handle start
startForm.addEventListener('submit', function (e) {
  e.preventDefault();
  username = document.getElementById('username').value.trim();
  if (!username) return;

  // Shuffle and pick 20 questions
  selectedQuestions = shuffleArray([...questions]).slice(0, 20);
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];

  startScreen.classList.add('hidden');
  quizContainer.classList.remove('hidden');

  renderQuestion();
});

// Shuffle helper
function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Render current question
function renderQuestion() {
  const q = selectedQuestions[currentQuestionIndex];
  quizContainer.innerHTML = `
    <div>
      <h2 class="text-2xl font-bold mb-4">Question ${currentQuestionIndex + 1}/20</h2>
      <p class="text-lg mb-4 font-medium">${q.question}</p>
      <form id="question-form" class="grid gap-3 mb-6">
        ${q.options
          .map(
            (opt, idx) => `
          <label class="flex items-center space-x-3 border p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition">
            <input type="radio" name="answer" value="${opt}" class="form-radio accent-blue-600" required />
            <span>${opt}</span>
          </label>`
          )
          .join('')}
        <button type="submit" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl">
          ${currentQuestionIndex < 19 ? 'Next' : 'Submit'}
        </button>
      </form>
    </div>
  `;

  document.getElementById('question-form').addEventListener('submit', handleAnswerSubmit);
}

// Handle answer and go to next
function handleAnswerSubmit(e) {
  e.preventDefault();
  const selected = e.target.answer.value;
  const current = selectedQuestions[currentQuestionIndex];

  userAnswers.push({ question: current, selected });

  if (selected === current.correct) score++;

  currentQuestionIndex++;
  if (currentQuestionIndex < 20) {
    renderQuestion();
  } else {
    showResults();
  }
}

/// Show results
function showResults() {
  quizContainer.innerHTML = `
    <div class="text-center">
      <h2 class="text-3xl font-bold text-green-600 mb-4">Quiz Completed, ${username}!</h2>
      <p class="text-xl mb-6">You scored <span class="font-semibold">${score}</span> out of 20</p>
      <canvas id="resultsChart" class="mb-8 max-w-md mx-auto"></canvas>
      <button
        class="bg-gray-700 text-white py-2 px-6 rounded-xl hover:bg-gray-800 transition"
        onclick="showAnswers()"
      >
        Show Correct Answers
      </button>
    </div>
  `;

  // Prettier chart
  const ctx = document.getElementById('resultsChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Correct', 'Incorrect'],
      datasets: [{
        data: [score, 20 - score],
        backgroundColor: ['#60A5FA', '#F87171'], // Blue & red pastel
        borderRadius: 8,
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Your Quiz Results',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: {
              size: 14
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: {
              size: 14
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}


  // Chart
  const ctx = document.getElementById('resultsChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Correct', 'Incorrect'],
      datasets: [
        {
          label: 'Your Results',
          data: [score, 20 - score],
          backgroundColor: ['#4CAF50', '#F44336']
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });

// Show answers with badges
function showAnswers() {
  quizContainer.innerHTML = `
    <h2 class="text-2xl font-bold mb-6 text-center">Review Answers</h2>
    <div class="space-y-6">
      ${userAnswers
        .map((entry, idx) => {
          const correct = entry.question.correct;
          const isCorrect = entry.selected === correct;
          return `
          <div class="p-4 border rounded-xl ${
            isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
          }">
            <p class="font-medium mb-2">Q${idx + 1}: ${entry.question.question}</p>
            <p>Your Answer: <span class="font-semibold">${entry.selected}</span></p>
            <p>Correct Answer: 
              <span class="inline-block ml-1 px-2 py-1 rounded-full text-xs font-bold ${
                isCorrect ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
              }">
                ${correct}
              </span>
            </p>
          </div>
        `;
        })
        .join('')}
    </div>
    <div class="text-center mt-8">
      <button onclick="location.reload()" class="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
        Restart Quiz
      </button>
    </div>
  `;
}
