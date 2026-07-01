const fingerTips = [8, 12, 16, 20];
const fingerPips = [6, 10, 14, 18];
const moveLabels = {
  ROCK: 'Rock',
  PAPER: 'Paper',
  SCISSORS: 'Scissors',
};

export function classifyGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return null;
  }

  const extended = fingerTips.map((tipIndex, index) => {
    const tip = landmarks[tipIndex];
    const pip = landmarks[fingerPips[index]];
    return tip.y < pip.y;
  });

  if (extended.every(Boolean)) {
    return 'PAPER';
  }

  if (extended[0] && extended[1] && !extended[2] && !extended[3]) {
    return 'SCISSORS';
  }

  if (extended.every((value) => !value)) {
    return 'ROCK';
  }

  return null;
}

export class GestureStabilizer {
  constructor(bufferSize = 10, threshold = 0.65) {
    this.bufferSize = bufferSize;
    this.threshold = threshold;
    this.buffer = [];
  }

  update(label) {
    this.buffer.unshift(label);
    if (this.buffer.length > this.bufferSize) {
      this.buffer.pop();
    }
    const counts = this.buffer.reduce((map, value) => {
      if (!value) return map;
      map[value] = (map[value] || 0) + 1;
      return map;
    }, {});

    const stable = Object.entries(counts).find(([, count]) => count / this.buffer.length >= this.threshold);
    return stable ? stable[0] : null;
  }

  reset() {
    this.buffer = [];
  }
}

export function getHandBox(landmarks, canvasWidth, canvasHeight) {
  if (!landmarks || landmarks.length === 0) {
    return null;
  }

  const xs = landmarks.map((point) => point.x * canvasWidth);
  const ys = landmarks.map((point) => point.y * canvasHeight);
  const minX = Math.max(0, Math.min(...xs));
  const maxX = Math.min(canvasWidth, Math.max(...xs));
  const minY = Math.max(0, Math.min(...ys));
  const maxY = Math.min(canvasHeight, Math.max(...ys));

  return {
    x: minX,
    y: minY,
    width: Math.max(80, maxX - minX),
    height: Math.max(80, maxY - minY),
  };
}

export function getMoveLabel(move) {
  return moveLabels[move] || 'Waiting';
}
