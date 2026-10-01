import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { useHandwritingSession } from '@/contexts/HandwritingSessionContext';

export default function HandwritingResultScreen() {
  const { capture } = useHandwritingSession();
  const currentCapture = capture;

  if (!currentCapture) {
    return (
      <Screen>
        <Text style={styles.title}>No photo to review</Text>
        <Text style={styles.description}>
          Take a handwriting photo first, then return here to review it.
        </Text>
        <Button
          label="Start handwriting check"
          onPress={() => router.replace('/onboarding/handwriting')}
        />
      </Screen>
    );
  }

  const matches =
    currentCapture.detectedText.trim().toLocaleLowerCase() ===
    currentCapture.expectedText.trim().toLocaleLowerCase();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.stepLabel}>REVIEW YOUR PHOTO</Text>
        <Text style={styles.title}>Your handwriting sample</Text>
        <Text style={styles.description}>
          {currentCapture.detectedText
            ? 'Review the recognized text, then save this sample to use your writing style again.'
            : 'No text was recognized. You can still save the photo as your handwriting sample.'}
        </Text>
      </View>

      <Image
        accessibilityLabel="Photo of your handwriting"
        source={{ uri: currentCapture.imageUri }}
        resizeMode="contain"
        style={styles.preview}
      />

      <Card>
        <Text style={styles.fieldLabel}>EXPECTED PHRASE</Text>
        <Text style={styles.expected}>{currentCapture.expectedText}</Text>
        <Text style={styles.fieldLabel}>DETECTED TEXT</Text>
        <Text style={styles.expected}>
          {currentCapture.detectedText || 'No text was recognized in this photo.'}
        </Text>
        {currentCapture.detectedText ? (
          <Text style={[styles.matchStatus, matches && styles.matchSuccess]}>
            {matches
              ? 'The text matches the phrase.'
              : 'The detected text differs from the phrase.'}
          </Text>
        ) : null}
      </Card>

      <View style={styles.actions}>
        <Button
          label="Use this writing style"
          onPress={() => router.replace('/')}
        />
        <Button
          label="Retake Photo"
          variant="secondary"
          onPress={() =>
            router.replace({
              pathname: '/onboarding/camera',
              params: { expected: capture.expectedText },
            })
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
  },
  stepLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '800',
  },
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    backgroundColor: colors.border,
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  expected: {
    marginTop: 8,
    color: colors.text,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
  },
  matchStatus: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 13,
  },
  matchSuccess: {
    color: colors.primary,
    fontWeight: '700',
  },
  actions: {
    gap: 12,
  },
});
