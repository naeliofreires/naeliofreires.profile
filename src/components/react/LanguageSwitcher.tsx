import { useState, useEffect, useRef, useCallback } from 'react';

const locales = [
  { code: 'en' as const, label: 'English' },
  { code: 'pt' as const, label: 'Portugu\u00eas' },
] as const;

function getSwitchPath(currentLang: 'en' | 'pt', targetLang: 'en' | 'pt'): string {
  const pathname = window.location.pathname;

  const cleanPath = (path: string): string => {
    const parts = path.split('/').filter(Boolean);
    if (parts[0] === 'en' || parts[0] === 'pt') {
      return '/' + parts.slice(1).join('/');
    }
    return path || '/';
  };

  const rest = cleanPath(pathname);
  return `/${targetLang}${rest}`;
}

export default function LanguageSwitcher({ currentLang }: { currentLang: 'en' | 'pt' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, close]);

  const current = locales.find((l) => l.code === currentLang)!;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Switch language"
        className="flex items-center gap-1 rounded-[3px] border border-brand-ink bg-base px-2.5 py-2 font-mono text-xs text-brand-ink transition-colors hover:bg-base-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
      >
        <span>{current.code.toUpperCase()}</span>
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[140px] overflow-hidden rounded-[3px] border border-brand-ink bg-white py-1 shadow-md"
          role="menu"
          aria-label="Available languages"
        >
          {locales.map((locale) => {
            const isActive = locale.code === currentLang;
            return (
              <a
                key={locale.code}
                href={getSwitchPath(currentLang, locale.code)}
                role="menuitem"
                aria-selected={isActive}
                className={`flex items-center justify-between gap-2 px-3 py-2 font-mono text-xs transition-colors ${
                  isActive
                    ? 'bg-brand-lime font-medium text-brand-ink'
                    : 'text-brand-ink/80 hover:bg-base-hover hover:text-brand-ink'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span>{locale.label}</span>
                {isActive && (
                  <svg
                    className="h-3.5 w-3.5 text-brand-ink"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
