import React, { useEffect, useRef } from 'react';

interface Props {
  containerId?: string;
}

const BuyMeACoffee: React.FC<Props> = ({ containerId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = containerId ? document.getElementById(containerId) : containerRef.current;
    if (!target) return;
    // Prevent duplicates on re-mounts
    target.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'jmss');
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-emoji', '');
    script.setAttribute('data-font', 'Poppins');
    script.setAttribute('data-text', 'Buy me a coffee');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#000000');
    script.setAttribute('data-coffee-color', '#ffffff');

    target.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center">{!containerId && <div ref={containerRef} />}</div>
  );
};

export default BuyMeACoffee;
