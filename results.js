// Run when quiz is submitted
function showResults(userAnswers, selectedQuestions, username) {
  const container = document.getElementById('quiz-container');
  container.innerHTML = ''; // Clear quiz UI

  // Calculate results
  let correctCount = 0;
  const results = selectedQuestions.map((question, index) => {
    const userAnswer = userAnswers[question.id];
    const isCorrect = userAnswer === question.correct;
    if (isCorrect) correctCount++;

    return {
      question: question.question,
      options: question.options,
      correct: question.correct,
      userAnswer,
      isCorrect
    };
  });

  // Create results section
  const resultBlock = document.createElement('div');
  resultBlock.className = 'space-y-6';

  // Greeting
  const greeting = document.createElement('h2');
  greeting.className = 'text-2xl font-bold text-blue-700';
  greeting.textContent = `Great job, ${username}! You scored ${correctCount} / ${selectedQuestions.length}`;
  resultBlock.appendChild(greeting);

  // Chart container
  const chartContainer = document.createElement('div');
  chartContainer.className = 'my-6 max-w-md mx-auto';
  chartContainer.innerHTML = `<canvas id="resultChart"></canvas>`;
  resultBlock.appendChild(chartContainer);

  // Result list
  results.forEach((res, i) => {
    const qBox = document.createElement('div');
    qBox.className = `border p-4 rounded-xl shadow-sm ${
      res.isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
    }`;

    const qTitle = document.createElement('h3');
    qTitle.className = 'font-semibold mb-2';
    qTitle.textContent = `${i + 1}. ${res.question}`;
    qBox.appendChild(qTitle);

    res.options.forEach(option => {
      const optionTag = document.createElement('div');
      optionTag.className = 'flex items-center gap-2 mb-1';

      const badge = document.createElement('span');
      badge.className =
        option === res.correct
          ? 'bg-green-500 text-white px-2 py-1 text-xs rounded-full'
          : option === res.userAnswer
          ? 'bg-red-500 text-white px-2 py-1 text-xs rounded-full'
          : 'bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full';

      badge.textContent =
        option === res.correct
          ? 'Correct Answer'
          : option === res.userAnswer
          ? 'Your Answer'
          : '';

      optionTag.innerHTML = `<span>${option}</span>`;
      if (badge.textContent) optionTag.appendChild(badge);

      qBox.appendChild(optionTag);
    });

    resultBlock.appendChild(qBox);
  });

  // Restart button
  const restartBtn = document.createElement('button');
  restartBtn.textContent = 'Restart Quiz';
  restartBtn.className =
    'block mx-auto mt-10 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition';
  restartBtn.onclick = () => location.reload();
  resultBlock.appendChild(restartBtn);

  container.appendChild(resultBlock);

  // Create the chart
  const ctx = document.getElementById('resultChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Correct', 'Incorrect'],
      datasets: [
        {
          label: 'Answers',
          data: [correctCount, selectedQuestions.length - correctCount],
          backgroundColor: ['#10B981', '#EF4444']
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });
}
