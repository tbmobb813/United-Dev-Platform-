/* eslint-disable no-console */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useEffect, useState } from 'react';
import { buildConfig } from '../config';

export type PairingStatus = 'idle' | 'registering' | 'pending' | 'connected' | 'error';

export interface PairingState {
  status: PairingStatus;
  roomId?: string;
  serverIp?: string;
  port?: number;
  deviceId?: string;
  error?: string;
}

const STORAGE_KEYS = {
  DEVICE_ID: '@udp_mobile_device_id',
  SERVER_IP: '@udp_mobile_server_ip',
  ROOM_ID: '@udp_mobile_room_id',
  PORT: '@udp_mobile_port',
};

export function useDevicePairing() {
  const [state, setState] = useState<PairingState>({ status: 'idle' });

  // Load persisted pairing state on mount
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const [deviceId, serverIp, roomId, portStr] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID),
          AsyncStorage.getItem(STORAGE_KEYS.SERVER_IP),
          AsyncStorage.getItem(STORAGE_KEYS.ROOM_ID),
          AsyncStorage.getItem(STORAGE_KEYS.PORT),
        ]);

        if (deviceId && serverIp && roomId && portStr) {
          const port = parseInt(portStr, 10);
          setState({
            status: 'connected',
            deviceId,
            serverIp,
            port,
            roomId,
          });
        }
      } catch (err) {
        console.error('Failed to load persisted pairing state:', err);
      }
    };

    loadPersistedState();
  }, []);

  const register = async (token: string, roomId: string, serverIp: string, port: number) => {
    setState({ status: 'registering' });

    try {
      // Generate device ID
      const deviceId = await Crypto.randomUUID();

      // Prepare device info
      const deviceInfo = {
        name: 'Mobile Device (UDP)',
        platform: 'mobile',
        createdAt: new Date().toISOString(),
      };

      // Call registration endpoint
      const config = buildConfig(serverIp, port);
      const response = await fetch(`${config.apiUrl}/api/devices/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          roomId,
          token,
          info: deviceInfo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`);
      }

      // Persist pairing state
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId),
        AsyncStorage.setItem(STORAGE_KEYS.SERVER_IP, serverIp),
        AsyncStorage.setItem(STORAGE_KEYS.PORT, port.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.ROOM_ID, roomId),
      ]);

      // Start polling for confirmation
      await waitForConfirmation(deviceId, roomId, serverIp, port);

      setState({
        status: 'connected',
        deviceId,
        roomId,
        serverIp,
        port,
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setState({ status: 'error', error });
      throw err;
    }
  };

  const waitForConfirmation = async (
    deviceId: string,
    roomId: string,
    serverIp: string,
    port: number
  ) => {
    const config = buildConfig(serverIp, port);
    const maxAttempts = 30;
    const pollInterval = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        setState({ status: 'pending', deviceId, roomId, serverIp, port });

        const response = await fetch(
          `${config.apiUrl}/api/devices/discover?roomId=${encodeURIComponent(roomId)}`
        );

        if (!response.ok) {
          throw new Error(`Discover failed: ${response.statusText}`);
        }

        const data: { confirmed?: Array<{ deviceId?: string }> } = await response.json();
        const confirmedDevices = data.confirmed || [];

        if (confirmedDevices.some((d) => d.deviceId === deviceId)) {
          return; // Device is confirmed!
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (err) {
        console.error(`Confirmation poll attempt ${attempt + 1} failed:`, err);
        // Continue polling despite errors
      }
    }

    throw new Error('Device confirmation timeout');
  };

  const reset = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.DEVICE_ID),
        AsyncStorage.removeItem(STORAGE_KEYS.SERVER_IP),
        AsyncStorage.removeItem(STORAGE_KEYS.ROOM_ID),
        AsyncStorage.removeItem(STORAGE_KEYS.PORT),
      ]);
    } catch (err) {
      console.error('Failed to clear pairing state:', err);
    }

    setState({ status: 'idle' });
  };

  return { state, register, reset };
}
