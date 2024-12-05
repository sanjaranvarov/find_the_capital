// Initialize variables
let countries = [];
let selectedCountries = [];
let currentQuestionIndex = 0;
let timerId;
let score = 0;

// Function to disable option buttons
const disableButtons = () => {
    const buttons = document.querySelectorAll('#optionsContainer button');
    buttons.forEach(button => {
        button.disabled = true;
    });
};

// Function to reset the timer
const resetTimer = () => {
    clearInterval(timerId);
    let timeLeft = 15;
    document.getElementById('timer').innerText = `TIME: ${timeLeft}`;

    // Start a countdown timer
    timerId = setInterval(() => {
        timeLeft -= 1;
        document.getElementById('timer').innerText = `TIME: ${timeLeft}`;

        // When time is up, display a message and disable buttons
        if (timeLeft <= 0) {
            clearInterval(timerId);
            document.getElementById('result').innerText = 'TIME IS OVER!';
            disableButtons();
            setTimeout(displayQuestion, 2000);
        }
    }, 1000);
};

// Function to update the player's score
const updateScore = () => {
    document.getElementById('score').innerText = `BALL: ${score} / 10`;
};

// Fetch a list of countries from a REST API
fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        countries = data;
        selectedCountries = countries.sort(() => Math.random() - 0.5).slice(0, 10);
        document.getElementById("startGame").disabled = false;
    })
    .catch(error => {
        console.error('Error fetching countries:', error);
    });

// Function to display a question
const displayQuestion = () => {
    resetTimer();
    document.getElementById('result').innerText = '';

    if (currentQuestionIndex >= selectedCountries.length) {
        document.getElementById('result').innerText = 'GAME OVER!';
        clearInterval(timerId);

        document.getElementById('endMessage').innerText = getEndMessage(score);

        // Save results to localStorage
        localStorage.setItem('gameResults', JSON.stringify({ score, totalQuestions: 10 }));

        // Open results page
        setTimeout(() => window.open('results.html', '_blank'), 2000);
        document.getElementById('restartGame').disabled = false;
        return;
    }

    const questionCountry = selectedCountries[currentQuestionIndex];
    let otherOptions = countries.filter(country => country !== questionCountry);
    otherOptions = otherOptions.sort(() => Math.random() - 0.5).slice(0, 3);

    const options = [questionCountry, ...otherOptions].sort(() => Math.random() - 0.5);

    document.getElementById('questionContainer').innerText =
        `Question ${currentQuestionIndex + 1}: What is the capital of ${questionCountry.name.common}?`;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.capital?.[0] || 'No capital';
        button.onclick = () => checkAnswer(button, option.capital?.[0], questionCountry.capital?.[0]);
        optionsContainer.appendChild(button);
    });
};

// Function to get end-game message
const getEndMessage = (score) => {
    if (score === 10) {
        return 'YOU ARE A GENIUS!';
    } else if (score >= 7) {
        return 'GREAT JOB!';
    } else if (score >= 4) {
        return 'YOU CAN DO BETTER.';
    } else {
        return 'TRY HARDER NEXT TIME.';
    }
};

// Function to check the selected answer
const checkAnswer = (button, selectedCapital, correctCapital) => {
    clearInterval(timerId);
    disableButtons();

    if (selectedCapital === correctCapital) {
        button.style.backgroundColor = 'green';
        document.getElementById('result').innerText = 'GOOD JOB!';
        score++;
        updateScore();
    } else {
        button.style.backgroundColor = 'red';
        document.getElementById('result').innerText = `WRONG! CORRECT ANSWER: ${correctCapital}`;
    }

    currentQuestionIndex++;
    setTimeout(displayQuestion, 2000);
};

// Start game button event listener
document.getElementById('startGame').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    updateScore();
    displayQuestion();
    document.getElementById('startGame').disabled = true;
    document.getElementById('restartGame').disabled = false;
});

// Restart game button event listener
document.getElementById('restartGame').addEventListener('click', () => {
    location.reload();
});

// Dark mode toggle button event listener
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    themeToggle.innerText = document.documentElement.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});
