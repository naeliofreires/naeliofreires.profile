import { useEffect, useRef } from 'react';

export default function Timeline() {
  const rafRef = useRef<number>(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sections = document.querySelectorAll<HTMLElement>('[data-timeline-section]');
    if (sections.length === 0) return;

    // --- IntersectionObserver for card visibility ---
    const cards = document.querySelectorAll<HTMLElement>('[data-timeline-card]');

    if (prefersReducedMotion) {
      // Reveal everything immediately
      cards.forEach((card) => card.classList.add('is-visible'));
      const lineFill = document.querySelector<HTMLElement>('[data-timeline-line-fill]');
      if (lineFill) {
        lineFill.style.transform = 'scaleY(1)';
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
    );

    cards.forEach((card) => observer.observe(card));

    // --- Scroll-driven line fill + active card ---
    const lineFill = document.querySelector<HTMLElement>('[data-timeline-line-fill]');

    function getScrollProgress(section: HTMLElement): number {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight;
      const end = 0;
      const progress = (start - rect.top) / (start - end);
      return Math.max(0, Math.min(1, progress));
    }

    function getClosestCardToCenter(section: HTMLElement): number {
      const sectionCards = section.querySelectorAll<HTMLElement>('[data-timeline-card]');
      if (sectionCards.length === 0) return -1;

      const threshold = window.innerHeight * 0.45;
      let closestIdx = -1;
      let closestDist = Infinity;

      sectionCards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - threshold);

        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });

      return closestIdx;
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;

      rafRef.current = requestAnimationFrame(() => {
        sections.forEach((section) => {
          const progress = getScrollProgress(section);

          // Update line fill
          if (lineFill) {
            lineFill.style.transform = `scaleY(${progress})`;
          }

          // Update active card
          const activeIdx = getClosestCardToCenter(section);
          const sectionCards = section.querySelectorAll<HTMLElement>('[data-timeline-card]');

          sectionCards.forEach((card, i) => {
            if (i === activeIdx) {
              card.classList.add('is-active');
            } else {
              card.classList.remove('is-active');
            }
          });
        });

        tickingRef.current = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Trigger once on mount to set initial state
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return null;
}
