import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../_layout';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import {BASE_URL} from '../../config/config'
const CreateEvent = () => {
  const { theme } = useTheme();
  const [eventName, setEventName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [date, setDate] = useState('');
  const [userName, setUserName] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [image, setImage] = useState(null);
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [registerLink, setRegisterLink] = useState('');
  const [eventsArray, setEventsArray] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dummyImage = require('../../assets/images/image-add.png');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
  
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // opens cropping square
        aspect: undefined,   // remove fixed aspect to allow free crop
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImage({ uri });
        console.log('Image set in state:', uri);
      } else {
        console.log('Image picking cancelled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image');
    }
  };
  

  const handleSubmit = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(collegeEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(contactNumber)) {
      alert("Contact number should be exactly 10 digits.");
      return;
    }

    const datePattern = /^\d{2}-\d{2}-\d{4}$/;
    if (!datePattern.test(date)) {
      alert("Please enter a valid date in DD-MM-YYYY format.");
      return;
    }

    if (!eventName || !collegeName || !date || !userName || !collegeEmail || !registerLink) {
      alert("Please fill in all required fields.");
      return;
    }

    const newEvent = {
      eventName,
      universityName: collegeName,
      eventDate: date,
      creatorName: userName,
      collegeMailId: collegeEmail,
      contactNumber,
      description,
      registerLink
    };

    setEventsArray(prevEvents => [...prevEvents, { ...newEvent, image: image ? image.uri : null }]);

    const formData = new FormData();
    formData.append("event", JSON.stringify(newEvent));

    if (image && image.uri) {
      formData.append("imageFile", {
        uri: image.uri,
        type: "image/jpeg",
        name: "event-image.jpg",
      });
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/event`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Event added successfully:", response.data);
      alert("Event added successfully");
      resetForm();
    } catch (error) {
      console.error("Error adding event:", error.response?.data || error.message);
      alert("Error adding event: " + JSON.stringify(error.response?.data || error.message));
    }
  };

  const resetForm = () => {
    setEventName('');
    setCollegeName('');
    setDate('');
    setUserName('');
    setCollegeEmail('');
    setContactNumber('');
    setDescription('');
    setImage(null);
    setRegisterLink('');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Create New Event</Text>

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
          placeholder="Enter name"
          style={[styles.input, {
            color: theme.text,
            borderColor: theme.secondary,
            backgroundColor: theme.container
          }]}
          placeholderTextColor={theme.text + '80'}
          value={eventName}
          onChangeText={setEventName}
        />

        <Text style={[styles.label, { color: theme.text }]}>College Name</Text>
        <TextInput
          placeholder="University Name"
          style={[styles.input, {
            color: theme.text,
            borderColor: theme.secondary,
            backgroundColor: theme.container
          }]}
          placeholderTextColor={theme.text + '80'}
          value={collegeName}
          onChangeText={setCollegeName}
        />

        <Text style={[styles.label, { color: theme.text }]}>Event Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            placeholder="DD-MM-YYYY"
            style={[styles.input, {
              color: theme.text,
              borderColor: theme.secondary,
              backgroundColor: theme.container,
            }]}
            placeholderTextColor={theme.text + '80'}
            value={date}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                const formattedDate = selectedDate.toLocaleDateString('en-GB').split('/').join('-');
                setDate(formattedDate);
              }
            }}
          />
        )}

        <Text style={[styles.label, { color: theme.text }]}>Your Name</Text>
        <TextInput
          placeholder="Your Name"
          style={[styles.input, {
            color: theme.text,
            borderColor: theme.secondary,
            backgroundColor: theme.container
          }]}
          placeholderTextColor={theme.text + '80'}
          value={userName}
          onChangeText={setUserName}
        />

        <Text style={[styles.label, { color: theme.text }]}>College Email ID</Text>
        <TextInput
          placeholder="College Email Address"
          style={[styles.input, {
            color: theme.text,
            borderColor: theme.secondary,
            backgroundColor: theme.container
          }]}
          placeholderTextColor={theme.text + '80'}
          value={collegeEmail}
          onChangeText={setCollegeEmail}
          keyboardType="email-address"
        />

        <Text style={[styles.label, { color: theme.text }]}>Contact Number</Text>
        <TextInput
          placeholder="Contact Number"
          style={[styles.input, {
            color: theme.text,
            borderColor: theme.secondary,
            backgroundColor: theme.container
          }]}
          placeholderTextColor={theme.text + '80'}
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: theme.text }]}>Website / Registration link</Text>
        <TextInput
          placeholder="Registration link"
          style={[styles.input, {
            color: theme.text,
            borderColor: theme.secondary,
            backgroundColor: theme.container
          }]}
          placeholderTextColor={theme.text + '80'}
          value={registerLink}
          onChangeText={setRegisterLink}
        />

        <Text style={[styles.label, { color: theme.text }]}>Event Description</Text>
        <TextInput
          editable
          multiline
          numberOfLines={10}
          maxLength={500}
          onChangeText={setDescription}
          value={description}
          placeholder="Description"
          placeholderTextColor={theme.text + '80'}
          style={[styles.desInput, {
            color: theme.text,
            backgroundColor: theme.container,
            borderColor: theme.secondary
          }]}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: theme.container }]} 
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Create Event</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: theme.container }]} 
          onPress={resetForm}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {eventsArray.length > 0 && (
        <View style={styles.eventsList}>
          <Text style={[styles.label, { color: theme.text }]}>Stored Events:</Text>
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
    gap: 10
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    width: 300,
    padding: 10,
    fontFamily: 'outfit',
  },
  desInput: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    height: 100,
    width: 300
  },
  imageContainer: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    height: 200,
    width: 200
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40
  },
  submitButton: {
    height: 40,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  buttonText: {
    fontFamily: 'outfit',
    fontSize: 16,
  },
  eventsList: {
    marginTop: 20,
  },
});

export default CreateEvent;
