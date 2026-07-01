# AI Rock Paper Scissors

A browser-based Rock Paper Scissors game powered by real-time hand gesture recognition using MediaPipe Hands. Play directly in your browser with your webcam and challenge an AI opponent — no backend required.

## Features

- Real-time webcam access using `getUserMedia()`
- Live hand tracking with MediaPipe Hands JavaScript
- Gesture detection for Rock, Paper, and Scissors
- AI move generation and round winner calculation
- Player / AI score tracking and draw counter
- Countdown between rounds and gesture stabilization
- Dark mode toggle and sound controls
- Responsive glassmorphism UI with smooth animations
- Confetti celebration on player wins
- Deployable directly on Vercel as a static site

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6 modules)
- MediaPipe Hands JS
- WebRTC (`navigator.mediaDevices.getUserMedia`)

## Installation

1. Clone the repo
   ```bash
   git clone <repo-url>
   cd AI-Rock-Paper-Scissors-using-hand-gestures-main
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start locally
   ```bash
   npm run dev
   ```

4. Open the local URL shown in the terminal.

## Deployment on Vercel

1. Sign in to Vercel and create a new project.
2. Import the GitHub repository.
3. Use the default static site settings.
4. Ensure `vercel.json` is present in the repo root.
5. Deploy.

The app is fully static and requires no backend.

## Project Structure

- `index.html` — main page
- `style.css` — UI styling
- `script.js` — app initialization and orchestration
- `camera.js` — MediaPipe camera setup
- `gesture.js` — gesture classification and stabilization
- `ai.js` — AI move logic
- `game.js` — game state management
- `ui.js` — DOM updates and animations
- `assets/` — image assets
- `sounds/` — audio placeholders
- `vercel.json` — deployment config

## Future Improvements

- Add a gesture tutorial overlay
- Improve hand posture detection with additional rules
- Add support for multiplayer or scoreboard persistence
- Replace sound effect loading with preloaded audio buffers
- Add better mobile camera access controls

## License

MIT License

## Author

Built by a passionate AI and frontend developer for a portfolio-ready interactive experience.
