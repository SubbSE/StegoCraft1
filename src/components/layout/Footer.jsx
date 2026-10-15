import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { GitHubIcon, Logo } from './Logo';
import { REPO_URL } from '../../config/site';

const columns = [
  {
    title: 'Learn',
    links: [
      { to: '/learn', label: 'Course' },
      { to: '/history', label: 'History of hiding' },
      { to: '/challenges', label: 'Challenges' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { to: '/lab/image', label: 'Image lab' },
      { to: '/lab/audio', label: 'Audio lab' },
      { to: '/lab/text', label: 'Text lab' },
      { to: '/detect', label: 'Detect hidden data' },
    ],
  },
  {
    title: 'Project',
    links: [
      { to: '/about', label: 'About & team' },
      { to: '/about#references', label: 'References' },
      { href: REPO_URL, label: 'Source code' },
      { href: `${REPO_URL}/issues`, label: 'Report an issue' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            A free, open-source place to learn the art of hiding information in plain sight — and how it gets caught.
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-secret" />
            No accounts, no tracking, no uploads. Every file you use stays on your device.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-semibold text-ink">{col.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <a href={l.href} target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
                      {l.label}
                    </a>
                  ) : (
                    <Link to={l.to} className="text-muted hover:text-ink">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-subtle sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} The StegoCraft team. Use what you learn responsibly.</p>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-ink">
            <GitHubIcon className="h-4 w-4" /> SubbSE/StegoCraft1
          </a>
        </div>
      </div>
    </footer>
  );
}
