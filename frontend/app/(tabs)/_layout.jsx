// app/(tabs)/_layout.jsx
import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from '../_layout'; // Import useTheme from your root layout

export default function TabLayout() {
  const { theme } = useTheme(); // Get the current theme

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary, // #007AFF (light) or #0A84FF (dark)
        tabBarInactiveTintColor: theme.text + '80', // #00000080 (light) or #FFFFFF80 (dark)
        tabBarStyle: {
          backgroundColor: theme.background, // #ffffff (light) or #000000 (dark)
          borderTopColor: theme.secondary + '40', // #5856D640 (light) or #5E5CE640 (dark)
        },
        tabBarLabelStyle: {
          fontFamily: 'outfit', // Consistent with your Profile page
          fontSize: 12,
        },
      }}
    >
      
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="search" size={24} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
     
    </Tabs>
  );
}