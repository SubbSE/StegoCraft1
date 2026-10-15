import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { IconButton, ButtonLink } from '../ui/Button';
import { GitHubIcon, Logo } from './Logo';
import { NAV_LINKS, REPO_URL } from '../../config/site';

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <IconButton label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={toggle}>
      {dark ? <Sun className="h-[18px] w-[18px]" aria-hidden="true" /> : <Moon className="h-[18px] w-[18px]" aria-hidden="true" />}
    </IconButton>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkCls = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-ink bg-surface-2' : 'text-muted hover:text-ink'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled || open ? 'border-line bg-bg/85 backdrop-blur-md' : 'border-transparent bg-bg/0'
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="StegoCraft home" className="shrink-0 rounded-lg">
          <Logo />
        </Link>

        <div className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="StegoCraft on GitHub"
            title="StegoCraft on GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-ink sm:flex"
          >
            <GitHubIcon className="h-[18px] w-[18px]" />
          </a>
          <ButtonLink to="/learn/what-is-steganography" size="sm" className="ml-2 hidden sm:inline-flex">
            Start learning
          </ButtonLink>
          <IconButton
            label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </IconButton>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-1 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkCls}>
                {l.label}
              </NavLink>
            ))}
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-ink">
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
