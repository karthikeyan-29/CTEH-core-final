import { TextInput,View, Text,StyleSheet, TouchableOpacity,Alert } from 'react-native'
import React from 'react'
import { useTheme } from '../_layout';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useState } from 'react'; 
export default function updatePassword() {
      const { theme, toggleTheme } = useTheme()
        const { isSignedIn } = useAuth();
        const { user } = useUser();
      const [currentpassword, setcurrentpassword] = useState('');
      const [newpassword, setnewpassword] = useState('');
      const [confirmpassword, setconfirmpassword] = useState('');
      const [weakPassErr, setWeakPassErr] = useState('');
    const handleSubmit=async()=>{
        try{
            if (newpassword && confirmpassword) {
                if (newpassword === confirmpassword) {
                  await user.updatePassword({
                    currentPassword: currentpassword,
                    newPassword: newpassword
                  });
                  console.log("Password updated");
                  
                } else {
                    
                  Alert.alert('Error', 'New password and confirmation must match');
                  return;
                }
              }else{
                Alert.alert('Error','Please enter a new password');
                return;
              }
                    
                    setcurrentpassword('');
                    setnewpassword('');
                    setconfirmpassword('');
                    setWeakPassErr(null);
                    Alert.alert('Success', 'Your password has been changed.');
                    
            } catch(error){
            setWeakPassErr(error.message);
            Alert.alert('Error', `Failed to update profile: ${error.message}`);
        }
    };
        
  return (
     
    <View style={[{backgroundColor:theme.background,height:1000}]}>
      <Text>updatePassword</Text>
      <Text style={[styles.title,{color:theme.text}]}>Change Password</Text>
      <View style={styles.container}>
      <Text style={[styles.text, { color: theme.text }]}>Current Password</Text>
                  <TextInput
                    style={[styles.input, {
                      color: theme.text,
                      borderColor: theme.secondary,
                      backgroundColor: theme.container
                    }]}
                    placeholder='Current Password'
                    placeholderTextColor={theme.text + '80'}
                    value={currentpassword}
                    secureTextEntry={false}
                    onChangeText={setcurrentpassword}
                  />
      
                  {weakPassErr && weakPassErr.length > 0 && (
                    <Text style={[styles.error]}>{weakPassErr}</Text>
                  )}
      
                  <Text style={[styles.text, { color: theme.text }]}>New Password</Text>
                  <TextInput
                    style={[styles.input, {
                      color: theme.text,
                      borderColor: theme.secondary,
                      backgroundColor: theme.container
                    }]}
                    placeholder='New Password'
                    placeholderTextColor={theme.text + '80'}
                    value={newpassword}
                    secureTextEntry={false}
                    onChangeText={setnewpassword}
                  />
      
                  <Text style={[styles.text, { color: theme.text }]}>Confirm Password</Text>
                  <TextInput
                    style={[styles.input, {
                      color: theme.text,
                      borderColor: theme.secondary,
                      backgroundColor: theme.container
                    }]}
                    placeholder='Confirm Password'
                    placeholderTextColor={theme.text + '80'}
                    value={confirmpassword}
                    secureTextEntry={false}
                    onChangeText={setconfirmpassword}
                  />
                  <TouchableOpacity onPress={()=>handleSubmit()} style={[styles.button,{backgroundColor:theme.primary}]}>
                    <Text style={[styles.buttonText,{color:theme.text}]}>Change</Text>
                  </TouchableOpacity>
      </View>
    </View>
  )
}
const styles=StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 10,
        height: 50,
        width: 300,
        padding: 10,
        fontFamily: 'outfit',
        
      },
    
      container:{
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        gap:10,
        justifyContent:'center',
        marginTop:50,
        marginLeft:20
      },
      text:{
        fontSize:17,
        fontFamily:'outfit'
      },
      title:{
        fontSize:24,
        fontFamily:'outfit',
        marginLeft:85,
        marginTop:100
      },
      button:{
        borderRadius:10,
        height:40,
        width:100,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:100,
        marginTop:20
      },
      buttonText:{
        fontSize:17
      },
      error:{
        color:'red'
      }
})