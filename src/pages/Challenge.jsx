import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CircleCheck, Lightbulb, PartyPopper } from 'lucide-react';
import { CATEGORIES, CHALLENGES, challengeIndex, difficultyOf, pointsFor } from '../content/challenges';
import { LESSONS } from '../content/lessons';
import { useProgress } from '../hooks/useProgress';
import { usePageMeta } from '../hooks/usePageMeta';
import { answerHash, normalizeAnswer } from '../lib/flags';
import ArtifactCard from '../components/challenges/ArtifactCard';
import { PageLoader } from '../components/layout/SiteLayout';
import { Button } from '../components/ui/Button';
import { Badge, Callout, Card } from '../components/ui/display';
import { TextInput } from '../components/ui/controls';

// Challenge files are built once per visit and reused, so hand-offs to the tools stay consistent.
const artifacts = new Map();
function getArtifact(id, make) {
  if (!artifacts.has(id)) {
    artifacts.set(
      id,
      make().catch((e) => {
        artifacts.delete(id);
        throw e;
      }),
    );
  }
  return artifacts.get(id);
}

function Hints({ hints }) {
  const [shown, setShown] = useState(0);
  return (
    <Card className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Lightbulb aria-hidden="true" className="h-5 w-5 text-warn" /> Hints
      </h2>
      {shown === 0 && <p className="text-sm text-muted">Try it on your own first. Each hint is more specific than the last.</p>}
      {shown > 0 && (
        <ol className="space-y-2">
          {hints.slice(0, shown).map((hint, i) => (
            <li key={i} className="prose-sc rounded-xl bg-surface-2 px-4 py-3 text-sm">
              <p>
                <strong>Hint {i + 1}.</strong> {hint}
              </p>
            </li>
          ))}
        </ol>
      )}
      {shown < hints.length && (
        <Button size="sm" variant="secondary" onClick={() => setShown(shown + 1)}>
          Show hint {shown + 1} of {hints.length}
        </Button>
      )}
    </Card>
  );
}

function AnswerForm({ challenge, onSolved }) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('idle');
  const [tries, setTries] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    if (!normalizeAnswer(value)) return;
    setStatus('checking');
    const ok = (await answerHash(challenge.id, value)) === challenge.answer;
    setStatus(ok ? 'right' : 'wrong');
    if (ok) onSolved();
    else setTries((t) => t + 1);
  };

  return (
    <Card as="form" onSubmit={submit} className="space-y-3">
      <label htmlFor="answer" className="block text-lg font-semibold">
        {challenge.ask}
      </label>
      <div className="flex gap-2">
        <TextInput
          id="answer"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (status === 'wrong') setStatus('idle');
          }}
          placeholder="Your answer"
          autoComplete="off"
          spellCheck={false}
          aria-describedby="answer-status"
        />
        <Button type="submit" disabled={status === 'checking'}>
          Check
        </Button>
      </div>
      <p id="answer-status" role="status" className="min-h-5 text-sm">
        {status === 'right' && <span className="font-semibold text-secret">Correct! +{pointsFor(challenge)} points.</span>}
        {status === 'wrong' && (
          <span className="text-ink">
            Not quite.{' '}
            {tries >= 3 ? 'Still stuck? The hints get more specific, and the walkthrough shows every step.' : 'Check the spelling, or take a hint.'}
          </span>
        )}
      </p>
      <p className="text-xs text-subtle">Capitals, spaces and punctuation don’t matter.</p>
    </Card>
  );
}

