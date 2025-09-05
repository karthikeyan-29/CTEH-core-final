import React, { useState ,useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  
  
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../_layout'; // Import theme hook from your root layout
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Feather} from '@expo/vector-icons';
import { BASE_URL } from '../../config/config';



const Profile = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme(); // Get theme and toggle function
  const [profileImage, setProfileImage] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const[username,setUserName]=useState('');


  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const { signOut } = useAuth(); 
  const sun=require('../../assets/images/Sun.png');
    useEffect(() => {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions!');
        }
      })();
    }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      setProfileImage({ uri, base64 });
    }
  };
  const deleteUserData=async()=>{
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      Alert.alert('Error', 'User email not found');
      return;
    }
    const email=user.primaryEmailAddress.emailAddress;
    try{
    await fetch(`${BASE_URL}/api/student/deleteByEmail`,{
        method:'DELETE',
        headers:{
          'Content-type':'application/json',
        
          },
          body:JSON.stringify({email})
          
      })
      await user.delete();
      navigation.replace('auth/LoginScreen');
      Alert.alert('Success, your acount has been deleted');
    }catch(error){
      Alert.alert('Error','Failed to delete account');
      console.log(error);
    }
  }
     //sign out
 const handleSignOut = async () => {
  if (!user || !user.primaryEmailAddress?.emailAddress) {
    Alert.alert('Error', 'User email not found');
    return;
  }

  const email = user.primaryEmailAddress.emailAddress;

  // Make API call to delete user data
  
    try {
      
      
      await signOut();
      navigation.replace('auth/LoginScreen'); 
      return;// Replace current screen with Login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
      console.log('Sign out error:', error);
    }
  };
  const handleSubmit = async () => {
    if (!isSignedIn || !user) {
      Alert.alert('Error', 'You must be signed in to update profile');
      return;
    }

    try {
      if (profileImage) {
        await user.setProfileImage({
          file: `data:image/jpeg;base64,${profileImage.base64}`,
        });
      }

      if (!firstName.trim() || !lastName.trim()) {
        Alert.alert('Error', 'First name and last name are required');
        return;
      }

      if (firstName && lastName && username) {
        await user.update({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          username:username.trim(),
        });
      }

      

      const newProfile = {
        id: user.id,
        profileImage: profileImage?.uri,
      };
      setProfiles([...profiles, newProfile]);

      setProfileImage(null);
      Alert.alert('Success', 'Profile updated successfully ');
      console.log('created')
      
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', `Failed to update profile: ${error.message}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={[styles.fixedHeader, { backgroundColor: theme.background }]}>
      
        <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>
        <TouchableOpacity
            style={styles.themeBg}
            onPress={toggleTheme}
          >
            <Feather
              name={theme.name=='light' ? 'sun' : 'moon'}
              size={28}
              color={theme.name =='light'? 'white' : 'black'}
            />
        </TouchableOpacity>
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* Profile Image Section */}
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage}>
              {profileImage?.uri ? (
                <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
              ) : user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
              ) : (
                <View style={[styles.placeholderImage, { backgroundColor: theme.container }]}>
                  <Text style={{ color: theme.text }}>No Image Selected</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Username</Text>
            <TextInput
              placeholder='Username'
              style={[styles.input, {
                color: theme.text,
                borderColor: theme.secondary,
                backgroundColor: theme.container
              }]}
              placeholderTextColor={theme.text + '80'}
              value={username}
              onChangeText={setUserName}
            />
            <Text style={[styles.label, { color: theme.text }]}>First Name</Text>
            <TextInput
              placeholder='First Name'
              style={[styles.input, {
                color: theme.text,
                borderColor: theme.secondary,
                backgroundColor: theme.container
              }]}
              placeholderTextColor={theme.text + '80'}
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text style={[styles.label, { color: theme.text }]}>Last Name</Text>
            <TextInput
              placeholder='Last Name'
              style={[styles.input, {
                color: theme.text,
                borderColor: theme.secondary,
                backgroundColor: theme.container
              }]}
              placeholderTextColor={theme.text + '80'}
              value={lastName}
              onChangeText={setLastName}
            />

            
          </View>
          <Text style={[{color:theme.text,marginTop:20}]}>________________________________________________________</Text>
          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: theme.primary,color:theme.otherText }]}
            onPress={handleSubmit}
          >
            <Text style={styles.text}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[{width:150}]}onPress={()=>navigation.navigate('Pages/updatePassword')} >
          <Text style={[styles.changePassword,{color:theme.primary}]}>Change password</Text>
          </TouchableOpacity>
          <View style={styles.actionContainer}>
  <TouchableOpacity onPress={deleteUserData} style={styles.deleteContainer}>
    <Icon name="trash-can-outline" size={22} color="red" style={{ marginRight: 6 }} />
    <Text style={styles.deleteCount}>Delete Account</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.signOutContainer} onPress={handleSignOut}>
    <Icon name="logout" size={22} color="red" style={{ marginRight: 6 }} />
    <Text style={styles.signOut}>Sign out</Text>
  </TouchableOpacity>
</View>

          
          {/* Submit Button */}
           
         
          
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    zIndex: 1,
    marginTop: 30,
    height: 50,
    justifyContent: 'center',
    display:'flex',
    flexDirection:'row',
    gap:160
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'outfit',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    display: 'flex',
    gap: 10,
    flexDirection: 'column',
  },
  label: {
    fontFamily: 'outfit',
    fontSize: 15,
  },
  changePassword:{
   fontSize:20,
   fontFamily:'outfit',
   marginTop:20,
   

  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    width: 300,
    padding: 10,
    fontFamily: 'outfit',
    
  },
  updateButton: {
    height: 40,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 100,
    marginTop: 20,
  },
  deleteContainer:{
   display:'flex',
   flexDirection:'row',
   alignItems:'center',
   
  },
  signOut:{
    color:'red',
    fontSize:20,
   fontFamily:'outfit',
   marginTop:10
   },
   deleteCount:{
     color:'red',
     fontSize:20,
     fontFamily:'outfit',
     marginTop:10
   },
   actionContainer: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
  },
  
  signOutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  sunImage:{
    height:35,
    width:35,
    
  },
  themeBg:{
    height:50,
    width:50,
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'outfit',
  },
  error: {
    color: '#ff4444', // Fixed error color for visibility in both themes
    fontFamily: 'outfit',
  },
});

export default Profile;