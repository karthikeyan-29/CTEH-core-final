import { Image, View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { React, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../../app/_layout';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config/config';
import axios from 'axios';

export default function TopSection() {
  const [achievementCount, setAchievementCount] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [error, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false); // ✅ Modal state

  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const uploadImage = require('../../assets/images/image-add.png');

  const fetchAchievementCount = async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/student/achievementCount/${email}`);
      setAchievementCount(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch data');
      setAchievementCount(null);
    }
  };

  const fetchTotalEvents = async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/student/certificateCount/${email}`);
      setTotalCount(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch data');
      setTotalCount(null);
    }
  };

  useEffect(() => {
    if (user.emailAddresses) {
      fetchAchievementCount(user.emailAddresses);
      fetchTotalEvents(user.emailAddresses);
    }
  }, [user.emailAddresses]);

  return (
    <View style={{ backgroundColor: theme.background }}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image style={styles.profileImage} source={{ uri: user.imageUrl }} />
        </TouchableOpacity>
        <Text style={[styles.username, { color: theme.text }]}>{user.firstName}</Text>
        <Text style={[styles.bio, { color: theme.text }]}>Student at Vel Tech Multi Tech</Text>
      </View>

      <View style={styles.count}>
        <View style={styles.countCategory}>
          <Text style={[styles.countNumber, { color: theme.text }]}>{totalCount || '0'}</Text>
          <Text style={[styles.category, { color: theme.text }]}>Event Participated</Text>
        </View>
        <View style={styles.countCategory}>
          <Text style={[styles.countNumber, { color: theme.text }]}>{achievementCount || '0'}</Text>
          <Text style={[styles.category, { color: theme.text }]}>Achievement</Text>
        </View>
      </View>

      <View style={[styles.buttonContainer]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Pages/editProfile')}
          style={[styles.button, { backgroundColor: theme.container }]}
        >
          <Text style={[styles.text, { color: theme.text }]}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Pages/createEvent')}
          style={[styles.button, { backgroundColor: theme.container }]}
        >
          <Text style={[styles.text, { color: theme.text }]}>Create Event</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.certificationsContainer}>
        <Text style={[styles.certifications, { color: theme.text }]}>Upload</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Pages/upload')}>
          <Image style={styles.upImage} source={uploadImage} />
        </TouchableOpacity>
      </View>

      {/* ✅ Modal for full-screen profile image */}
      <Modal visible={isModalVisible} transparent={true}>
        <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
          <Image
            source={{ uri: user.imageUrl }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 100, // Keeps profile image round
  },
  bio: {
    fontFamily: 'outfit',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 40,
    width: 150,
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 15,
    marginLeft: 15,
  },
  text: {
    fontSize: 17,
    fontFamily: 'outfit',
    marginLeft: 30,
  },
  username: {
    fontSize: 20,
    fontFamily: 'outfit',
  },
  count: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  countCategory: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
  },
  countNumber: {
    fontFamily: 'outfit',
    fontSize: 25,
  },
  category: {
    fontFamily: 'outfit',
    fontSize: 17,
  },
  certificationsContainer: {
    marginLeft: 20,
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  certifications: {
    fontFamily: 'outfit',
    fontSize: 20,
  },
  upImage: {
    height: 30,
    width: 30,
  },


  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullImage: {
    width: 200, 
    height: 200, 
    borderRadius: 100, 
  },
});
