import { View, Text ,FlatList} from 'react-native'
import React from 'react'
import TopSection2 from  '../../components/Profile/TopSection2';
import Achievement from  '../../components/Profile/Achievement';
import Participation from '../../components/Profile/Participation';
import { useNavigation } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../_layout';
export default function ProfilePage() {
    const navigation = useNavigation();
    const { user } = useUser();
    const { theme, toggleTheme } = useTheme();
  
    // Data placeholder (empty array since we're not rendering list items)
    const data = [];
  
    return (
      <FlatList
      style={[{height:'100%'},{backgroundColor:theme.background}]}
        data={data} // Empty data since we're not using list items
        keyExtractor={(item, index) => index.toString()} 
        ListHeaderComponent={
          <View style={{ backgroundColor: theme.background }}>
            
            <TopSection2 />
            
          </View>
        }
      />
    );
}