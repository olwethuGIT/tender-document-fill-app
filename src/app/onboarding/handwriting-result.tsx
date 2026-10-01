import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { useHandwritingSession } from '@/contexts/HandwritingSessionContext';

export default function HandwritingResultScreen() {
  const { capture, setCapture } = useHandwritingSession();
  const [detectedText, setDetectedText] = useState(
    capture?.detectedText ?? '',
  );

  if (!capture) {
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
    detectedText.trim().toLocaleLowerCase() ===
    capture.expectedText.trim().toLocaleLowerCase();

  function confirmText() {
    const currentCapture = capture;
    if (!currentCapture) {
      return;
    }

    if (!detectedText.trim()) {
      Alert.alert(
        'Add the detected text',
        'OCR is not connected yet. Enter the text you can read from your photo before confirming.',
      );
      return;
    }

    setCapture({ ...currentCapture, detectedText });
    Alert.alert(
      'Handwriting confirmed',
      'Your verification step is complete. Tender document features will be added in a future phase.',
      [{ text: 'Start over', onPress: () => router.replace('/') }],
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.stepLabel}>REVIEW YOUR PHOTO</Text>
        <Text style={styles.title}>Check the recognised text</Text>
        <Text style={styles.description}>
          Compare the photo with the phrase. OCR is a placeholder in this
          version, so you can enter the text manually.
        </Text>
      </View>

      <Image
        accessibilityLabel="Photo of your handwriting"
        source={{ uri: capture.imageUri }}
        resizeMode="contain"
        style={styles.preview}
      />

      <Card>
        <Text style={styles.fieldLabel}>EXPECTED PHRASE</Text>
        <Text style={styles.expected}>{capture.expectedText}</Text>
        <Text style={[styles.matchStatus, matches && styles.matchSuccess]}>
          {matches
            ? 'The text matches the phrase.'
            : 'Review the detected text before confirming.'}
        </Text>
      </Card>

      <View style={styles.detectedGroup}>
        <Text style={styles.inputLabel}>DETECTED TEXT</Text>
        <TextInput
          accessibilityLabel="Detected text"
          value={detectedText}
          onChangeText={setDetectedText}
          placeholder="Enter the text shown in your photo"
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
          style={styles.input}
        />
      </View>

      <View style={styles.actions}>
        <Button
          label="Confirm"
          onPress={confirmText}
          disabled={!detectedText.trim()}
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
  detectedGroup: {
    gap: 8,
  },
  inputLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  input: {
    minHeight: 108,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: 16,
    lineHeight: 23,
  },
  actions: {
    gap: 12,
  },
});
