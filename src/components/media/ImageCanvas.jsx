import { useEffect, useRef } from 'react';
import { drawImage } from '../../lib/browser';

/** Draws a { width, height, data } image. Scales to its container; `pixelated` keeps hard pixel edges. */
export default function ImageCanvas({ image, pixelated = false, className = '', label, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    if (image) drawImage(ref.current, image);
  }, [image]);
  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      className={`block h-auto max-w-full ${pixelated ? 'pixelated' : ''} ${className}`}
      {...props}
    />
  );
}
