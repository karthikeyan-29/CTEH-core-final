import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '../_layout';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useUser } from '@clerk/clerk-expo';
import axios from 'axios';
import { BASE_URL } from '../../config/config';

const UploadResult = () => {
  const { user } = useUser();
  const { theme } = useTheme();

  const [eventName, setEventName] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [result, setResult] = useState('');
  const [image, setImage] = useState(null);
  const [eventsArray, setEventsArray] = useState([]);
  const [resultModalVisible, setResultModalVisible] = useState(false);

  const dummyImage = require('../../assets/images/image-add.png');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,  // This allows cropping
      quality: 1,
      base64: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      // If image was selected, crop and set the image
      const { uri, width, height } = result.assets[0];
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: width, height: height } }], // Optional resize
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage({ uri: manipulatedImage.uri });
    }
  };

  const handleSubmit = async () => {
    if (!eventName || !collegeEmail || !name || !userName || !result || !image) {
      alert('Please fill in all fields!');
      return;
    }
    if (userName !== user.username) {
      alert('Invalid username!');
      return;
    }
    if (collegeEmail.trim().toLowerCase() !== user?.emailAddresses[0]?.emailAddress.toLowerCase()) {
      alert('Entered email does not match your account email');
      return;
    }
  
    const newResult = {
      eventName,
      collegeEmail,
      name,
      userName,
      result,
    };
  
    setEventsArray(prevEvents => [...prevEvents, { ...newResult, image: image ? image.uri : null }]);
  
    const formData = new FormData();
    formData.append('result', JSON.stringify(newResult));
  
    if (image && image.uri) {
      formData.append('imageFile', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'event-result-image.jpg',
      });
    }
  
    try {
      const response = await axios.post(
        `${BASE_URL}/api/student`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Result submitted successfully:', response.data);
      alert('Result submitted successfully');
      resetForm();
    } catch (error) {
      console.error('Error submitting result:', error.response?.data || error.message);
      alert('Error submitting result: ' + JSON.stringify(error.response?.data || error.message));
    }
  };
  const resetForm = () => {
    setEventName('');
    setCollegeEmail('');
    setName('');
    setUserName('');
    setResult('');
    setImage(null);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Submit Event Result</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image style={styles.image} source={{ uri: image.uri }} />
        ) : (
          <Image style={styles.image} source={dummyImage} />
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Event Name</Text>
        <TextInput
          placeholder="Enter event name"
          style={[styles.input, { color: theme.text, borderColor: theme.secondary, backgroundColor: theme.container }]}
          placeholderTextColor={theme.text + '80'}
          value={eventName}
          onChangeText={setEventName}
        />

        <Text style={[styles.label, { color: theme.text }]}>College Email ID</Text>
        <TextInput
          placeholder="Enter college email ID"
          style={[styles.input, { color: theme.text, borderColor: theme.secondary, backgroundColor: theme.container }]}
          placeholderTextColor={theme.text + '80'}
          value={collegeEmail}
          onChangeText={setCollegeEmail}
          keyboardType="email-address"
        />

        <Text style={[styles.label, { color: theme.text }]}>Name</Text>
        <TextInput
          placeholder="Enter your name"
          style={[styles.input, { color: theme.text, borderColor: theme.secondary, backgroundColor: theme.container }]}
          placeholderTextColor={theme.text + '80'}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.label, { color: theme.text }]}>Username</Text>
        <TextInput
          placeholder="Enter your username"
          style={[styles.input, { color: theme.text, borderColor: theme.secondary, backgroundColor: theme.container }]}
          placeholderTextColor={theme.text + '80'}
          value={userName}
          onChangeText={setUserName}
        />

        <Text style={[styles.label, { color: theme.text }]}>Result</Text>
        <TouchableOpacity onPress={() => setResultModalVisible(true)}>
          <TextInput
            placeholder="Select Result"
            style={[styles.input, { color: theme.text, borderColor: theme.secondary, backgroundColor: theme.container }]}
            placeholderTextColor={theme.text + '80'}
            value={result}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={resultModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setResultModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setResultModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.container }]}>
              <TouchableOpacity
                onPress={() => {
                  setResult('Win');
                  setResultModalVisible(false);
                }}
                style={styles.modalOption}
              >
                <Text style={{ color: theme.text }}>Win</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setResult('Participated');
                  setResultModalVisible(false);
                }}
                style={styles.modalOption}
              >
                <Text style={{ color: theme.text }}>Participated</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.container }]} onPress={handleSubmit}>
          <Text style={[styles.buttonText, { color: theme.text }]}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.container }]} onPress={resetForm}>
          <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {eventsArray.length > 0 && (
        <View style={styles.eventsList}>
          <Text style={[styles.label, { color: theme.text }]}>Stored Results:</Text>
          {eventsArray.map((event, index) => (
            <Text key={index} style={{ color: theme.text }}>
              {`${event.eventName} - ${event.userName}`}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    width: 300,
    padding: 10,
    fontFamily: 'outfit',
  },
  imageContainer: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%', // Full screen width
  },
  image: {
    height: 200, // Increased to be more prominent
    width: '100%',
    borderRadius:5,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
  submitButton: {
    height: 40,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'outfit',
    fontSize: 16,
  },
  eventsList: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  modalContent: {
    width: 250,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalOption: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
});

export default UploadResult;
