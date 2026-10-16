import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Spinner } from '../ui/display';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = hash ? decodeURIComponent(hash.slice(1)) : '';
    if (!id) return undefined;
    // Pages and lessons load lazily, so the target may not exist yet: keep looking for about two seconds.
    let frame = 0;
    let tries = 0;
    const find = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
      else if (tries++ < 120) frame = requestAnimationFrame(find);
    };
    find();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-muted" role="status">
      <Spinner className="h-6 w-6" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <ScrollManager />
      <Navbar />
      <main id="content" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
