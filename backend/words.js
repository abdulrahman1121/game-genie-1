const readline = require('readline');

const wordList = [
    'apple', 'brave', 'crane', 'dream', 'eagle',
    'flame', 'grape', 'house', 'image', 'jolly',
    'knock', 'lemon', 'mango', 'noble', 'ocean',
    'piano', 'quiet', 'river', 'smile', 'tiger',
    'unity', 'vivid', 'waste', 'xenon', 'yacht',
    'notes', 'zebra', 'apple', 'berry', 'charm',
];

function getRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function isValidWord(word) {
    return word.length === 5 && wordList.includes(word.toLowerCase());
}

function evaluateGuess(guess, target) {
    guess = guess.toLowerCase();
    target = target.toLowerCase();
    let result = Array(5).fill('_');
    let targetArr = target.split('');
    let guessArr = guess.split('');
    let used = Array(5).fill(false);

    // First pass: correct positions
    for (let i = 0; i < 5; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i] = guessArr[i].toUpperCase();
            used[i] = true;
            targetArr[i] = null; // Mark as used
        }
    }

    // Second pass: correct letters, wrong positions
    for (let i = 0; i < 5; i++) {
        if (result[i] === '_') {
            let idx = targetArr.indexOf(guessArr[i]);
            if (idx !== -1 && !used[idx]) {
                result[i] = guessArr[i];
                targetArr[idx] = null; // Mark as used
            }
        }
    }

    return result.join('');
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function startGame() {
    const targetWord = getRandomWord();
    let attempts = 0;
    const maxAttempts = 6;

    console.log('Welcome to Wordle! Guess the 5-letter word. You have 6 attempts.');

    function promptGuess() {
        if (attempts >= maxAttempts) {
            console.log(`Game Over! The word was "${targetWord}".`);
            rl.close();
            return;
        }

        rl.question(`Attempt ${attempts + 1}/${maxAttempts}: `, (guess) => {
            guess = guess.trim().toLowerCase();

            attempts++; // 🔥 Count every guess attempt, valid or not

            if (!isValidWord(guess)) {
                console.log('Invalid word! Must be a 5-letter word from the list.');
            } else {
                const feedback = evaluateGuess(guess, targetWord);
                console.log(`Result: ${feedback}`);

                if (guess === targetWord) {
                    console.log(`🎉 Congratulations! You guessed the word "${targetWord}" in ${attempts} attempts!`);
                    rl.close();
                    return;
                }
            }

            // Continue or end game
            if (attempts >= maxAttempts) {
                console.log(`❌ Game Over! The word was "${targetWord}".`);
                rl.close();
                return;
            }

            promptGuess();
        });
    }

    promptGuess();
}

startGame();
