export class GameState {
  constructor() {
    this.playerScore = 0;
    this.aiScore = 0;
    this.draws = 0;
    this.lastMove = null;
    this.aiMove = null;
    this.lastWinner = null;
    this.roundActive = true;
    this.cooldown = 2500;
    this.lastRoundAt = 0;
  }

  reset() {
    this.playerScore = 0;
    this.aiScore = 0;
    this.draws = 0;
    this.lastMove = null;
    this.aiMove = null;
    this.lastWinner = null;
    this.roundActive = true;
    this.lastRoundAt = 0;
  }

  canTriggerRound() {
    return Date.now() - this.lastRoundAt >= this.cooldown;
  }

  commitRound(playerMove, aiMove, winner) {
    this.lastMove = playerMove;
    this.aiMove = aiMove;
    this.lastWinner = winner;
    this.lastRoundAt = Date.now();
    this.roundActive = false;

    if (winner === 'PLAYER') {
      this.playerScore += 1;
    } else if (winner === 'AI') {
      this.aiScore += 1;
    } else if (winner === 'DRAW') {
      this.draws += 1;
    }
  }
}
