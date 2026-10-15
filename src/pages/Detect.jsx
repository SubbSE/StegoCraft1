import { usePageMeta } from '../hooks/usePageMeta';

export default function Detect() {
  usePageMeta('Detect');
  return <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><h1 className="text-4xl font-bold">Detect</h1></div>;
}
