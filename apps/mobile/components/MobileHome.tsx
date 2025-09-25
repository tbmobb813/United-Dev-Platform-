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

export const MobileHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'collaborate'>(
    'browse'
  );

  const TabButton: React.FC<{
    tab: 'browse' | 'collaborate';
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
          {activeTab === 'browse' ? 'Browse Files' : 'Collaborate'}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton tab="browse" icon="📁" label="Browse" />
        <TabButton tab="collaborate" icon="✏️" label="Edit" />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'browse' ? (
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
          <View style={styles.comingSoon}>
            <Stack gap="medium" style={{}}>
              <Text style={styles.comingSoonIcon}>🚧</Text>
              <Text style={styles.comingSoonTitle}>Coming Soon</Text>
              <Text style={styles.comingSoonText}>
                Real-time collaborative editing will be available here
              </Text>
              <Text style={styles.comingSoonFeatures}>
                Features:
                {'\n'}• Live code editing with others
                {'\n'}• Real-time cursor tracking
                {'\n'}• Voice/video chat integration
                {'\n'}• Conflict resolution
              </Text>
            </Stack>
          </View>
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
});

export default MobileHome;
