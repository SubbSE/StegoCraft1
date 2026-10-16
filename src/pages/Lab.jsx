import { lazy, Suspense } from 'react';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import { AudioLines, Image, ShieldCheck, Type } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageHeader } from '../components/ui/display';
import { PageLoader } from '../components/layout/SiteLayout';

const ImageLab = lazy(() => import('../components/lab/ImageLab'));
const AudioLab = lazy(() => import('../components/lab/AudioLab'));
const TextLab = lazy(() => import('../components/lab/TextLab'));

const TOOLS = {
  image: { label: 'Image', icon: Image, Component: ImageLab, description: 'Hide text or whole files in the pixels of a picture.' },
  audio: { label: 'Audio', icon: AudioLines, Component: AudioLab, description: 'Hide messages in the quietest bits of a sound recording.' },
  text: { label: 'Text', icon: Type, Component: TextLab, description: 'Hide messages inside ordinary text with invisible characters.' },
};

export default function Lab() {
  const { tool } = useParams();
  const current = TOOLS[tool];
  usePageMeta(current ? `${current.label} lab` : 'Lab', current?.description);
  if (!current) return <Navigate to="/lab/image" replace />;
  const { Component } = current;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
      <PageHeader eyebrow="The Lab" title="Hide anything in plain sight">
        Real tools, not toys: Unicode-safe, password protected, and honest about what survives. Everything runs on your
        device.
      </PageHeader>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line">
        <nav aria-label="Lab tools" className="-mb-px flex gap-1">
          {Object.entries(TOOLS).map(([id, t]) => {
            const Icon = t.icon;
            return (
              <NavLink
                key={id}
                to={`/lab/${id}`}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
                  }`
                }
              >
                <Icon aria-hidden="true" className="h-4 w-4" /> {t.label}
              </NavLink>
            );
          })}
        </nav>
        <p className="mb-3 flex items-center gap-1.5 text-xs text-muted">
          <ShieldCheck aria-hidden="true" className="h-4 w-4 text-secret" /> Nothing is uploaded — files never leave your device.
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
