import { Image, View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import React from 'react';
import { useTheme } from '../_layout';
import { useNavigation } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import Navbar from '../../components/Profile/Navbar';
import TopSection from '../../components/Profile/TopSection';
import Achievement from '../../components/Profile/Achievement';
import Participation from '../../components/Profile/Participation';

export default function Profile() {
  const navigation = useNavigation();
  const { user, isLoaded } = useUser(); // use isLoaded to ensure user state is ready
  const { theme, toggleTheme } = useTheme();

  const data = [];

  if (!isLoaded) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!user) {
    // User signed out
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, fontFamily: 'outfit', fontSize: 18 }}>
          You have been signed out.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
    style={{height:'200%'
    }}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <View  style={{ backgroundColor: theme.background,height:'100%' }}>
          <Navbar />
      
          <TopSection />
          <Achievement />
          <Participation />
          
        </View>
        
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
