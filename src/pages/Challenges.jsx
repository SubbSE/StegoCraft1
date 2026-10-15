import { Link } from 'react-router-dom';
import { AudioLines, CircleCheck, Feather, Image, Microscope, Type } from 'lucide-react';
import { CATEGORIES, CHALLENGES, DIFFICULTIES, pointsFor, TOTAL_POINTS } from '../content/challenges';
import { useProgress } from '../hooks/useProgress';
import { usePageMeta } from '../hooks/usePageMeta';
import { Badge, Card, PageHeader } from '../components/ui/display';

const ICONS = { image: Image, audio: AudioLines, text: Type, classic: Feather, detect: Microscope };

export default function Challenges() {
  usePageMeta('Challenges', 'Ten capture-the-flag puzzles: find secret words hidden in pictures, sounds and text.');
  const { challengeSolved } = useProgress();
  const solved = CHALLENGES.filter((c) => challengeSolved(c.id));
  const points = solved.reduce((sum, c) => sum + pointsFor(c), 0);
  const pct = Math.round((points / TOTAL_POINTS) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <PageHeader eyebrow="Challenges" title="Capture the flag">
          Ten puzzles that put the course to work. Each one hides a secret in a picture, a recording or a piece of text.
          Find it with the Lab and Detect tools, type it in, and collect the points. Every challenge has hints and a
          walkthrough.
        </PageHeader>
        <Card className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold">Your score</span>
            <span className="font-mono text-sm text-muted">
              {points}/{TOTAL_POINTS} points
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Challenge score">
            <div className="h-full rounded-full bg-secret transition-[width]" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-sm text-muted">
            {solved.length} of {CHALLENGES.length} solved · saved in this browser only
          </p>
        </Card>
      </div>

      <div className="mt-14 space-y-12">
        {DIFFICULTIES.map((d) => (
          <section key={d.id} aria-labelledby={`level-${d.id}`}>
            <h2 id={`level-${d.id}`} className="mb-5 flex items-baseline gap-3 text-2xl font-semibold">
              {d.label} <span className="text-sm font-normal text-muted">{d.points} points each</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CHALLENGES.filter((c) => c.difficulty === d.id).map((c) => {
                const Icon = ICONS[c.category];
                const done = challengeSolved(c.id);
                return (
                  <Link
                    key={c.id}
                    to={`/challenges/${c.id}`}
                    className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lg hover:shadow-black/5"
                  >
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="flex items-center gap-1.5">
                        <Icon aria-hidden="true" className="h-4 w-4" /> {CATEGORIES[c.category]}
                      </span>
                      {done ? (
                        <span className="flex items-center gap-1 font-medium text-secret">
                          <CircleCheck aria-hidden="true" className="h-4 w-4" /> Solved
                        </span>
                      ) : (
                        <Badge tone={d.tone}>{d.points}</Badge>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-snug text-ink group-hover:text-accent">{c.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.teaser}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
