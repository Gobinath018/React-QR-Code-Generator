import { useRef, useCallback } from 'react';
import { Howl } from 'howler';

export const useSoundEffect = (soundUrl) => {
  const soundRef = useRef(null);

  const play = useCallback(() => {
    try {
      if (!soundRef.current) {
        soundRef.current = new Howl({
          src: [soundUrl],
          volume: 0.5,
          html5: true,
          onloaderror: () => {
            // Sound file not found — silently ignore
            soundRef.current = null;
          },
        });
      }
      soundRef.current?.play();
    } catch (err) {
      // Silently ignore sound errors (missing audio files)
    }
  }, [soundUrl]);

  return play;
};