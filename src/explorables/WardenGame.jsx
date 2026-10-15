import { useState } from 'react';
import { Ban, Send, RotateCcw } from 'lucide-react';
import { Figure } from '../components/ui/display';
import { Button } from '../components/ui/Button';

// Some of these hide a message in the first letter of each word (a "null cipher").
const MESSAGES = [
  { text: 'Remember Uncle Ned’s new outdoor workshop?', hidden: 'RUN NOW' },
  { text: 'The weather here has been lovely, and the food is better than expected.', hidden: null },
  { text: 'Tell Oliver my oranges recovered remarkably over winter.', hidden: 'TOMORROW' },
  { text: 'Please send more socks and some writing paper when you can.', hidden: null },
  { text: 'Everyone at school today got all their exams.', hidden: 'EAST GATE' },
];

function Highlighted({ text }) {
  return text.split(' ').map((word, i) => (
    <span key={i}>
      {i > 0 && ' '}
      <mark className="rounded bg-secret/25 px-0.5 font-bold text-ink">{word[0]}</mark>
      {word.slice(1)}
    </span>
  ));
}

export default function WardenGame() {
  const [choices, setChoices] = useState({});
  const answered = Object.keys(choices).length;
  const finished = answered === MESSAGES.length;
  const caught = MESSAGES.filter((m, i) => m.hidden && choices[i] === 'block').length;
  const missed = MESSAGES.filter((m, i) => m.hidden && choices[i] === 'deliver').length;
  const wronglyBlocked = MESSAGES.filter((m, i) => !m.hidden && choices[i] === 'block').length;

  return (
    <Figure
      title="You are the warden"
      caption="Each message passes your desk. Deliver it, or block it if you think it hides something. Blocking innocent letters has a cost too — prisoners complain, and the real messages just find another way."
    >
      <ol className="space-y-3">
        {MESSAGES.map((m, i) => {
          const choice = choices[i];
          const right = choice && (choice === 'block') === Boolean(m.hidden);
          return (
            <li key={i} className={`rounded-xl border p-4 ${choice ? (right ? 'border-secret/40 bg-secret/5' : 'border-danger/40 bg-danger/5') : 'border-line bg-surface-2/40'}`}>
              <p className="font-medium text-ink">“{choice && m.hidden ? <Highlighted text={m.text} /> : m.text}”</p>
              {choice ? (
                <p className="mt-2 text-sm text-muted">
                  {m.hidden ? (
                    <>
                      Hidden message in the first letters: <strong className="font-mono text-secret">{m.hidden}</strong>.{' '}
                      {choice === 'block' ? 'Caught it!' : 'It slipped past you.'}
                    </>
                  ) : choice === 'block' ? (
                    'This one was innocent — you blocked an ordinary letter.'
                  ) : (
                    'Innocent. Correctly delivered.'
                  )}
                </p>
              ) : (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setChoices((c) => ({ ...c, [i]: 'deliver' }))}>
                    <Send aria-hidden="true" className="h-3.5 w-3.5" /> Deliver
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setChoices((c) => ({ ...c, [i]: 'block' }))}>
                    <Ban aria-hidden="true" className="h-3.5 w-3.5" /> Block
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {finished && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-2 p-4" role="status">
          <p className="text-sm text-ink">
            You caught <strong>{caught} of 3</strong> hidden messages
            {missed ? `, missed ${missed}` : ''}
            {wronglyBlocked ? `, and blocked ${wronglyBlocked} innocent letter${wronglyBlocked > 1 ? 's' : ''}` : ''}.{' '}
            {caught === 3 && !wronglyBlocked ? 'A perfect warden!' : 'Not easy, is it?'}
          </p>
          <Button size="sm" variant="ghost" onClick={() => setChoices({})}>
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> Play again
          </Button>
        </div>
      )}
    </Figure>
  );
}
