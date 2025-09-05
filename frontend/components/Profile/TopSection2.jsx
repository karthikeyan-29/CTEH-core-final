import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useTheme } from '../../app/_layout';
import { FontAwesome5 } from '@expo/vector-icons';
import { BASE_URL } from '../../config/config';

const { width } = Dimensions.get('window');

const TopSection2 = () => {
  const { email: rawEmail } = useLocalSearchParams();
  const email = rawEmail?.trim().toLowerCase();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [achievementCount, setAchievementCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [achievementPhotos, setAchievementPhotos] = useState([]);
  const [participationPhotos, setParticipationPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!email) {
      setError('No email provided');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer sk_test_JAuGVTTd887X5D6sh8rVg4mlr8udMglHu4YxW5TAYd`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.data.length > 0) {
          setUserData(response.data[0]);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user data:', err.response?.status, err.message);
        setError('Failed to fetch user data');
      }
    };

    const fetchCounts = async (retry = false) => {
      try {
        const studentRes = await axios.get(`${BASE_URL}/api/student/email/${email}`);
        if (!studentRes.data || studentRes.data.length === 0) {
          console.warn('No student data found for email:', email);
          setAchievementCount(0);
          setTotalCount(0);
          return;
        }
        console.log('Student records:', studentRes.data.map(s => ({ id: s.id, result: s.result })));

        const [achievementRes, certificateRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/student/achievementCount/${email}`).catch(err => {
            return { data: 0 };
          }),
          axios.get(`${BASE_URL}/api/student/certificateCount/${email}`).catch(err => {
            console.error('Certificate count failed:', err.response?.status, err.message);
            return { data: 0 };
          }),
        ]);

        console.log('Achievement count response:', achievementRes.data);
        console.log('Certificate count response:', certificateRes.data);

        setAchievementCount(Number(achievementRes.data) || 0);
        setTotalCount(Number(certificateRes.data) || 0);

        if (achievementRes.data === 0 && !retry && achievementRes.status === 404) {
          console.log('Retrying achievement count...');
          setTimeout(() => fetchCounts(true), 1000);
        }
      } catch (err) {
        // console.error('Error fetching counts:', {
        //   status: err.response?.status,
        //   message: err.message,
        //   url: err.config?.url,
        // });
        setAchievementCount(0);
        setTotalCount(0);
      }
    };

    const fetchAchievementPhotos = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/student/achievements/${encodeURIComponent(email)}`);
        setAchievementPhotos(res.data.map(student => student.imageData).filter(Boolean));
      } catch (err) {
        console.error('Error fetching achievement photos:', err.response?.status, err.message);
        setAchievementPhotos([]);
      }
    };

    const fetchParticipationPhotos = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/student/participation/${encodeURIComponent(email)}`);
        setParticipationPhotos(res.data.map(student => student.imageData).filter(Boolean));
      } catch (err) {
        console.error('Error fetching participation photos:', err.response?.status, err.message);
        setParticipationPhotos([]);
      }
    };

    Promise.all([fetchUserData(), fetchCounts(), fetchAchievementPhotos(), fetchParticipationPhotos()])
      .finally(() => setLoading(false));
  }, [email]);

  const renderImageModal = () => (
    <Modal visible={!!selectedImage} transparent>
      <Pressable style={styles.modalContainer} onPress={() => setSelectedImage(null)}>
        <Image
          source={{ uri: selectedImage }}
          style={styles.fullScreenImage}
          resizeMode="contain"
        />
      </Pressable>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    );
  }

  if (achievementCount === 0 && totalCount === 0) {
   
      <View style={styles.centered}>
        <Text style={{ color: theme.text, textAlign: 'center', padding: 20 }}>
          No achievements or certificates found for this user.
        </Text>
      </View>
    
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[
        styles.coverPhoto,
        { backgroundColor: theme.container },
        !userData?.profile_image_url && { backgroundColor: '#ccc' }
      ]} />

      <View style={styles.profileSection}>
        <Pressable onPress={() => setSelectedImage(userData?.profile_image_url || 'https://via.placeholder.com/100')}>
          <Image
            source={{ uri: userData?.profile_image_url || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
        </Pressable>
        <Text style={[styles.name, { color: theme.text }]}>
          {userData?.username || 'User'}
        </Text>
        <Text style={[styles.jobTitle, { color: theme.text }]}>Full Stack Developer | Zoho</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <FontAwesome5 name="medal" size={18} color="#FFD700" />
          <Text style={[styles.statValue, { color: theme.text }]}>{achievementCount}</Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Achievements</Text>
        </View>
        <View style={styles.statBox}>
          <FontAwesome5 name="award" size={18} color="#cd7f32" />
          <Text style={[styles.statValue, { color: theme.text }]}>{totalCount}</Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Participations</Text>
        </View>
      </View>

      <View style={styles.titleRow}>
        <FontAwesome5 name="medal" size={18} color="#FFD700" style={styles.icon} />
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {achievementPhotos.length > 0 ? (
          achievementPhotos.map((img, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedImage(`data:image/jpeg;base64,${img}`)}
            >
              <Image
                source={{ uri: `data:image/jpeg;base64,${img}` }}
                style={styles.photo}
              />
            </Pressable>
          ))
        ) : (
          <Text style={{ color: theme.text, padding: 10 }}>No Achievements Available</Text>
        )}
      </ScrollView>

      <View style={styles.titleRow}>
        <FontAwesome5 name="award" size={18} color="#cd7f32" style={styles.icon} />
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Participations</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {participationPhotos.length > 0 ? (
          participationPhotos.map((img, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedImage(`data:image/jpeg;base64,${img}`)}
            >
              <Image
                source={{ uri: `data:image/jpeg;base64,${img}` }}
                style={styles.photo}
              />
            </Pressable>
          ))
        ) : (
          <Text style={{ color: theme.text, padding: 10 }}>No Participations Available</Text>
        )}
      </ScrollView>

      {renderImageModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverPhoto: {
    width: '100%',
    height: 180,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    fontFamily: 'outfit',
  },
  jobTitle: {
    fontSize: 15,
    color: 'gray',
    fontFamily: 'outfit',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    fontFamily: 'outfit',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'outfit',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 10,
  },
  icon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'outfit',
  },
  imageScroll: {
    paddingLeft: 15,
    paddingBottom: 10,
    marginTop: 20,
  },
  photo: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 10,
    marginRight: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '80%',
    height: '80%',
  
  },
});

export default TopSection2;