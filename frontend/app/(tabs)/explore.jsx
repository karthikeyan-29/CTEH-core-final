import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useTheme } from '../../app/_layout';
import { useRouter } from 'expo-router';
import axios from 'axios';  
import {BASE_URL} from '../../config/config';

const Explore = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchUsers();
      } else {
        setUsers([]);
      }
    }, 500); // Delay search by 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/users/search?search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer apikey`, // Replace with your Clerk API key
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error searching users", error);
    }
    setLoading(false);
  };

  const renderUserCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/Pages/ProfilePage?email=${item.email_addresses[0].email_address}`)}
      style={[styles.card, { backgroundColor: theme.container }]}
    >
      <Image
        style={[styles.cardImage, { backgroundColor: theme.secondary }]}
        source={{ uri: item.profile_image_url || 'https://via.placeholder.com/50' }}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={[styles.name, { color: theme.text }]}>{item.first_name} {item.last_name}</Text>
        <Text style={[styles.detail, { color: theme.text }]}>{item.email_addresses[0].email_address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Find Students</Text>
      <TextInput
        style={[styles.input, {
          color: theme.text,
          borderColor: theme.secondary,
          backgroundColor: theme.container
        }]}
        placeholder="Search for users"
        placeholderTextColor={theme.text + '80'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading && <ActivityIndicator size="large" color={theme.secondary} />}

      <FlatList
        data={users}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    fontSize: 25,
    fontFamily: 'outfit',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    width: '90%',
    padding: 10,
    fontFamily: 'outfit',
    marginHorizontal: 20,
    marginBottom: 20
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontFamily: 'outfit',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'outfit',
  }
});

export default Explore;
