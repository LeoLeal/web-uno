import { useEffect, useState } from 'react';

type Breakpoint = 'mobile' | 'desktop';

/**
 * Returns the current breakpoint based on viewport width.
 * Mobile: < 768px
 * Desktop: >= 768px
 */
export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');

  useEffect(() => {
    // Listener for resize events
    const handleResize = () => {
      setBreakpoint(window.innerWidth >= 768 ? 'desktop' : 'mobile');
    };

    // Set initial value
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};
