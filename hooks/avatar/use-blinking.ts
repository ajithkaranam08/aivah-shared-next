import { useEffect, useState } from 'react';
import * as THREE from 'three';

export const useBlinking = () => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    let blinkDurationTimeout: NodeJS.Timeout;

    const nextBlink = () => {
      const nextDelay = THREE.MathUtils.randInt(1000, 5000);
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        blinkDurationTimeout = setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, THREE.MathUtils.randInt(150, 250));
      }, nextDelay);
    };

    nextBlink();
    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(blinkDurationTimeout);
    };
  }, []);

  return blink;
};
