import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  increment,
  serverTimestamp,
  where,
  limit
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const CyberSafetyCommunity = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostVisible, setNewPostVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // Firestore listeners
  useEffect(() => {
    const q = query(
      collection(db, 'communityPosts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = [];
      snapshot.forEach((doc) => {
        postsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setPosts(postsData);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLikePost = async (postId, currentLikes, userLikes = []) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const postRef = doc(db, 'communityPosts', postId);
      const hasLiked = userLikes.includes(userId);

      if (hasLiked) {
        // Unlike
        await updateDoc(postRef, {
          likes: increment(-1),
          userLikes: userLikes.filter(id => id !== userId)
        });
      } else {
        // Like
        await updateDoc(postRef, {
          likes: increment(1),
          userLikes: [...userLikes, userId]
        });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      Alert.alert('Error', 'Failed to update like status');
    }
  };

  const handleCreatePost = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || !newPostTitle.trim() || !newPostContent.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'communityPosts'), {
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        authorId: userId,
        authorName: auth.currentUser?.displayName || 'Anonymous',
        category: 'General',
        likes: 0,
        replies: 0,
        userLikes: [],
        createdAt: serverTimestamp(),
        trending: false,
        urgent: false
      });

      setNewPostTitle('');
      setNewPostContent('');
      setNewPostVisible(false);
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Data will refresh automatically through Firestore listener
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSafetyTip = ({ item }) => (
    <TouchableOpacity style={styles.safetyTipCard}>
      <View style={styles.tipHeader}>
        <Ionicons name={item.icon} size={24} color={item.color} />
        <Text style={styles.tipTitle}>{item.title}</Text>
      </View>
      <Text style={styles.tipDescription}>{item.description}</Text>
      <TouchableOpacity style={styles.learnMoreBtn}>
        <Text style={styles.learnMoreText}>Learn More</Text>
        <Ionicons name="chevron-forward" size={16} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderDiscussionPost = ({ item }) => {
    const userId = auth.currentUser?.uid;
    const hasLiked = item.userLikes?.includes(userId);

    return (
      <TouchableOpacity style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.authorName?.charAt(0)?.toUpperCase() || 'A'}
              </Text>
            </View>
            <View>
              <Text style={styles.authorName}>{item.authorName || 'Anonymous'}</Text>
              <Text style={styles.postTime}>
                {item.createdAt?.toDate ? 
                  new Date(item.createdAt.toDate()).toLocaleDateString() : 
                  'Just now'
                }
              </Text>
            </View>
          </View>
          {item.urgent && (
            <View style={styles.urgentBadge}>
              <Ionicons name="warning" size={12} color="#FF3B30" />
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          )}
          {item.trending && (
            <View style={styles.trendingBadge}>
              <Ionicons name="trending-up" size={12} color="#FF9500" />
              <Text style={styles.trendingText}>Trending</Text>
            </View>
          )}
        </View>

        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postPreview} numberOfLines={2}>
          {item.content}
        </Text>

        <View style={styles.postCategory}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>

        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => handleLikePost(item.id, item.likes || 0, item.userLikes || [])}
          >
            <Ionicons 
              name={hasLiked ? "heart" : "heart-outline"} 
              size={16} 
              color={hasLiked ? "#FF3B30" : "#8E8E93"} 
            />
            <Text style={[styles.actionText, hasLiked && styles.likedText]}>
              {item.likes || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={16} color="#8E8E93" />
            <Text style={styles.actionText}>{item.replies || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="share-outline" size={16} color="#8E8E93" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const safetyTips = [
    {
      id: 1,
      title: 'Strong Password Creation',
      description: 'Use 12+ characters with mixed cases, numbers, and symbols. Avoid personal information.',
      icon: 'lock-closed',
      color: '#34C759'
    },
    {
      id: 2,
      title: 'Recognize Phishing',
      description: 'Check sender emails carefully, hover over links, and verify requests independently.',
      icon: 'mail',
      color: '#FF9500'
    },
    {
      id: 3,
      title: 'Software Updates',
      description: 'Keep your devices and apps updated to protect against security vulnerabilities.',
      icon: 'refresh',
      color: '#007AFF'
    },
    {
      id: 4,
      title: 'Two-Factor Authentication',
      description: 'Enable 2FA on important accounts for an extra layer of security.',
      icon: 'shield-checkmark',
      color: '#5856D6'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="notifications-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="search-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search discussions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discussions' && styles.activeTab]}
          onPress={() => setActiveTab('discussions')}
        >
          <Text style={[styles.tabText, activeTab === 'discussions' && styles.activeTabText]}>
            Discussions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
          onPress={() => setActiveTab('tips')}
        >
          <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
            Safety Tips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'alerts' && styles.activeTab]}
          onPress={() => setActiveTab('alerts')}
        >
          <Text style={[styles.tabText, activeTab === 'alerts' && styles.activeTabText]}>
            Alerts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'discussions' && (
        <FlatList
          data={filteredPosts}
          renderItem={renderDiscussionPost}
          keyExtractor={(item) => item.id}
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
              <Text style={styles.emptyTitle}>No discussions yet</Text>
              <Text style={styles.emptyDescription}>
                Start the conversation about cyber safety
              </Text>
            </View>
          )}
        />
      )}

      {activeTab === 'tips' && (
        <FlatList
          data={safetyTips}
          renderItem={renderSafetyTip}
          keyExtractor={(item) => item.id.toString()}
          style={styles.content}
        />
      )}

      {activeTab === 'alerts' && (
        <View style={styles.alertsContent}>
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={24} color="#FF3B30" />
              <Text style={styles.alertTitle}>New Phishing Campaign</Text>
            </View>
            <Text style={styles.alertDescription}>
              Reports of fake banking emails targeting users. Be cautious of suspicious links.
            </Text>
            <Text style={styles.alertTime}>2 hours ago</Text>
          </View>
        </View>
      )}

      {/* Floating Action Button */}
      {activeTab === 'discussions' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setNewPostVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Create Post Modal - Simple version */}
      {newPostVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Discussion</Text>
              <TouchableOpacity onPress={() => setNewPostVisible(false)}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Discussion title"
              value={newPostTitle}
              onChangeText={setNewPostTitle}
              placeholderTextColor="#8E8E93"
            />
            
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Share your thoughts or ask a question..."
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#8E8E93"
            />
            
            <TouchableOpacity style={styles.postButton} onPress={handleCreatePost}>
              <Text style={styles.postButtonText}>Post Discussion</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerBtn: {
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  filterBtn: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  postTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '500',
    marginLeft: 4,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '500',
    marginLeft: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  postPreview: {
    fontSize: 16,
    color: '#3C3C43',
    lineHeight: 22,
    marginBottom: 12,
  },
  postCategory: {
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  likedText: {
    color: '#FF3B30',
  },
  safetyTipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  tipDescription: {
    fontSize: 16,
    color: '#3C3C43',
    lineHeight: 22,
    marginBottom: 16,
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 4,
  },
  alertsContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  alertDescription: {
    fontSize: 16,
    color: '#3C3C43',
    lineHeight: 22,
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3C3C43',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#000000',
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CyberSafetyCommunity;