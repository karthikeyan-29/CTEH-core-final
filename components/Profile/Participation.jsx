import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, FlatList,
  ActivityIndicator, Modal, TouchableOpacity, Alert
} from 'react-native';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useTheme } from '../../app/_layout';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { BASE_URL } from '../../config/config';

const Participation = () => {
  const { user } = useUser();
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);

  const API_URL = `${BASE_URL}/api/student/participation`;
  const IMAGE_URL = `${BASE_URL}/api/student/images`;
    const DELETE_URL = `${BASE_URL}/api/student/deleteCert`;
  const { theme } = useTheme();

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      const fetchParticipations = async () => {
        try {
          const response = await axios.get(`${API_URL}/${user.primaryEmailAddress.emailAddress}`);
          setParticipations(response.data || []);
        } catch (error) {
          setError('Failed to fetch participations');
        } finally {
          setLoading(false);
        }
      };
      fetchParticipations();
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
      setParticipations(prev => prev.filter(item => item.id !== id));
      setMenuVisible(null);
      alert('Deleted successfully');
    } catch (err) {
      // console.error('Delete failed:', err);
      alert('Failed to delete');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.container }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: user?.imageUrl }} style={styles.profilePic} />
          <Text style={[styles.username, { color: theme.text }]}>{item.eventName}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(menuVisible === item.id ? null : item.id)}>
          <Entypo name="dots-three-vertical" size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      {item.id && (
        <TouchableOpacity onPress={() => handleImagePress(`${IMAGE_URL}/${item.id}`)}>
          <Image source={{ uri: `${IMAGE_URL}/${item.id}` }} style={styles.postImage} />
        </TouchableOpacity>
      )}

      {menuVisible === item.id && (
        <View style={[styles.menuPopup, { backgroundColor: theme.container }]}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Confirm Delete', 'Are you sure you want to delete?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) },
              ])
            }>
            <Text style={[styles.menuText, { color: 'red' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
   <View style={{height:'100%'}}>
     <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerTitle}>
        <FontAwesome5 name="medal" size={24} color="#cd7f32" style={styles.icon} />
        <Text style={[styles.title, { color: theme.text }]}>Participations</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loading} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={participations}
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
   </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  icon: { marginRight: 8 },
  title: { fontSize: 22, fontWeight: 'bold', fontFamily: 'outfit' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', textAlign: 'center' },
  listContent: { paddingBottom: 20 },
  card: { borderRadius: 10, padding: 8, marginBottom: 12, elevation: 2 },
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
  profilePic: { width: 35, height: 35, borderRadius: 17.5, marginRight: 8 },
  username: { fontSize: 14, fontWeight: 'bold' },
  postImage: { width: '100%', height: 200, borderRadius: 8 },
  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  modalImage: { width: '90%', height: '60%', borderRadius: 10 },
  menuPopup: {
    position: 'absolute',
    top: 35,
    right: 15,
    padding: 12,
    borderRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  menuText: {
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'outfit',
  }
});

export default Participation;
