import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../app/_layout';
import { useUser } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import { useRouter } from 'expo-router';
import NavBar from '../../components/Profile/Navbar';
import Icon from 'react-native-vector-icons/Feather';

export default function postedEvents() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const IMAGE_BASE_URL = `${BASE_URL}/api/event`;

  useEffect(() => {
    if (!user) {
      Alert.alert('You are not signed in');
      return;
    }

    const fetchRegisteredEvents = async () => {
      try {
        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) return;

        const response = await axios.get(`${BASE_URL}/api/registered-events/${email}`);
        if (response.status === 200) {
          console.log("Fetched Registered Events: ", response.data);
          setEvents(response.data);
        } else {
          console.warn("No registered events found for this email.");
        }
      } catch (error) {
        console.error("Error fetching registered events: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [user]);

  const confirmAndDelete = (eventId) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => handleDelete(eventId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`${BASE_URL}/api/delete-event/${eventId}`);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error.message);
      Alert.alert("Failed to delete event");
    }
  };

  return (
    <View style={[{ height: '100%' }, { backgroundColor: theme.background }]}>
      <NavBar />
      <Text style={[styles.heading, { color: theme.text }]}>Posted Events</Text>

      {loading ? (
        <Text style={{ color: theme.text, padding: 10 }}>Loading...</Text>
      ) : events.length === 0 ? (
        <Text style={{ color: theme.text, padding: 10 }}>No registered events found.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/Pages/eventDetails?id=${item.id}`)}
              style={[styles.card, { backgroundColor: theme.container }]}
            >
              <TouchableOpacity
                style={styles.deleteIconContainer}
                onPress={(e) => {
                  e.stopPropagation(); // Prevent navigation
                  confirmAndDelete(item.id);
                }}
              >
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>

              <Image
                style={[styles.cardImage, { backgroundColor: theme.secondary }]}
                source={{ uri: `${IMAGE_BASE_URL}/${item.id}/image?t=${new Date().getTime()}` }}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={[styles.name, { color: theme.text }]}>{item.eventName}</Text>
                <Text style={[styles.date, { color: theme.text }]}>Date: {item.eventDate}</Text>
                <Text style={[styles.detail, { color: theme.text }]}>College name: {item.universityName}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontFamily: 'outfit',
    margin: 16,
  },
  card: {
    backgroundColor: '#eee',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  name: {
    fontSize: 18,
    fontFamily: 'outfit',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    fontFamily: 'outfit',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'outfit',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1,
   
    padding: 4,
    elevation: 3,
  },
});
