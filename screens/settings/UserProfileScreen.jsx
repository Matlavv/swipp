import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';
import { db, auth } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const UserProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProfessional, setIsProfessional] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
          setPhoneNumber(data.phoneNumber);
          setIsProfessional(data.isProfessional);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          username,
          firstName,
          lastName,
          email,
          phoneNumber
        });
        Alert.alert("Profile Updated!");
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const navigateToAddBusiness = () => {
    navigation.navigate('AddBusinessScreen');
  };

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      <View style={tw`p-4`}>
        <TextInput
          style={tw`border w-80 p-2 mb-4`}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={tw`border w-80 p-2 mb-4`}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={tw`border w-80 p-2 mb-4`}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={tw`border w-80 p-2 mb-4`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={tw`border w-80 p-2 mb-4`}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <Button title="Update Profile" onPress={handleUpdateProfile} />
        <Button title="Mon entreprise" onPress={navigateToAddBusiness} />
      </View>
    </ScrollView>
  );
};

export default UserProfileScreen;
