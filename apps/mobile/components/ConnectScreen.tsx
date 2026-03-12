import { CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDevicePairing } from '../hooks/useDevicePairing';

interface ConnectScreenProps {
  onConnected: (roomId: string, serverIp: string, port: number) => void;
  autoStartToken?: string;
  autoStartRoom?: string;
}

export const ConnectScreen: React.FC<ConnectScreenProps> = ({
  onConnected,
  autoStartToken,
  autoStartRoom,
}) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualToken, setManualToken] = useState(autoStartToken || '');
  const [manualServerIp, setManualServerIp] = useState('192.168.1.1');
  const [manualPort, setManualPort] = useState('3030');

  const cameraRef = useRef<CameraView>(null);
  const { state, register } = useDevicePairing();

  // Request camera permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setPermission(status === 'granted');
    };

    requestPermission();
  }, []);

  // Auto-start pairing if token and room provided
  useEffect(() => {
    if (autoStartToken && autoStartRoom && isFocused && state.status === 'idle') {
      handleQRParsed(autoStartToken, autoStartRoom);
    }
  }, [autoStartToken, autoStartRoom, isFocused, state.status]);

  const parseQRCode = (data: string): { token: string; room: string } | null => {
    try {
      const url = new URL(data);
      const token = url.searchParams.get('token');
      const room = url.searchParams.get('room');

      if (!token || !room) {
        return null;
      }

      return { token, room };
    } catch {
      return null;
    }
  };

  const handleQRParsed = async (token: string, roomId: string) => {
    try {
      const serverIp = manualServerIp || 'localhost';
      const port = parseInt(manualPort, 10) || 3030;

      await register(token, roomId, serverIp, port);
      onConnected(roomId, serverIp, port);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      Alert.alert('Pairing Failed', error);
    }
  };

  const handleBarcodeScan = (result: any) => {
    if (!isFocused || state.status !== 'idle') {
      return; // Ignore scans if not focused or already pairing
    }

    const parsed = parseQRCode(result.data);
    if (parsed) {
      setShowManualEntry(false);
      handleQRParsed(parsed.token, parsed.room);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualToken.trim()) {
      Alert.alert('Error', 'Please enter a pairing token');
      return;
    }

    const roomId = autoStartRoom || 'default-room';
    await handleQRParsed(manualToken, roomId);
  };

  if (permission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Requesting camera access...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (permission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorTitle}>Camera access required</Text>
          <Text style={styles.errorText}>
            UDP Mobile needs camera access to scan QR codes for pairing.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => setShowManualEntry(true)}>
            <Text style={styles.buttonText}>Use Manual Entry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (state.status === 'registering' || state.status === 'pending') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.statusTitle}>
            {state.status === 'registering' ? 'Registering device...' : 'Waiting for confirmation...'}
          </Text>
          <Text style={styles.statusText}>
            {state.status === 'registering'
              ? 'Setting up your device for pairing'
              : 'Please confirm this device on your host'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state.status === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorTitle}>Pairing Failed</Text>
          <Text style={styles.errorText}>{state.error || 'Unknown error occurred'}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowManualEntry(!showManualEntry)}
          >
            <Text style={styles.buttonText}>
              {showManualEntry ? 'Show QR Scanner' : 'Use Manual Entry'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} testID="connect-screen-root">
      {!showManualEntry ? (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            onBarcodeScanned={handleBarcodeScan}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <View style={styles.scannerOverlay}>
            <Text style={styles.scanTitle}>Scan QR Code</Text>
            <Text style={styles.scanSubtitle}>
              Scan the QR code displayed on your host device
            </Text>
            <View style={styles.scanFrame} />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton} onPress={() => setShowManualEntry(true)}>
              <Text style={styles.footerButtonText}>Manual Entry</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.manualContainer}>
            <Text style={styles.manualTitle}>Manual Pairing</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Server IP Address</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 192.168.1.1"
                value={manualServerIp}
                onChangeText={setManualServerIp}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Port</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 3030"
                value={manualPort}
                onChangeText={setManualPort}
                keyboardType="number-pad"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pairing Token</Text>
              <TextInput
                style={styles.input}
                placeholder="Paste the pairing token"
                value={manualToken}
                onChangeText={setManualToken}
                placeholderTextColor="#9ca3af"
                secureTextEntry={false}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleManualSubmit}>
              <Text style={styles.submitButtonText}>Connect</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setShowManualEntry(false);
                setManualToken('');
              }}
            >
              <Text style={styles.backButtonText}>Back to QR Scanner</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  scanSubtitle: {
    fontSize: 14,
    color: '#c7d2e0',
    marginBottom: 20,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00ff00',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#c7d2e0',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#c7d2e0',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  manualContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  manualTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#c7d2e0',
    marginBottom: 6,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    fontSize: 14,
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ConnectScreen;
