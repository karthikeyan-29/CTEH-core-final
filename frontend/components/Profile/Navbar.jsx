import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../../app/_layout';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
export default function Navbar() {
  const { user } = useUser();
  const { theme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation=useNavigation();
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View>
      <View style={styles.parent}>
        <Text style={[styles.username, { color: theme.text }]}>
          {user && user.username}
        </Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={toggleMenu}>
          <View style={[styles.menu, { backgroundColor: theme.container }]}>
            <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate('Pages/upload')}>
              <Text style={[styles.menuText, { color: theme.text }]}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuText, { color: theme.text }]}>Generate QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuText, { color: theme.text }]}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate('Pages/postedEvents')}>
              <Text style={[styles.menuText, { color: theme.text }]}>Posted Events</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  parent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 25,
    fontFamily: 'outfit',
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 15,
    width: 150,
    borderRadius: 10,
    paddingVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'outfit',
  },
});
