import { useCallback } from 'react';
import { useStoredState } from './useStoredState';

const EMPTY = { lessons: {}, challenges: {} };

/** Learner progress, kept only in this browser. */
export function useProgress() {
  const [progress, setProgress] = useStoredState('sc-progress', EMPTY);
  const lessons = progress.lessons || {};
  const challenges = progress.challenges || {};

  const markLesson = useCallback(
    (slug, done = true) =>
      setProgress((p) => {
        const next = { ...EMPTY, ...p, lessons: { ...(p.lessons || {}) } };
        if (done) next.lessons[slug] = { at: Date.now() };
        else delete next.lessons[slug];
        return next;
      }),
    [setProgress],
  );

  const markChallenge = useCallback(
    (id) =>
      setProgress((p) => ({
        ...EMPTY,
        ...p,
        challenges: { ...(p.challenges || {}), [id]: { at: Date.now() } },
      })),
    [setProgress],
  );

  const reset = useCallback(() => setProgress(EMPTY), [setProgress]);

  return {
    lessonDone: (slug) => Boolean(lessons[slug]),
    challengeSolved: (id) => Boolean(challenges[id]),
    lessonCount: Object.keys(lessons).length,
    challengeCount: Object.keys(challenges).length,
    markLesson,
    markChallenge,
    reset,
  };
}
