import { Link } from 'react-router-dom';
import { CircleCheck } from 'lucide-react';
import { LESSONS, TRACKS } from '../../content/lessons';
import { useProgress } from '../../hooks/useProgress';

export default function CourseOutline({ current }) {
  const { lessonDone, lessonCount } = useProgress();
  return (
    <nav aria-label="Course outline" className="text-sm">
      <div className="mb-4">
        <div className="mb-1.5 flex justify-between text-xs text-muted">
          <span>Your progress</span>
          <span>
            {lessonCount} / {LESSONS.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div className="h-full rounded-full bg-secret transition-[width]" style={{ width: `${(lessonCount / LESSONS.length) * 100}%` }} />
        </div>
      </div>
      {TRACKS.map((track) => (
        <div key={track.id} className="mb-5">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-subtle">{track.title}</p>
          <ul className="space-y-0.5">
            {LESSONS.filter((l) => l.track === track.id).map((l) => {
              const active = l.slug === current;
              const done = lessonDone(l.slug);
              return (
                <li key={l.slug}>
                  <Link
                    to={`/learn/${l.slug}`}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-start gap-2 rounded-lg px-2.5 py-1.5 leading-snug transition-colors ${
                      active ? 'bg-accent/10 font-medium text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
                    }`}
                  >
                    {done ? (
                      <CircleCheck aria-label="Completed" className="mt-0.5 h-4 w-4 shrink-0 text-secret" />
                    ) : (
                      <span aria-hidden="true" className={`mt-[5px] ml-[5px] mr-[3px] h-1.5 w-1.5 shrink-0 rounded-full ${active ? 'bg-accent' : 'bg-line-strong'}`} />
                    )}
                    <span>{l.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
