import { Stack } from '@udp/ui-native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FileNavigator } from '../components/FileNavigator';
import ConnectScreen from '../components/ConnectScreen';
import { CollaborativeEditor } from '../components/CollaborativeEditor';
import { useDevicePairing } from '../hooks/useDevicePairing';
import { useYjsFiles } from '../hooks/useYjsFiles';

export const MobileHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connect' | 'browse' | 'edit'>(
    'connect'
  );
  const [pairingData, setPairingData] = useState<{
    roomId: string;
    serverIp: string;
    port: number;
  } | null>(null);
  const { state: pairingState } = useDevicePairing();
  const yjsFiles = useYjsFiles(
    pairingData?.serverIp || 'localhost',
    pairingData?.port || 3030,
    pairingData?.roomId || 'default-room'
  );

  const TabButton: React.FC<{
    tab: 'connect' | 'browse' | 'edit';
    icon: string;
    label: string;
  }> = ({ tab, icon, label }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabIcon, activeTab === tab && styles.activeTabText]}>
        {icon}
      </Text>
      <Text
        style={[styles.tabLabel, activeTab === tab && styles.activeTabText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>UDP Mobile</Text>
        <Text style={styles.subtitle}>
          {activeTab === 'connect'
            ? 'Device Connection'
            : activeTab === 'browse'
              ? 'Browse Files'
              : 'Real-time Editing'}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton tab='connect' icon='🔗' label='Connect' />
        <TabButton tab='browse' icon='📁' label='Browse' />
        <TabButton tab='edit' icon='✏️' label='Edit' />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'connect' ? (
          <ConnectScreen
            onConnected={(roomId, serverIp, port) => {
              setPairingData({ roomId, serverIp, port });
              if (isConnected) {
                setActiveTab('browse');
              }
            }}
          />
        ) : activeTab === 'browse' ? (
          isConnected ? (
            <FileNavigator
              repository={{
                id: 'udp-mobile',
                name: 'United Development Platform',
                owner: 'udp-team',
                defaultBranch: 'main',
                description: 'Mobile app for collaborative development',
              }}
              readOnly={false}
              showAIActions={true}
            />
          ) : (
            <View style={styles.disconnected}>
              <Text style={styles.disconnectedIcon}>🔌</Text>
              <Text style={styles.disconnectedTitle}>Not Connected</Text>
              <Text style={styles.disconnectedText}>
                Please connect to a host device first
              </Text>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => setActiveTab('connect')}
              >
                <Text style={styles.connectButtonText}>Go to Connect</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          isConnected ? (
            <CollaborativeEditor
              roomId={pairingData.roomId}
              documentId='main-document'
              userId={`mobile-user-${Math.random().toString(36).substr(2, 9)}`}
              userName='Mobile User'
            />
          ) : (
            <View style={styles.disconnected}>
              <Text style={styles.disconnectedIcon}>🔌</Text>
              <Text style={styles.disconnectedTitle}>Not Connected</Text>
              <Text style={styles.disconnectedText}>
                Please connect to a host device first
              </Text>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => setActiveTab('connect')}
              >
                <Text style={styles.connectButtonText}>Go to Connect</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6c757d',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  comingSoonIcon: {
    fontSize: 48,
    textAlign: 'center',
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  comingSoonFeatures: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'left',
    lineHeight: 22,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  disconnected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  disconnectedIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  disconnectedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  disconnectedText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
  },
  connectButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default MobileHome;
