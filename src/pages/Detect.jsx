import { lazy, Suspense } from 'react';
import { Link, Navigate, NavLink, useParams } from 'react-router-dom';
import { AudioLines, Image, ShieldCheck, Type } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageHeader } from '../components/ui/display';
import { PageLoader } from '../components/layout/SiteLayout';

const DetectImage = lazy(() => import('../components/detect/DetectImage'));
const DetectAudio = lazy(() => import('../components/detect/DetectAudio'));
const DetectText = lazy(() => import('../components/detect/DetectText'));

const KINDS = {
  image: { label: 'Image', icon: Image, Component: DetectImage },
  audio: { label: 'Audio', icon: AudioLines, Component: DetectAudio },
  text: { label: 'Text', icon: Type, Component: DetectText },
};

export default function Detect() {
  const { kind } = useParams();
  const current = KINDS[kind];
  usePageMeta(current ? `Detect: ${current.label.toLowerCase()}` : 'Detect', 'Steganalysis tools in your browser: bit planes, the chi-square attack, spectrograms and invisible-character detection.');
  if (!current) return <Navigate to="/detect/image" replace />;
  const { Component } = current;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
      <PageHeader eyebrow="Detect" title="Think like the warden">
        Analyse any picture, recording or text for traces of hidden data — the same techniques taught in{' '}
        <Link to="/learn/steganalysis" className="text-accent underline underline-offset-4">
          the steganalysis lesson
        </Link>
        .
      </PageHeader>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line">
        <nav aria-label="Detection tools" className="-mb-px flex gap-1">
          {Object.entries(KINDS).map(([id, k]) => {
            const Icon = k.icon;
            return (
              <NavLink
                key={id}
                to={`/detect/${id}`}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
                  }`
                }
              >
                <Icon aria-hidden="true" className="h-4 w-4" /> {k.label}
              </NavLink>
            );
          })}
        </nav>
        <p className="mb-3 flex items-center gap-1.5 text-xs text-muted">
          <ShieldCheck aria-hidden="true" className="h-4 w-4 text-secret" /> Analysis runs entirely on your device.
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={<PageLoader />}>
          <Component />
        </Suspense>
      </div>
    </div>
  );
}
