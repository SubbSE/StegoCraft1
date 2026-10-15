import { Link } from 'react-router-dom';
import { ArrowRight, CircleCheck, Clock, FlaskConical, Trophy } from 'lucide-react';
import { LESSONS, lessonsInTrack, totalMinutes, TRACKS } from '../content/lessons';
import { useProgress } from '../hooks/useProgress';
import { usePageMeta } from '../hooks/usePageMeta';
import { ButtonLink } from '../components/ui/Button';
import { Card, PageHeader } from '../components/ui/display';

export default function Learn() {
  usePageMeta('Learn', 'A free interactive course on steganography: 14 hands-on lessons from bits and pixels to steganalysis.');
  const { lessonDone, lessonCount, reset } = useProgress();
  const nextLesson = LESSONS.find((l) => !lessonDone(l.slug)) ?? LESSONS[0];
  const pct = Math.round((lessonCount / LESSONS.length) * 100);
  let number = 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <PageHeader eyebrow="The course" title="Learn steganography by doing">
          {LESSONS.length} short lessons, each built around something you can touch: flip bits, hide messages, listen to
          noise, and catch secrets. About {Math.round(totalMinutes / 10) * 10} minutes in total. No account needed — your
          progress stays in this browser.
        </PageHeader>
        <Card className="space-y-4">
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-semibold">Your progress</span>
              <span className="font-mono text-sm text-muted">
                {lessonCount}/{LESSONS.length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress">
              <div className="h-full rounded-full bg-secret transition-[width]" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <ButtonLink to={`/learn/${nextLesson.slug}`} className="w-full">
            {lessonCount === 0 ? 'Start the first lesson' : lessonCount === LESSONS.length ? 'Review from the start' : 'Continue where you left off'}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
          {lessonCount > 0 && (
            <button type="button" onClick={() => window.confirm('Reset all your progress, including solved challenges?') && reset()} className="w-full text-center text-xs text-subtle hover:text-danger">
              Reset progress
            </button>
          )}
        </Card>
      </div>

      <div className="mt-14 space-y-14">
        {TRACKS.map((track, ti) => (
          <section key={track.id} aria-labelledby={`track-${track.id}`}>
            <div className="mb-5 flex items-baseline gap-3">
              <span className="font-mono text-sm text-subtle">0{ti + 1}</span>
              <div>
                <h2 id={`track-${track.id}`} className="text-2xl font-semibold">
                  {track.title}
                </h2>
                <p className="mt-1 text-muted">{track.description}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessonsInTrack(track.id).map((lesson) => {
                number += 1;
                const done = lessonDone(lesson.slug);
                return (
                  <Link
                    key={lesson.slug}
                    to={`/learn/${lesson.slug}`}
                    className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lg hover:shadow-black/5"
                  >
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="font-mono">Lesson {number}</span>
                      {done ? (
                        <span className="flex items-center gap-1 font-medium text-secret">
                          <CircleCheck aria-hidden="true" className="h-4 w-4" /> Done
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock aria-hidden="true" className="h-3.5 w-3.5" /> {lesson.minutes} min
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-snug text-ink group-hover:text-accent">{lesson.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{lesson.summary}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-2">
        <Card className="flex items-start gap-4">
          <FlaskConical aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-accent" />
          <div>
            <h2 className="font-semibold">Prefer to experiment freely?</h2>
            <p className="mt-1 text-sm text-muted">The Lab has full tools for hiding text and files in images, audio and text.</p>
            <Link to="/lab" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              Open the Lab <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
        <Card className="flex items-start gap-4">
          <Trophy aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-warn" />
          <div>
            <h2 className="font-semibold">Ready for a puzzle?</h2>
            <p className="mt-1 text-sm text-muted">Find the hidden flags in images, sounds and text — like a real CTF.</p>
            <Link to="/challenges" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              Try the challenges <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
