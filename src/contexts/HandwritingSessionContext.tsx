import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { loadWritingStyle } from '@/services/storage/WritingStyleStorage';

export interface HandwritingCapture {
  imageUri: string;
  expectedText: string;
  detectedText: string;
}

interface HandwritingSessionContextValue {
  capture: HandwritingCapture | null;
  setCapture: (capture: HandwritingCapture) => void;
  isLoading: boolean;
}

const HandwritingSessionContext =
  createContext<HandwritingSessionContextValue | null>(null);

export function HandwritingSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [capture, setCapture] = useState<HandwritingCapture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void loadWritingStyle()
      .then((savedCapture) => {
        if (active) {
          setCapture(savedCapture);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({ capture, setCapture, isLoading }),
    [capture, isLoading],
  );

  return (
    <HandwritingSessionContext.Provider value={value}>
      {children}
    </HandwritingSessionContext.Provider>
  );
}

export function useHandwritingSession(): HandwritingSessionContextValue {
  const context = useContext(HandwritingSessionContext);
  if (!context) {
    throw new Error(
      'useHandwritingSession must be used within HandwritingSessionProvider',
    );
  }
  return context;
}
