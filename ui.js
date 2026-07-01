import { getMoveLabel } from './gesture.js';
import { getMoveIcon } from './ai.js';

const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');
const drawScoreEl = document.getElementById('drawScore');
const playerMoveText = document.getElementById('playerMoveText');
const aiMoveText = document.getElementById('aiMoveText');
const gameMessage = document.getElementById('gameMessage');
const countdownText = document.getElementById('countdownText');
const handGlow = document.getElementById('handGlow');
const playerCard = document.getElementById('playerCard');
const aiCard = document.getElementById('aiCard');
const drawCard = document.getElementById('drawCard');
const appRoot = document.body;

export function updateScoreboard(state) {
  playerScoreEl.textContent = state.playerScore;
  aiScoreEl.textContent = state.aiScore;
  drawScoreEl.textContent = state.draws;
}

export function updateMoves(playerMove, aiMove, winner, isCooldown) {
  playerMoveText.textContent = playerMove ? `Player: ${getMoveLabel(playerMove)}` : 'Waiting for gesture';
  aiMoveText.textContent = aiMove ? `AI: ${getMoveIcon(aiMove)} ${getMoveLabel(aiMove)}` : 'AI is waiting';

  if (winner === 'PLAYER') {
    gameMessage.textContent = 'You win this round!';
    gameMessage.className = 'status-info status-success';
    playerCard.classList.add('shake');
    aiCard.classList.remove('shake');
  } else if (winner === 'AI') {
    gameMessage.textContent = 'AI wins — stay sharp.';
    gameMessage.className = 'status-info status-warning';
    aiCard.classList.add('shake');
    playerCard.classList.remove('shake');
  } else if (winner === 'DRAW') {
    gameMessage.textContent = 'Round draw — try again.';
    gameMessage.className = 'status-info';
    playerCard.classList.remove('shake');
    aiCard.classList.remove('shake');
  } else if (isCooldown) {
    gameMessage.textContent = 'Round complete. Wait for the countdown.';
    gameMessage.className = 'status-info';
    playerCard.classList.remove('shake');
    aiCard.classList.remove('shake');
  } else {
    gameMessage.textContent = 'Raise a hand to play rock, paper or scissors.';
    gameMessage.className = 'status-info';
    playerCard.classList.remove('shake');
    aiCard.classList.remove('shake');
  }
}

export function updateCountdown(remainingMs) {
  if (remainingMs <= 0) {
    countdownText.textContent = 'Ready';
    return;
  }
  countdownText.textContent = `Next round in ${Math.ceil(remainingMs / 1000)}s`;
}

export function setGlow(bounds) {
  if (!bounds) {
    handGlow.style.opacity = '0';
    return;
  }
  handGlow.style.opacity = '1';
  handGlow.style.transform = `translate(${bounds.x}px, ${bounds.y}px) scale(1)`;
  handGlow.style.width = `${bounds.width}px`;
  handGlow.style.height = `${bounds.height}px`;
}

export function toggleTheme(isDark) {
  if (isDark) {
    appRoot.classList.add('dark');
  } else {
    appRoot.classList.remove('dark');
  }
}

export function setSoundButton(enabled) {
  const soundButton = document.getElementById('soundToggleBtn');
  soundButton.textContent = enabled ? '🔊' : '🔇';
  soundButton.setAttribute('aria-pressed', String(enabled));
}

export function showConfetti() {
  const layer = document.getElementById('confettiLayer');
  layer.innerHTML = '';
  for (let i = 0; i < 18; i += 1) {
    const dot = document.createElement('div');
    dot.className = 'confetti-piece';
    dot.style.left = `${Math.random() * 98}%`;
    dot.style.background = `hsl(${Math.random() * 340 + 30}, 85%, 62%)`;
    dot.style.animationDuration = `${Math.random() * 1.4 + 0.9}s`;
    layer.appendChild(dot);
  }

  setTimeout(() => {
    layer.innerHTML = '';
  }, 1400);
}
