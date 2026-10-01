import { router } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { useHandwritingSession } from '@/contexts/HandwritingSessionContext';

const steps = [
  'Write a short practice phrase',
  'Take a photo of your handwriting',
  'Review the text before continuing',
];

export default function WelcomeScreen() {
  const { capture, isLoading } = useHandwritingSession();

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (capture) {
    return (
      <Screen>
        <View style={styles.intro}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>T</Text>
          </View>
          <Text style={styles.eyebrow}>TENDER & QUOTATION ASSISTANT</Text>
          <Text style={styles.title}>
            {Platform.OS === 'web'
              ? 'Your handwriting sample is ready.'
              : 'Your handwriting style is saved.'}
          </Text>
          <Text style={styles.description}>
            {Platform.OS === 'web'
              ? 'This sample is available for this browser session. Use the mobile app to save it for next time.'
              : 'We’ll reuse this sample, so you won’t need to write the practice phrase again.'}
          </Text>
        </View>

        <Image
          accessibilityLabel="Saved handwriting sample"
          source={{ uri: capture.imageUri }}
          resizeMode="contain"
          style={styles.savedSample}
        />

        <Card>
          <Text style={styles.cardTitle}>Recognized text</Text>
          <Text style={styles.cardDescription}>
            {capture.detectedText || 'No text was recognized in this sample.'}
          </Text>
        </Card>

        <View style={styles.footer}>
          <Button
            label="Capture a new sample"
            onPress={() => router.push('/onboarding/handwriting')}
          />
          <Text style={styles.privacyNote}>
            {Platform.OS === 'web'
              ? 'Web handwriting samples are not saved between sessions.'
              : 'Your handwriting sample is saved on this device.'}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.intro}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>T</Text>
        </View>
        <Text style={styles.eyebrow}>TENDER & QUOTATION ASSISTANT</Text>
        <Text style={styles.title}>Tender paperwork, made simpler.</Text>
        <Text style={styles.description}>
          Verify handwritten information before preparing your business
          documents.
        </Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Your first step</Text>
        <Text style={styles.cardDescription}>
          We’ll ask you to copy a short phrase and take a photo. You can review
          the text before confirming it.
        </Text>
        <View style={styles.steps}>
          {steps.map((step, index) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.footer}>
        <Button
          label="Start"
          onPress={() => router.push('/onboarding/handwriting')}
        />
        <Text style={styles.privacyNote}>
          Your photo stays on this device in this preview.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    alignItems: 'flex-start',
    gap: 14,
    paddingTop: 12,
  },
  brandMark: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  brandMarkText: {
    color: colors.surface,
    fontSize: 26,
    fontWeight: '800',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  description: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 25,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  cardDescription: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  steps: {
    marginTop: 24,
    gap: 17,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  footer: {
    marginTop: 'auto',
    gap: 12,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedSample: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    backgroundColor: colors.border,
  },
  privacyNote: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
