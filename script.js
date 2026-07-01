import { initializeCamera } from './camera.js';
import { classifyGesture, GestureStabilizer, getHandBox } from './gesture.js';
import { getRandomAIMove, getWinner } from './ai.js';
import { GameState } from './game.js';
import { updateScoreboard, updateMoves, updateCountdown, setGlow, toggleTheme, setSoundButton, setThemeButton, showConfetti } from './ui.js';

const videoElement = document.getElementById('webcamVideo');
const canvasElement = document.getElementById('outputCanvas');
const canvasCtx = canvasElement.getContext('2d');
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const renderWidth = isMobile ? 640 : 960;
const renderHeight = isMobile ? 480 : 720;
canvasElement.width = renderWidth;
canvasElement.height = renderHeight;
const resetBtn = document.getElementById('resetBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const startCameraBtn = document.getElementById('startCameraBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');

const state = new GameState();
const stabilizer = new GestureStabilizer(12, 0.7);
let soundEnabled = true;
let themeDark = false;
let moveLocked = false;
let cameraInitialized = false;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration = 0.14, type = 'sine') {
  if (!soundEnabled) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(0.18, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function playSound(key) {
  if (!soundEnabled) return;

  switch (key) {
    case 'win':
      playTone(520, 0.18, 'triangle');
      break;
    case 'lose':
      playTone(230, 0.14, 'sawtooth');
      break;
    case 'draw':
      playTone(330, 0.14, 'square');
      break;
    case 'click':
      playTone(690, 0.08, 'square');
      break;
    default:
      break;
  }
}

function drawResults(results) {
  const drawConnectorsFn = window.drawConnectors || drawConnectors;
  const drawLandmarksFn = window.drawLandmarks || drawLandmarks;
  const handConnections = window.HAND_CONNECTIONS || HAND_CONNECTIONS;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    canvasCtx.restore();
    return;
  }

  const landmarks = results.multiHandLandmarks[0];
  drawConnectorsFn(canvasCtx, landmarks, handConnections, { color: '#8ef7a4', lineWidth: 4 });
  drawLandmarksFn(canvasCtx, landmarks, { color: '#fff', lineWidth: 2 });

  const bounds = getHandBox(landmarks, canvasElement.width, canvasElement.height);
  setGlow(bounds);
  canvasCtx.restore();
}

function onResults(results) {
  drawResults(results);
  const landmarks = results.multiHandLandmarks && results.multiHandLandmarks[0];
  const gesture = landmarks ? classifyGesture(landmarks) : null;
  const stable = stabilizer.update(gesture);

  if (stable && state.canTriggerRound() && !moveLocked) {
    moveLocked = true;
    state.roundActive = false;
    const aiMove = getRandomAIMove();
    const winner = getWinner(stable, aiMove);
    state.commitRound(stable, aiMove, winner);
    updateScoreboard(state);
    updateMoves(stable, aiMove, winner, true);

    if (winner === 'PLAYER') {
      playSound('win');
      showConfetti();
    } else if (winner === 'AI') {
      playSound('lose');
    } else {
      playSound('draw');
    }

    setTimeout(() => {
      state.roundActive = true;
      moveLocked = false;
      updateMoves(null, null, null, false);
      stabilizer.reset();
    }, state.cooldown);
  }

  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    setGlow(null);
    if (!state.roundActive) {
      updateCountdown(Math.max(0, state.cooldown - (Date.now() - state.lastRoundAt)));
    }
    return;
  }

  if (!state.roundActive) {
    updateCountdown(Math.max(0, state.cooldown - (Date.now() - state.lastRoundAt)));
  } else {
    updateCountdown(0);
  }
}

function attachControls() {
  resetBtn.addEventListener('click', () => {
    state.reset();
    stabilizer.reset();
    moveLocked = false;
    updateScoreboard(state);
    updateMoves(null, null, null, false);
    updateCountdown(0);
    playSound('click');
  });

  playAgainBtn.addEventListener('click', () => {
    state.roundActive = true;
    moveLocked = false;
    stabilizer.reset();
    updateMoves(null, null, null, false);
    updateCountdown(0);
    playSound('click');
  });

  darkModeBtn.addEventListener('click', () => {
    themeDark = !themeDark;
    toggleTheme(themeDark);
    setThemeButton(themeDark);
  });

  if (startCameraBtn) {
    startCameraBtn.addEventListener('click', () => {
      if (!cameraInitialized) {
        initCamera();
      }
    });
  }

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    setSoundButton(soundEnabled);
  });
}

async function initCamera() {
  const gameMessage = document.getElementById('gameMessage');
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Webcam not available');
    }

    const result = await initializeCamera(videoElement, onResults);
    cameraInitialized = true;
    if (result.width && result.height) {
      canvasElement.width = result.width;
      canvasElement.height = result.height;
    }
    if (startCameraBtn) {
      startCameraBtn.style.display = 'none';
    }
    gameMessage.textContent = 'Camera ready. Raise a hand to play rock, paper or scissors.';
    gameMessage.className = 'status-info';
  } catch (error) {
    gameMessage.textContent = 'Unable to initialize webcam. Please allow access or use a supported browser.';
    gameMessage.className = 'status-warning';
    console.error(error);
  }
}

async function startApp() {
  updateScoreboard(state);
  setSoundButton(soundEnabled);
  toggleTheme(themeDark);
  setThemeButton(themeDark);
  attachControls();
  initCamera();
}

startApp();
