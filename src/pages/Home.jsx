import { usePageMeta } from '../hooks/usePageMeta';

export default function Home() {
  usePageMeta('Home');
  return <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><h1 className="text-4xl font-bold">Home</h1></div>;
}
