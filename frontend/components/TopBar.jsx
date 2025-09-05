import { View, Text ,StyleSheet,Image,TouchableOpacity} from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../app/_layout';
import { useNavigation } from '@react-navigation/native';
export default function TopBar() {
      const navigation = useNavigation();
      const locationImage = require('../assets/images/placeholder.png');
      const { user } = useUser();
      const { theme, toggleTheme } = useTheme();
  return (
    <View style={styles.topSection}>
            <View style={styles.locationSection}>
              <Image style={styles.locationImg} source={locationImage} />
              <Text style={{ fontFamily: 'outfit', color: theme.text }}>Chennai</Text>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('profile')}>
              <Image style={styles.userImage} source={{uri:user.imageUrl}} />
            </TouchableOpacity>
          </View>
          
  )
}
const styles=StyleSheet.create({
    userImage: {
        height: 50,
        width: 50,
        borderRadius: 99,
        marginLeft: 10,
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
})