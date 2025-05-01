import React, { useEffect, useRef } from 'react';
import worldSVG from '../../assets/world.svg?raw';

export default function WorldMap({ selectedCountryCode }) {
  const svgContainerRef = useRef(null);

  useEffect(() => {
    if (svgContainerRef.current && selectedCountryCode) {
      // Remove previous highlight
      const prev = svgContainerRef.current.querySelector('.country-highlight');
      if (prev) prev.classList.remove('country-highlight');

      // Highlight the selected country
      const countryPath = svgContainerRef.current.querySelector(`#${selectedCountryCode}`);
      if (countryPath) {
        countryPath.classList.add('country-highlight');
      }
    }
  }, [selectedCountryCode]);

  return (
    <div className="w-full h-auto" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div
        ref={svgContainerRef}
        dangerouslySetInnerHTML={{ __html: worldSVG }}
        style={{ width: '100%', height: 'auto', maxHeight: '350px' }}
      />
      <style>{`
        .country-highlight {
          fill: #38bdf8 !important;
          stroke: #0ea5e9 !important;
          stroke-width: 2 !important;
          filter: drop-shadow(0 0 6px #38bdf8);
        }
        svg {
          width: 100% !important;
          height: auto !important;
          max-height: 350px !important;
          display: block;
        }
      `}</style>
    </div>
  );
} 