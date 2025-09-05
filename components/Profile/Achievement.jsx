import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useTheme } from '../../app/_layout';
import { BASE_URL } from '../../config/config';
import { Ionicons } from '@expo/vector-icons';

const Achievement = () => {
  const { user } = useUser();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuVisibleId, setMenuVisibleId] = useState(null); // To track which post's menu is open

  const API_URL = `${BASE_URL}/api/student/achievements`;
  const IMAGE_URL = `${BASE_URL}/api/student/images`;
  const DELETE_URL = `${BASE_URL}/api/student/deleteCert`; 
  const { theme } = useTheme();

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      const fetchAchievements = async () => {
        try {
          const response = await axios.get(`${API_URL}/${user.primaryEmailAddress.emailAddress}`);
          setAchievements(response.data || []);
        } catch (error) {
          setError('Failed to fetch achievements');
        } finally {
          setLoading(false);
        }
      };
      fetchAchievements();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DELETE_URL}/${id}`);
      setAchievements((prev) => prev.filter((item) => item.id !== id));
      setMenuVisibleId(null);
      alert('Deleted successfully');
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const renderItem = ({ item }) => (
    <View style={{height:'100%'}}>
      <View style={[styles.postContainer, { backgroundColor: theme.container }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: user?.imageUrl }} style={styles.profilePic} />
          <Text style={[styles.username, { color: theme.text }]}>{item.eventName}</Text>
        </View>

        <TouchableOpacity onPress={() => setMenuVisibleId(menuVisibleId === item.id ? null : item.id)}>
          <Ionicons name="ellipsis-vertical" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      {item.id && (
        <TouchableOpacity onPress={() => handleImagePress(`${IMAGE_URL}/${item.id}`)}>
          <Image source={{ uri: `${IMAGE_URL}/${item.id}` }} style={styles.postImage} />
        </TouchableOpacity>
      )}

      {menuVisibleId === item.id && (
        <View style={[styles.menuPopup, { backgroundColor: theme.container }]}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Confirm Delete', 'Are you sure you want to delete?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) },
              ])
            }>
            <Text style={[styles.menuItem, { color: 'red' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerTitle}>
        <Text style={[styles.title, { color: theme.text }]}>🏅 Achievements</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loading} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={achievements}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
          contentContainerStyle={styles.listContent}
          nestedScrollEnabled={true}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)} />
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  postContainer: {
    borderRadius: 10,
    padding: 8,
    marginBottom: 12,
    elevation: 2,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalImage: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
  },
  menuPopup: {
    position: 'absolute',
    top: 35,
    right: 15,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 5,
    zIndex: 10,
  },
  menuItem: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
});

export default Achievement;
