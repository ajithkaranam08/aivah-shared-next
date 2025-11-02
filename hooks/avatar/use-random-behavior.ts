import { useEffect, useRef } from 'react';

type FacialExpression = 'Focused' | 'Happy' | 'Sad' | 'Angry' | 'Neutral';

export interface UseRandomBehaviorOptions {
  isLipsyncActive: boolean;
  isWalking: boolean;
  idleAnimationNames: string[];
  currentAnimation?: string;
  setCurrentAnimation: (name: string) => void;
  setCurrentFacialExpression: (expr: FacialExpression) => void;
}

const pick = <T,>(arr: T[], exclude?: T): T => {
  if (!arr.length) throw new Error('Empty array');
  let choice: T = arr[Math.floor(Math.random() * arr.length)];
  if (exclude && arr.length > 1) {
    let guard = 10;
    while (choice === exclude && guard-- > 0) choice = arr[Math.floor(Math.random() * arr.length)];
  }
  return choice;
};

export const useRandomBehavior = ({
  isLipsyncActive,
  isWalking,
  idleAnimationNames,
  currentAnimation,
  setCurrentAnimation,
  setCurrentFacialExpression,
}: UseRandomBehaviorOptions) => {
  const exprTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Random facial expressions when not talking
  useEffect(() => {
    if (exprTimer.current) clearTimeout(exprTimer.current);

    if (isLipsyncActive) {
      setCurrentFacialExpression('Focused');
      return;
    }

    const expressions: FacialExpression[] = ['Neutral', 'Happy', 'Sad', 'Angry', 'Focused'];

    const schedule = () => {
      const next = pick(expressions);
      setCurrentFacialExpression(next);
      const delay = 3000 + Math.random() * 4000; // 3–7s
      exprTimer.current = setTimeout(schedule, delay);
    };

    schedule();
    return () => {
      if (exprTimer.current) clearTimeout(exprTimer.current);
      exprTimer.current = null;
    };
  }, [isLipsyncActive, setCurrentFacialExpression]);

  // Random idle animation variations when not walking/talking
  useEffect(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);

    if (isLipsyncActive || isWalking || idleAnimationNames.length === 0) return;

    const schedule = () => {
      const next = pick(idleAnimationNames, currentAnimation);
      setCurrentAnimation(next);
      const delay = 8000 + Math.random() * 7000; // 8–15s
      idleTimer.current = setTimeout(schedule, delay);
    };

    schedule();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = null;
    };
  }, [isLipsyncActive, isWalking, idleAnimationNames.join(','), currentAnimation, setCurrentAnimation]);
};
