import { usePageMeta } from '../hooks/usePageMeta';

export default function Learn() {
  usePageMeta('Learn');
  return <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><h1 className="text-4xl font-bold">Learn</h1></div>;
}
