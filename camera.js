export async function initializeCamera(videoElement, onResults) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Webcam access is not supported by this browser.');
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const HandsClass = window.Hands || Hands;
  const CameraClass = window.Camera || Camera;
  const hands = new HandsClass({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: isMobile ? 0 : 1,
    selfieMode: true,
    minDetectionConfidence: isMobile ? 0.65 : 0.75,
    minTrackingConfidence: isMobile ? 0.65 : 0.75,
  });

  hands.onResults(onResults);

  const camera = new CameraClass(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: isMobile ? 640 : 1280,
    height: isMobile ? 480 : 720,
  });

  await camera.start();
  return { camera, hands };
}
