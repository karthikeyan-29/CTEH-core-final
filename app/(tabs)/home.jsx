import { View, Text } from 'react-native';
import React, { useState } from 'react'; // Added useState
import Header from '../../components/Home/Header';
import Events from '../../components/Home/Events';
import { useTheme } from '../_layout';

export default function home() {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState(''); // Added search state

  return (
    <View style={[{ backgroundColor: theme.background, height: '100%' }]}>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> {/* Added props */}
      <Events searchQuery={searchQuery} /> {/* Added prop */}
    </View>
  );
}