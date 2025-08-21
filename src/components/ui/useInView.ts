import { useEffect, useRef, useState } from 'react';

export const useInView = <T extends HTMLElement>(options?: IntersectionObserverInit) => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      });
    }, options || { threshold: 0.15 });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options, inView]);

  return { ref, inView } as const;
};
