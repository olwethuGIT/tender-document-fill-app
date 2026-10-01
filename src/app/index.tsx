import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';

const steps = [
  'Write a short practice phrase',
  'Take a photo of your handwriting',
  'Review the text before continuing',
];

export default function WelcomeScreen() {
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
  privacyNote: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
