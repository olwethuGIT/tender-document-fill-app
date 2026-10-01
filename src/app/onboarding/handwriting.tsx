import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { getRandomPracticePhrase } from '@/constants/phrases';
import { colors } from '@/constants/theme';

export default function HandwritingScreen() {
  const [phrase, setPhrase] = useState(getRandomPracticePhrase);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.stepLabel}>STEP 1 OF 1</Text>
        <Text style={styles.title}>Let’s check your handwriting</Text>
        <Text style={styles.description}>
          Write this phrase clearly on a piece of paper. Keep the whole page in
          view when you take your photo.
        </Text>
      </View>

      <Card>
        <Text style={styles.promptLabel}>PLEASE WRITE THIS PHRASE</Text>
        <Text accessibilityRole="text" style={styles.phrase}>
          {phrase}
        </Text>
      </Card>

      <View style={styles.actions}>
        <Button
          label="Take Photo"
          onPress={() =>
            router.push({
              pathname: '/onboarding/camera',
              params: { expected: phrase },
            })
          }
        />
        <Button
          label="Choose another phrase"
          variant="secondary"
          onPress={() => setPhrase(getRandomPracticePhrase())}
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
  promptLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  phrase: {
    marginTop: 14,
    color: colors.text,
    fontSize: 24,
    lineHeight: 34,
    fontWeight: '600',
  },
  actions: {
    marginTop: 'auto',
    gap: 12,
  },
});
