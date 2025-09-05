import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../app/_layout';
import { useRouter } from 'expo-router';
import { useDebounce } from 'use-debounce';
import { BASE_URL } from '../../config/config';

const Events = ({ searchQuery }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const API_URL = `${BASE_URL}/api/events`;
  const SEARCH_API_URL = `${BASE_URL}/api/events/search`;
  const IMAGE_BASE_URL = `${BASE_URL}/api/event`;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url =
        debouncedSearchQuery.trim() === ''
          ? API_URL
          : `${SEARCH_API_URL}?query=${encodeURIComponent(debouncedSearchQuery)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.warn('Expected JSON, got:', text);
        throw new Error('Invalid JSON response');
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error('FULL ERROR:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/Pages/eventDetails?id=${item.id}`)}
      style={[styles.card, { backgroundColor: theme.container }]}
    >
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
  );

  const renderFooter = () => (
    loading ? (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.secondary} />
      </View>
    ) : null
  );

  const renderError = () => (
    <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.text }}>{error}</Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: theme.secondary }]}
        onPress={fetchData}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !data.length) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.secondary} />
      </View>
    );
  }

  if (error) {
    return renderError();
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Upcoming Events</Text>
      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={renderFooter}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={true}
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
    width: 80,
    height: 80,
    borderRadius: 10,
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
  date: {
    fontSize: 14,
    fontFamily: 'outfit',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'outfit',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  retryButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'outfit',
  },
});

export default Events;
