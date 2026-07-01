export const MOVES = ['ROCK', 'PAPER', 'SCISSORS'];

export function getRandomAIMove() {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

export function getWinner(playerMove, aiMove) {
  if (playerMove === aiMove) {
    return 'DRAW';
  }

  if (
    (playerMove === 'ROCK' && aiMove === 'SCISSORS') ||
    (playerMove === 'SCISSORS' && aiMove === 'PAPER') ||
    (playerMove === 'PAPER' && aiMove === 'ROCK')
  ) {
    return 'PLAYER';
  }

  return 'AI';
}

export function getMoveIcon(move) {
  switch (move) {
    case 'ROCK':
      return '✊';
    case 'PAPER':
      return '✋';
    case 'SCISSORS':
      return '✌';
    default:
      return '⏳';
  }
}
