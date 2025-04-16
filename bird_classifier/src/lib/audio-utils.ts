/**
 * Converts audio data to the format required by Edge Impulse
 * This is a placeholder implementation - you'll need to adjust based on
 * Edge Impulse's specific requirements for your project
 */
export async function prepareAudioForEdgeImpulse(
  audioBlob: Blob
): Promise<Blob> {
  // In a real implementation, you might need to:
  // 1. Convert to the right format (e.g., WAV)
  // 2. Resample to the right frequency
  // 3. Adjust channels (mono/stereo)
  // 4. Trim to the right length

  // This is a placeholder that just returns the original blob
  // You would replace this with actual audio processing
  return audioBlob;
}

/**
 * Creates an audio element to play the recorded audio
 */
export function createAudioPlayer(audioBlob: Blob): HTMLAudioElement {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);

  // Clean up the URL object when the audio is done
  audio.onended = () => {
    URL.revokeObjectURL(audioUrl);
  };

  return audio;
}

/**
 * Visualizes audio data on a canvas
 * This is a simple implementation - you can enhance it for better visualization
 */
export function visualizeAudio(
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
  canvas: HTMLCanvasElement
): void {
  const canvasCtx = canvas.getContext("2d");
  if (!canvasCtx) return;

  const width = canvas.width;
  const height = canvas.height;
  const data = audioBuffer.getChannelData(0);
  const step = Math.ceil(data.length / width);

  canvasCtx.clearRect(0, 0, width, height);
  canvasCtx.fillStyle = "#4ade80"; // Green color
  canvasCtx.beginPath();

  for (let i = 0; i < width; i++) {
    const offset = Math.floor(i * step);
    let min = 1.0;
    let max = -1.0;

    for (let j = 0; j < step; j++) {
      const datum = data[offset + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }

    const y = ((1 + min) * height) / 2;
    const barHeight = Math.max(1, ((max - min) * height) / 2);

    canvasCtx.rect(i, y, 1, barHeight);
  }

  canvasCtx.fill();
}
