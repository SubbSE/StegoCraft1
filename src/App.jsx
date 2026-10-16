import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';

const Home = lazy(() => import('./pages/Home'));
const Learn = lazy(() => import('./pages/Learn'));
const Lesson = lazy(() => import('./pages/Lesson'));
const Lab = lazy(() => import('./pages/Lab'));
const Detect = lazy(() => import('./pages/Detect'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Challenge = lazy(() => import('./pages/Challenge'));
const History = lazy(() => import('./pages/History'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:slug" element={<Lesson />} />
          <Route path="lab" element={<Navigate to="/lab/image" replace />} />
          <Route path="lab/:tool" element={<Lab />} />
          <Route path="detect" element={<Navigate to="/detect/image" replace />} />
          <Route path="detect/:kind" element={<Detect />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="challenges/:id" element={<Challenge />} />
          <Route path="history" element={<History />} />
          <Route path="about" element={<About />} />
          {/* Links from the previous version of the site */}
          <Route path="demo" element={<Navigate to="/lab/image" replace />} />
          <Route path="techniques" element={<Navigate to="/learn" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
