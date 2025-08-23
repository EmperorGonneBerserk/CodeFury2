import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { fetchLatestPulses } from "../services/otxservice";

const { width } = Dimensions.get('window');

// Threat severity levels with colors
const getThreatLevel = (description) => {
  const text = description.toLowerCase();
  if (text.includes('critical') || text.includes('high') || text.includes('severe')) {
    return { level: 'Critical', color: '#EF4444', bgColor: '#FEF2F2' };
  } else if (text.includes('medium') || text.includes('moderate')) {
    return { level: 'Medium', color: '#F59E0B', bgColor: '#FFFBEB' };
  } else if (text.includes('low') || text.includes('minor')) {
    return { level: 'Low', color: '#10B981', bgColor: '#F0FDF4' };
  }
  return { level: 'Info', color: '#6366F1', bgColor: '#EEF2FF' };
};

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

export default function ThreatFeedScreen({ navigation }) {
  const [pulses, setPulses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);
      
      const data = await fetchLatestPulses();
      setPulses(data || []);
    } catch (err) {
      console.error('Error loading threat data:', err);
      setError('Failed to load threat intelligence data');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const showThreatDetails = (pulse) => {
    Alert.alert(
      "Threat Details",
      `${pulse.name}\n\n${pulse.description}`,
      [{ text: "OK" }]
    );
  };

  const renderThreatItem = ({ item, index }) => {
    const threatLevel = getThreatLevel(item.description || '');
    
    return (
      <TouchableOpacity
        style={styles.threatCard}
        onPress={() => showThreatDetails(item)}
        activeOpacity={0.7}
      >
        {/* Threat Level Indicator */}
        <View style={styles.threatHeader}>
          <View style={[styles.threatBadge, { backgroundColor: threatLevel.bgColor }]}>
            <View style={[styles.threatDot, { backgroundColor: threatLevel.color }]} />
            <Text style={[styles.threatLevel, { color: threatLevel.color }]}>
              {threatLevel.level}
            </Text>
          </View>
          
          <View style={styles.threatMeta}>
            <Text style={styles.timeAgo}>{formatTimeAgo(item.created)}</Text>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </View>
        </View>

        {/* Threat Content */}
        <Text style={styles.threatTitle} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.threatDescription} numberOfLines={3}>
          {item.description || 'No description available'}
        </Text>

        {/* Threat Footer */}
        <View style={styles.threatFooter}>
          <View style={styles.sourceInfo}>
            <Ionicons name="shield-outline" size={16} color="#6366F1" />
            <Text style={styles.sourceText}>Threat Intelligence</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bookmark-outline" size={16} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="shield-checkmark-outline" size={80} color="#64748B" />
      <Text style={styles.emptyTitle}>All Clear!</Text>
      <Text style={styles.emptyDescription}>
        No new threats detected. Your systems are secure.
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={() => loadData()}>
        <Ionicons name="refresh" size={20} color="#FFFFFF" />
        <Text style={styles.refreshButtonText}>Check Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
      <Text style={styles.errorTitle}>Connection Error</Text>
      <Text style={styles.errorDescription}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadData()}>
        <Ionicons name="reload" size={20} color="#FFFFFF" />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Threat Intelligence</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Scanning for threats...</Text>
            <Text style={styles.loadingSubtext}>Analyzing global threat intelligence</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Threat Intelligence</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{pulses.length}</Text>
          <Text style={styles.statLabel}>Active Threats</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Monitoring</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>Live</Text>
          <Text style={styles.statLabel}>Updates</Text>
        </View>
      </View>

      {/* Content */}
      {error ? renderErrorState() : (
        <FlatList
          data={pulses}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderThreatItem}
          style={styles.threatList}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6366F1']}
              tintColor="#6366F1"
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#6366F1",
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  placeholder: {
    width: 40,
    height: 40,
  },
  
  statsBar: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },
  
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#334155",
    marginHorizontal: 16,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  
  loadingCard: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    width: "100%",
  },
  
  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  
  loadingSubtext: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  
  threatList: {
    flex: 1,
  },
  
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  threatCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#6366F1",
  },
  
  threatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  
  threatBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  
  threatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  
  threatLevel: {
    fontSize: 12,
    fontWeight: "600",
  },
  
  threatMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  timeAgo: {
    fontSize: 12,
    color: "#64748B",
    marginRight: 8,
  },
  
  threatTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    lineHeight: 24,
  },
  
  threatDescription: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 22,
    marginBottom: 16,
  },
  
  threatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  sourceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  sourceText: {
    fontSize: 12,
    color: "#6366F1",
    marginLeft: 6,
    fontWeight: "600",
  },
  
  actionButtons: {
    flexDirection: "row",
  },
  
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 12,
  },
  
  emptyDescription: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  
  errorState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#EF4444",
    marginTop: 20,
    marginBottom: 12,
  },
  
  errorDescription: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});