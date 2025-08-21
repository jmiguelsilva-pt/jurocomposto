import React, { useEffect, useRef } from 'react';
import { useInView } from './useInView';

interface RevealProps {
  className?: string;
  children: React.ReactNode;
}

const Reveal: React.FC<RevealProps> = ({ className = '', children }) => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const first = useRef(false);

  useEffect(() => {
    if (inView) first.current = true;
  }, [inView]);

  return (
    <div ref={ref} className={["reveal", (inView || first.current) ? 'in-view' : '', className].join(' ').trim()}>
      {children}
    </div>
  );
};

export default Reveal;
