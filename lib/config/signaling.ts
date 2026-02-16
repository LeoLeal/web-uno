export const getSignalingUrl = (env: { VITE_SIGNALING_URL?: string } = import.meta.env): string => {
  const signalingUrl = env.VITE_SIGNALING_URL?.trim();
  if (!signalingUrl) {
    throw new Error('Missing VITE_SIGNALING_URL. Define it in your environment.');
  }

  return signalingUrl;
};
