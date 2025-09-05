import { TextInput, View, Image, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { navigate } from 'expo-router/build/global-state/routing';
import { useNavigation } from '@react-navigation/native';
import { Switch } from 'react-native-web';
import { useTheme } from '../../app/_layout';
import { useRouter } from 'expo-router';

export default function Header({ searchQuery, setSearchQuery }) { // Added props
  const navigation = useNavigation();
  const locationImage = require('../../assets/images/placeholder.png');
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.parent, { backgroundColor: theme.background }]}>
      <View style={styles.topSection}>
        <View style={styles.locationSection}>
          <Image style={styles.locationImg} source={locationImage} />
          <Text style={{ fontFamily: 'outfit', color: theme.text }}>Chennai</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('profile')}>
       
        {user && user.imageUrl ? (
  <Image style={styles.userImage} source={{ uri: user.imageUrl }} />
) : (
  <View style={[styles.userImage, { backgroundColor: 'gray' }]} />
)}

        </TouchableOpacity>
      </View>
      <Text style={[styles.haedingText, { color: theme.text }]}>
  Hi, {user?.firstName ? user.firstName : 'Guest'} 👋
</Text>

      <View>
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.secondary, backgroundColor: theme.container },
          ]}
          placeholder="Search"
          placeholderTextColor={theme.text}
          value={searchQuery} // Added value
          onChangeText={setSearchQuery} // Added onChangeText
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 99,
    marginLeft: 10,
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 20,
    padding: 15,
    height: 50,
  },
  parent: {
    display: 'flext',
    flexDirections: 'col',
    padding: 20,
    gap: 10,
  },
  haedingText: {
    fontSize: 25,
    marginLeft: 10,
    fontFamily: 'outfit',
  },
  locationImg: {
    height: 20,
    width: 20,
    borderRadius: 99,
  },
  locationSection: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});