const hasWindow = (): boolean => typeof window !== 'undefined';

export const speakText = (text: string): void => {
  if (!hasWindow()) return;
  if (typeof window.speechSynthesis === 'undefined' || typeof window.SpeechSynthesisUtterance === 'undefined') {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } catch {
    // Fail soft: audio feedback must never break gameplay.
  }
};

export const playSound = async (src: string): Promise<void> => {
  if (!hasWindow() || typeof Audio === 'undefined') return;

  try {
    const audio = new Audio(src);
    await audio.play();
  } catch {
    // Fail soft: autoplay/policy/runtime errors are ignored.
  }
};
