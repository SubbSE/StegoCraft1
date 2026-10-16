import { useEffect, useRef, useState } from 'react';
import { Check, CircleHelp, X } from 'lucide-react';

/**
 * Multiple-choice check. Wrong picks can be retried; the explanation appears once a question is
 * answered correctly. Calls onComplete when every question has been answered correctly.
 */
export default function Quiz({ questions, onComplete }) {
  const [picked, setPicked] = useState({});
  const [solved, setSolved] = useState({});
  const solvedCount = Object.keys(solved).length;
  const done = solvedCount === questions.length;
  const reported = useRef(false);

  useEffect(() => {
    if (done && !reported.current) {
      reported.current = true;
      onComplete?.();
    }
  }, [done, onComplete]);

  const choose = (qi, oi) => {
    setPicked((p) => ({ ...p, [qi]: oi }));
    if (oi === questions[qi].answer) setSolved((s) => ({ ...s, [qi]: true }));
  };

  return (
    <section aria-labelledby="quiz-title" className="mt-14 rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="quiz-title" className="flex items-center gap-2 text-xl font-semibold">
          <CircleHelp aria-hidden="true" className="h-5 w-5 text-accent" /> Check your understanding
        </h2>
        <span className={`text-sm font-medium ${done ? 'text-secret' : 'text-muted'}`}>
          {solvedCount} / {questions.length} correct
        </span>
      </div>

      <ol className="mt-6 space-y-8">
        {questions.map((q, qi) => {
          const choice = picked[qi];
          const right = solved[qi];
          return (
            <li key={qi}>
              <fieldset>
                <legend className="mb-3 font-medium text-ink">
                  <span className="mr-2 text-subtle">{qi + 1}.</span>
                  {q.q}
                </legend>
                <div className="grid gap-2">
                  {q.options.map((opt, oi) => {
                    const isPicked = choice === oi;
                    const correct = oi === q.answer;
                    const state = isPicked ? (correct ? 'right' : 'wrong') : right && correct ? 'right' : 'idle';
                    const cls = {
                      idle: 'border-line hover:border-line-strong hover:bg-surface-2',
                      right: 'border-secret/60 bg-secret/10',
                      wrong: 'border-danger/50 bg-danger/5',
                    }[state];
                    return (
                      <button
                        key={oi}
                        type="button"
                        aria-pressed={isPicked}
                        disabled={right && !correct}
                        onClick={() => choose(qi, oi)}
                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-[0.95rem] transition-colors disabled:cursor-default disabled:opacity-60 ${cls}`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold ${
                            state === 'right' ? 'border-secret bg-secret text-white dark:text-bg' : state === 'wrong' ? 'border-danger text-danger' : 'border-line-strong text-subtle'
                          }`}
                        >
                          {state === 'right' ? <Check className="h-3 w-3" aria-hidden="true" /> : state === 'wrong' ? <X className="h-3 w-3" aria-hidden="true" /> : String.fromCharCode(65 + oi)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                <div aria-live="polite">
                  {choice !== undefined && !right && <p className="mt-3 text-sm text-danger">Not quite — have another look and try again.</p>}
                  {right && (
                    <p className="mt-3 rounded-lg bg-secret/10 px-3 py-2 text-sm leading-relaxed text-ink">
                      <strong className="text-secret">Correct.</strong> {q.explain}
                    </p>
                  )}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
