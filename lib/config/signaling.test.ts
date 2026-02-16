import { describe, expect, it } from 'vitest';
import { getSignalingUrl } from './signaling';

describe('getSignalingUrl', () => {
  it('uses VITE_SIGNALING_URL when provided', () => {
    const signalingUrl = getSignalingUrl({
      VITE_SIGNALING_URL: 'wss://signaling.example.com',
    });

    expect(signalingUrl).toBe('wss://signaling.example.com');
  });

  it('throws when VITE_SIGNALING_URL is missing', () => {
    expect(() => getSignalingUrl({})).toThrowError(
      'Missing VITE_SIGNALING_URL. Define it in your environment.'
    );
  });
});
