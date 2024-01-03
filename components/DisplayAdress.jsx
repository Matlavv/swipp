import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const DisplayAdress = () => {
  const [adresses, setAdresses] = useState([]);

  useEffect(() => {
    const loadAdresses = async () => {
      const user = auth.currentUser;
      if (user) {
        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'adresses'));
        const userAdresses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                                                .slice(0, 2); // Limite à 2 adresses
        setAdresses(userAdresses);
      }
    };

    loadAdresses();
  }, []);

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      {adresses.map((adresse, index) => (
        <View key={index}>
          <TouchableOpacity style={tw`flex-row justify-between items-center bg-white p-4 rounded-lg mx-4 mt-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-2xl font-bold text-black`}>{adresse.label}</Text>
              <Text style={tw`text-sm text-gray-500`}>{adresse.adresse}, {adresse.ville}</Text>
            </View>
            <View style={tw`w-12 h-12 rounded-full bg-gray-200 items-center justify-center`}>
              <Icon name="home" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <View style={tw`bg-gray-200 h-0.2 w-11/12 ml-5`} />
        </View>
      ))}
    </ScrollView>
  );
};

export default DisplayAdress;
