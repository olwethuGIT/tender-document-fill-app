import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export interface HandwritingCapture {
  imageUri: string;
  expectedText: string;
  detectedText: string;
}

interface HandwritingSessionContextValue {
  capture: HandwritingCapture | null;
  setCapture: (capture: HandwritingCapture) => void;
}

const HandwritingSessionContext =
  createContext<HandwritingSessionContextValue | null>(null);

export function HandwritingSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [capture, setCapture] = useState<HandwritingCapture | null>(null);
  const value = useMemo(() => ({ capture, setCapture }), [capture]);

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
