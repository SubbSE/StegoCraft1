import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, GraduationCap, Languages, Microscope, ScrollText, ShieldCheck, Trophy } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { LESSONS, TRACKS, lessonsInTrack, totalMinutes } from '../content/lessons';
import { CHALLENGES } from '../content/challenges';
import { REPO_URL } from '../config/site';
import { ButtonLink } from '../components/ui/Button';
import { Card } from '../components/ui/display';
import { GitHubIcon } from '../components/layout/Logo';

const HeroReveal = lazy(() => import('../components/home/HeroReveal'));
const TrySentence = lazy(() => import('../components/home/TrySentence'));

const PLACES = [
  {
    to: '/learn',
    icon: GraduationCap,
    title: 'Learn',
    text: `${LESSONS.length} short lessons, each built around something you can touch — from your first hidden bit to catching secrets with statistics.`,
    cta: 'Browse the course',
  },
  {
    to: '/lab',
    icon: FlaskConical,
    title: 'Lab',
    text: 'Hide text or whole files in pictures, sound and text, with optional password protection. Then reveal them again.',
    cta: 'Open the Lab',
  },
  {
    to: '/detect',
    icon: Microscope,
    title: 'Detect',
    text: 'Think like a warden: bit planes, the chi-square attack, spectrograms and invisible-character scans for any file.',
    cta: 'Analyse a file',
  },
  {
    to: '/challenges',
    icon: Trophy,
    title: 'Challenges',
    text: `${CHALLENGES.length} capture-the-flag puzzles. Find the secret word hidden in each one — hints included.`,
    cta: 'Start a challenge',
  },
];

const PROMISES = [
  {
    icon: ShieldCheck,
    title: 'Private by design',
    text: 'No accounts, no tracking, no uploads. Every picture, recording and message you use stays on your device.',
  },
  {
    icon: Languages,
    title: 'Any language, any script',
    text: 'Messages are stored as UTF-8, so Bengali, Arabic, Chinese, Hindi, emoji — anything you can type — hides and returns intact.',
  },
  {
    icon: ScrollText,
    title: 'Honest about limits',
    text: 'You’ll learn what breaks hidden messages (JPEG, MP3, social media) and how they get caught — not just how to hide them.',
  },
];

export default function Home() {
  usePageMeta(null);

  return (
    <div className="overflow-x-clip">
      <section className="relative">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          <div className="animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Free · Open source · No sign-up</p>
            <h1 className="mt-4 text-5xl font-bold leading-[1.05] sm:text-6xl">
              Hide a secret in <span className="text-gradient">plain sight</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              StegoCraft is a hands-on course in <strong className="font-semibold text-ink">steganography</strong> — the art of
              hiding messages inside pictures, sound and text. Learn how it works, try it yourself, then learn how to catch it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/learn/what-is-steganography" size="lg">
                Start the course <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink to="/lab" size="lg" variant="secondary">
                Open the Lab
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-subtle">
              {LESSONS.length} lessons · about {Math.round(totalMinutes / 10) * 10} minutes · runs entirely in your browser
            </p>
          </div>
          <Suspense fallback={<div className="aspect-[8/5] w-full rounded-2xl border border-line bg-surface-2" />}>
            <HeroReveal />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="places">
        <h2 id="places" className="text-3xl font-bold sm:text-4xl">
          Four ways in
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">Start with the course, or jump straight to the tools. Everything links together.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLACES.map(({ to, icon: Icon, title, text, cta }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lg hover:shadow-black/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink group-hover:text-accent">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                {cta} <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="try">
        <h2 id="try" className="text-3xl font-bold sm:text-4xl">
          Try it in ten seconds
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Type a secret below. It disappears into an ordinary sentence — still there, but invisible.
        </p>
        <div className="mt-8">
          <Suspense fallback={<div className="h-56 rounded-2xl border border-line bg-surface" />}>
            <TrySentence />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="course">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="course" className="text-3xl font-bold sm:text-4xl">
              The course
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-muted">Five tracks, from the very basics to how hidden messages get caught.</p>
          </div>
          <ButtonLink to="/learn" variant="secondary">
            See all lessons <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {TRACKS.map((track, i) => {
            const lessons = lessonsInTrack(track.id);
            return (
              <li key={track.id}>
                <Link to={`/learn/${lessons[0].slug}`} className="group block h-full rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong">
                  <span className="font-mono text-sm text-subtle">0{i + 1}</span>
                  <h3 className="mt-2 font-semibold leading-snug text-ink group-hover:text-accent">{track.title}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="promises">
        <h2 id="promises" className="sr-only">
          Our promises
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="flex gap-4">
              <Icon aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-secret" />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 text-center sm:px-12">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">2,500 years of secrets, one lesson at a time</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              From messages tattooed under hair to code hidden in the pixels of online ads — start with the basics and work your
              way up to catching hidden data yourself.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink to="/learn/what-is-steganography" size="lg">
                Start lesson 1 <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink to="/history" size="lg" variant="secondary">
                Explore the history
              </ButtonLink>
            </div>
            <a href={REPO_URL} className="mt-8 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
              <GitHubIcon className="h-4 w-4" /> Free and open source on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
