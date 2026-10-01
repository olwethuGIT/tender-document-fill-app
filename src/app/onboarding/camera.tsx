import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { getRandomPracticePhrase } from '@/constants/phrases';
import { colors } from '@/constants/theme';
import { useHandwritingSession } from '@/contexts/HandwritingSessionContext';
import { ocrService } from '@/services/ocr/OCRService';

export default function CameraScreen() {
  const { expected } = useLocalSearchParams<{ expected?: string }>();
  const expectedText = expected ?? getRandomPracticePhrase();
  const cameraRef = useRef<CameraView>(null);
  const permissionPrompted = useRef(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const { setCapture } = useHandwritingSession();

  useEffect(() => {
    if (!permission || permission.granted || permissionPrompted.current) {
      return;
    }
    permissionPrompted.current = true;
    void requestPermission().catch(() => setCameraError(true));
  }, [permission, requestPermission]);

  async function takePhoto() {
    if (!cameraRef.current || !cameraReady || capturing) {
      return;
    }

    setCapturing(true);
    setCameraError(false);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) {
        throw new Error('Photo capture returned no image.');
      }
      const detectedText = await ocrService.recognizeHandwriting(photo.uri);
      setCapture({
        imageUri: photo.uri,
        expectedText,
        detectedText,
      });
      router.replace('/onboarding/handwriting-result');
    } catch {
      setCameraError(true);
      setCapturing(false);
    }
  }

  if (!permission) {
    return (
      <PermissionScreen
        message={
          cameraError
            ? 'Camera access could not be checked. Please try again.'
            : 'Checking camera access…'
        }
        actionLabel={cameraError ? 'Try again' : undefined}
        onAction={
          cameraError
            ? () => {
                setCameraError(false);
                permissionPrompted.current = false;
                void requestPermission().catch(() => setCameraError(true));
              }
            : undefined
        }
        error={cameraError}
        busy={!cameraError}
        onBack={() => router.back()}
      />
    );
  }

  if (!permission.granted) {
    return (
      <PermissionScreen
        message="Camera access is needed to photograph your handwriting."
        actionLabel={
          permission.canAskAgain ? 'Allow camera access' : 'Open settings'
        }
        onAction={
          permission.canAskAgain
            ? () => void requestPermission().catch(() => setCameraError(true))
            : () => void Linking.openSettings().catch(() => setCameraError(true))
        }
        error={cameraError}
        onBack={() => router.back()}
      />
    );
  }

  if (cameraError) {
    return (
      <PermissionScreen
        message="The camera could not be opened. Check your camera permission or try again on a supported device."
        actionLabel="Try again"
        onAction={() => {
          setCameraError(false);
          setCameraReady(false);
        }}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.cameraScreen} edges={['top', 'bottom']}>
      <View style={styles.cameraHeader}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Take a photo</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.previewFrame}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          onCameraReady={() => setCameraReady(true)}
          onMountError={() => setCameraError(true)}
        />
        <View pointerEvents="none" style={styles.guide}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      <View style={styles.cameraFooter}>
        <Text style={styles.cameraHint}>
          Place your handwriting inside the frame
        </Text>
        <Button
          label={capturing ? 'Reading photo…' : 'Capture photo'}
          onPress={() => void takePhoto()}
          disabled={!cameraReady || capturing}
        />
        {!cameraReady && !capturing ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.surface} />
            <Text style={styles.loadingText}>Starting camera…</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function PermissionScreen({
  message,
  actionLabel,
  onAction,
  onBack,
  error = false,
  busy = false,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onBack: () => void;
  error?: boolean;
  busy?: boolean;
}) {
  return (
    <SafeAreaView style={styles.permissionScreen} edges={['top', 'bottom']}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={styles.backButton}
      >
        <Text style={[styles.backButtonText, styles.permissionBackButtonText]}>
          ‹
        </Text>
      </Pressable>
      <View style={styles.permissionContent}>
        {busy ? <ActivityIndicator color={colors.primary} /> : null}
        <Text style={styles.permissionTitle}>
          {error ? 'Camera unavailable' : 'Camera access'}
        </Text>
        <Text style={styles.permissionMessage}>{message}</Text>
        {actionLabel && onAction ? (
          <Button label={actionLabel} onPress={onAction} />
        ) : null}
        {error ? (
          <Text accessibilityRole="alert" style={styles.errorText}>
            Please check the device settings and try again.
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cameraScreen: {
    flex: 1,
    backgroundColor: colors.cameraBackground,
  },
  cameraHeader: {
    minHeight: 58,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: colors.surface,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '300',
  },
  headerTitle: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '700',
  },
  previewFrame: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
    overflow: 'hidden',
    borderRadius: 24,
  },
  camera: {
    flex: 1,
  },
  guide: {
    ...StyleSheet.absoluteFill,
    margin: 28,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: colors.surface,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  cameraFooter: {
    minHeight: 142,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    gap: 14,
  },
  cameraHint: {
    color: colors.surface,
    textAlign: 'center',
    fontSize: 14,
  },
  loading: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: colors.surface,
    fontSize: 13,
  },
  permissionScreen: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 18,
  },
  permissionTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  permissionBackButtonText: {
    color: colors.text,
  },
  permissionMessage: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
});
