import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { HandwritingSessionProvider } from '@/contexts/HandwritingSessionContext';

export default function RootLayout() {
  return (
    <HandwritingSessionProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </HandwritingSessionProvider>
  );
}
