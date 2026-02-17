import { describe, it, expect, vi, beforeEach } from 'vitest';
import { playSound, speakText } from '@/lib/audio/playback';

describe('audio playback wrappers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('speakText is a no-op when speech synthesis is unavailable', () => {
    vi.stubGlobal('speechSynthesis', undefined);
    expect(() => speakText('Hello')).not.toThrow();
  });

  it('playSound resolves even when Audio.play rejects', async () => {
    const play = vi.fn().mockRejectedValue(new Error('blocked'));
    class MockAudio {
      play = play;
    }

    vi.stubGlobal('Audio', MockAudio as unknown as typeof Audio);

    await expect(playSound('/sounds/play-card.wav')).resolves.toBeUndefined();
  });
});
