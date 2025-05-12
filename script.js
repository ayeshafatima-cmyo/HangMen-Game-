const words = [
  { word: "javascript", hint: "Programming language for the web" },
  { word: "developer", hint: "One who writes code" },
  { word: "function", hint: "Block of reusable code" },
  { word: "hangman", hint: "Classic word-guessing game" },
  { word: "variable", hint: "Container for data in code" }
];

let selected = null;
let guessedLetters = [];
let wrongGuesses = 0;
let maxWrong = 6;
let score = 0;
let playerName = "";

const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

const wordDisplay = document.getElementById("wordDisplay");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");
const hint = document.getElementById("hint");
const scoreDisplay = document.getElementById("score");
const sparkleContainer = document.getElementById("sparkleContainer");

function drawHangman(step) {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#e74c3c";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (step > 0) ctx.strokeRect(20, 230, 160, 10); // base
  if (step > 1) ctx.strokeRect(50, 20, 10, 210); // post
  if (step > 2) ctx.strokeRect(50, 20, 100, 10); // beam
  if (step > 3) ctx.beginPath(), ctx.moveTo(150, 20), ctx.lineTo(150, 50), ctx.stroke(); // rope
  if (step > 4) ctx.beginPath(), ctx.arc(150, 70, 20, 0, Math.PI * 2), ctx.stroke(); // head
  if (step > 5) {
    ctx.beginPath(); ctx.moveTo(150, 90); ctx.lineTo(150, 140); ctx.stroke(); // body
    ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(130, 120); ctx.stroke(); // left arm
    ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(170, 120); ctx.stroke(); // right arm
    ctx.beginPath(); ctx.moveTo(150, 140); ctx.lineTo(130, 180); ctx.stroke(); // left leg
    ctx.beginPath(); ctx.moveTo(150, 140); ctx.lineTo(170, 180); ctx.stroke(); // right leg
  }
}

function updateWordDisplay() {
  let display = selected.word
    .split("")
    .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
  wordDisplay.textContent = display;

  if (!display.includes("_")) {
    triggerWin();
  }
}

function handleGuess(e) {
  const letter = e.target.textContent.toLowerCase();
  e.target.disabled = true;

  if (selected.word.includes(letter)) {
    guessedLetters.push(letter);
    updateWordDisplay();
  } else {
    wrongGuesses++;
    drawHangman(wrongGuesses);
    if (wrongGuesses >= maxWrong) {
      endGame(false);
    }
  }
}

function setupKeyboard() {
  keyboard.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const btn = document.createElement("button");
    btn.textContent = String.fromCharCode(i);
    btn.addEventListener("click", handleGuess);
    keyboard.appendChild(btn);
  }
}

function triggerWin() {
  score += 10;
  scoreDisplay.textContent = `Score: ${score}`;
  message.textContent = "🎉 Correct! You win!";
  triggerSparkles();
  disableAllButtons();
  resetBtn.style.display = "inline-block";
}

function endGame(win) {
  message.textContent = win
    ? "🎉 Correct! You win!"
    : `💀 ${playerName}, you lost! Word was: ${selected.word}`;
  disableAllButtons();
  resetBtn.style.display = "inline-block";
}

function disableAllButtons() {
  const buttons = keyboard.querySelectorAll("button");
  buttons.forEach(btn => (btn.disabled = true));
}

function resetGame() {
  selected = words[Math.floor(Math.random() * words.length)];
  guessedLetters = [];
  wrongGuesses = 0;
  message.textContent = "";
  hint.textContent = `💡 Hint: ${selected.hint}`;
  drawHangman(0);
  updateWordDisplay();
  setupKeyboard();
  resetBtn.style.display = "none";
}

function triggerSparkles() {
  for (let i = 0; i < 50; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
    sparkleContainer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }
}

document.getElementById("startBtn").addEventListener("click", () => {
  const nameInput = document.getElementById("playerName");
  playerName = nameInput.value.trim();
  if (playerName === "") {
    alert("Please enter your name to start!");
    return;
  }

  document.querySelector(".input-section").classList.add("hidden");
  document.querySelector(".game-section").classList.remove("hidden");
  document.getElementById("greeting").textContent = `Hello, ${playerName}!`;
  resetGame();
});

resetBtn.addEventListener("click", resetGame);
