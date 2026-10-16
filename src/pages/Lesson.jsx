import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CircleCheck, Clock, ListTree } from 'lucide-react';
import { LESSONS, lessonIndex, TRACKS } from '../content/lessons';
import { useProgress } from '../hooks/useProgress';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageLoader } from '../components/layout/SiteLayout';
import CourseOutline from '../components/learn/CourseOutline';
import Quiz from '../components/learn/Quiz';
import { Button } from '../components/ui/Button';

function LessonNav({ prev, next }) {
  return (
    <nav aria-label="Lesson navigation" className="mt-12 grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link to={`/learn/${prev.slug}`} className="group rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" /> Previous
          </span>
          <span className="mt-1 block font-medium text-ink">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={`/learn/${next.slug}`} className="group rounded-2xl border border-accent/30 bg-accent/5 p-4 text-right transition-colors hover:border-accent/60">
          <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-accent">
            Next lesson <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-1 block font-medium text-ink">{next.title}</span>
        </Link>
      ) : (
        <Link to="/challenges" className="group rounded-2xl border border-secret/40 bg-secret/5 p-4 text-right transition-colors hover:border-secret/70">
          <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-secret">
            You finished the course <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1 block font-medium text-ink">Put your skills to the test: Challenges</span>
        </Link>
      )}
    </nav>
  );
}

export default function Lesson() {
  const { slug } = useParams();
  const idx = lessonIndex(slug);
  const lesson = LESSONS[idx];
  const [loaded, setLoaded] = useState(null);
  const { lessonDone, markLesson } = useProgress();
  usePageMeta(lesson?.title ?? 'Lesson', lesson?.summary);

  useEffect(() => {
    if (!lesson) return undefined;
    let alive = true;
    lesson.load().then((mod) => alive && setLoaded({ slug: lesson.slug, mod }));
    return () => {
      alive = false;
    };
  }, [lesson]);

  const complete = useCallback(() => markLesson(slug, true), [markLesson, slug]);

  if (!lesson) return <Navigate to="/learn" replace />;
  const track = TRACKS.find((t) => t.id === lesson.track);
  const done = lessonDone(slug);
  const mod = loaded?.slug === slug ? loaded.mod : null;
  const Body = mod?.default;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12 lg:pt-12">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 pr-2">
          <CourseOutline current={slug} />
        </div>
      </aside>

      <article className="min-w-0 max-w-3xl">
        <details className="mb-6 rounded-xl border border-line bg-surface lg:hidden">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-ink">
            <ListTree aria-hidden="true" className="h-4 w-4 text-accent" /> Course outline
          </summary>
          <div className="border-t border-line p-4">
            <CourseOutline current={slug} />
          </div>
        </details>

        <header>
          <p className="text-sm font-medium text-accent">
            <Link to="/learn" className="hover:underline">
              Learn
            </Link>
            <span className="mx-2 text-subtle">/</span>
            {track.title}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.1] sm:text-[2.75rem]">{lesson.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{lesson.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden="true" className="h-4 w-4" /> {lesson.minutes} min
            </span>
            <span>
              Lesson {idx + 1} of {LESSONS.length}
            </span>
            {done && (
              <span className="flex items-center gap-1.5 font-medium text-secret">
                <CircleCheck aria-hidden="true" className="h-4 w-4" /> Completed
              </span>
            )}
          </div>
        </header>

        {Body ? (
          <div className="prose-sc mt-10">
            <Body />
          </div>
        ) : (
          <PageLoader />
        )}

        {mod?.quiz && <Quiz key={slug} questions={mod.quiz} onComplete={complete} />}

        {mod && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2/50 px-5 py-4">
            <p className="text-sm text-muted">
              {done ? 'Nice work — this lesson is marked as complete.' : 'Finish the quiz to complete this lesson, or mark it yourself.'}
            </p>
            <Button variant={done ? 'ghost' : 'secondary'} size="sm" onClick={() => markLesson(slug, !done)}>
              {done ? 'Mark as not done' : 'Mark as complete'}
            </Button>
          </div>
        )}

        <LessonNav prev={LESSONS[idx - 1]} next={LESSONS[idx + 1]} />
      </article>
    </div>
  );
}