export default function Challenge() {
  const { id } = useParams();
  const idx = challengeIndex(id);
  const challenge = CHALLENGES[idx];
  const [mod, setMod] = useState(null);
  const [artifact, setArtifact] = useState(null);
  const [justSolved, setJustSolved] = useState(false);
  const { challengeSolved, markChallenge } = useProgress();
  usePageMeta(challenge ? `${challenge.title} · Challenge` : 'Challenge', challenge?.teaser);

  useEffect(() => {
    if (!challenge) return undefined;
    let alive = true;
    setJustSolved(false);
    challenge.load().then(async (m) => {
      if (!alive) return;
      setMod({ id: challenge.id, m });
      try {
        const value = await getArtifact(challenge.id, m.make);
        if (alive) setArtifact({ id: challenge.id, value });
      } catch (e) {
        console.error(e);
        if (alive) setArtifact({ id: challenge.id, error: true });
      }
    });
    return () => {
      alive = false;
    };
  }, [challenge]);

  if (!challenge) return <Navigate to="/challenges" replace />;
  const m = mod?.id === challenge.id ? mod.m : null;
  const file = artifact?.id === challenge.id ? artifact : null;
  const solved = challengeSolved(challenge.id) || justSolved;
  const difficulty = difficultyOf(challenge);
  const lesson = LESSONS.find((l) => l.slug === challenge.lesson);
  const prev = CHALLENGES[idx - 1];
  const next = CHALLENGES[idx + 1];
  const { default: Story, hints, Walkthrough, Debrief } = m ?? {};

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <Link to="/challenges" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All challenges
      </Link>

      <header className="mt-5 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-subtle">
            Challenge {idx + 1} of {CHALLENGES.length}
          </span>
          <Badge tone={difficulty.tone}>{difficulty.label}</Badge>
          <Badge>{CATEGORIES[challenge.category]}</Badge>
          <Badge tone="accent">{difficulty.points} points</Badge>
          {solved && (
            <Badge tone="secret">
              <CircleCheck aria-hidden="true" className="h-3.5 w-3.5" /> Solved
            </Badge>
          )}
        </div>
        <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{challenge.title}</h1>
      </header>

      {!m ? (
        <PageLoader />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <div className="prose-sc max-w-3xl">
              <Story />
            </div>
            {!file && <PageLoader />}
            {file?.error && <Callout type="warn">This challenge’s file couldn’t be built in your browser. Try reloading the page.</Callout>}
            {file?.value && <ArtifactCard artifact={file.value} />}
            <AnswerForm
              key={challenge.id}
              challenge={challenge}
              onSolved={() => {
                setJustSolved(true);
                markChallenge(challenge.id);
              }}
            />
            {solved && (
              <Card className="space-y-3 border-secret/40 bg-secret/5">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <PartyPopper aria-hidden="true" className="h-5 w-5 text-secret" /> How it worked
                </h2>
                <div className="prose-sc text-[0.98rem]">
                  <Debrief />
                </div>
                {next && (
                  <Link to={`/challenges/${next.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                    Next: {next.title} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                )}
              </Card>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Hints key={challenge.id} hints={hints} />
            {lesson && (
              <Card className="flex items-start gap-3">
                <BookOpen aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div className="text-sm">
                  <p className="text-muted">The lesson behind this challenge</p>
                  <Link to={`/learn/${lesson.slug}`} className="font-semibold text-ink hover:text-accent">
                    {lesson.title}
                  </Link>
                </div>
              </Card>
            )}
            <details className="rounded-2xl border border-line bg-surface">
              <summary className="cursor-pointer px-5 py-4 font-semibold">
                Walkthrough <span className="ml-1 text-xs font-medium text-warn">contains spoilers</span>
              </summary>
              <div className="prose-sc border-t border-line px-5 py-4 text-[0.95rem]">
                <Walkthrough />
              </div>
            </details>
          </aside>
        </div>
      )}

      <nav aria-label="Challenge navigation" className="mt-12 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link to={`/challenges/${prev.id}`} className="rounded-2xl border border-line bg-surface p-4 hover:border-line-strong">
            <span className="text-xs font-medium text-muted">Previous</span>
            <span className="mt-1 block font-medium text-ink">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/challenges/${next.id}`} className="rounded-2xl border border-accent/30 bg-accent/5 p-4 text-right hover:border-accent/60">
            <span className="text-xs font-medium text-accent">Next challenge</span>
            <span className="mt-1 block font-medium text-ink">{next.title}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
