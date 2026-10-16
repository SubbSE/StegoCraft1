import { useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { ButtonLink } from '../components/ui/Button';

// "404" written in 8-bit ASCII, the way a hidden message would be stored.
const BITS = Array.from('404', (c) => c.charCodeAt(0).toString(2).padStart(8, '0'));

export default function NotFound() {
  usePageMeta('Page not found');
  const { pathname } = useLocation();

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
      <p className="font-mono text-sm tracking-widest text-subtle" aria-hidden="true">
        {BITS.join(' ')}
      </p>
      <h1 className="mt-4 text-5xl font-bold sm:text-6xl">This page is hidden too well</h1>
      <p className="mt-5 max-w-xl text-lg text-muted">
        We’re good at finding hidden things, but there’s nothing at <code className="break-all font-mono text-ink">{pathname}</code>.
        Maybe the link is broken, or the page has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/" size="lg">
          Go to the home page
        </ButtonLink>
        <ButtonLink to="/learn" size="lg" variant="secondary">
          Browse the course <ArrowRight aria-hidden="true" className="h-5 w-5" />
        </ButtonLink>
      </div>
    </div>
  );
}
