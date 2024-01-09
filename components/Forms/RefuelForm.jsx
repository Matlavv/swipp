import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { useNavigation } from '@react-navigation/native';
import {auth, db } from '../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import ChooseTimeModal from './ChooseTimeModal';

Geocoder.init("AIzaSyC7G4Z0E2levTb0mVYJOX_1bNgSVMvlK-Y");

const RefuelForm = () => {
 const [fuelType, setFuelType] = useState('');
 const [volume, setVolume] = useState('');
 const [carNumber, setCarNumber] = useState('');
 const [address, setAddress] = useState('');
 const [isModalVisible, setIsModalVisible] = useState(false);
 const [selectedTime, setSelectedTime] = useState(null);
 const times = ["08:00", "10:00", "12:00", "14:00", "16:00"];

 const navigation = useNavigation();

 const handleTimeSelect = (time) => {
  setSelectedTime(time);
  setIsModalVisible(false);
  console.log(`Horaire sélectionné : ${time}`);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  

 const handleLocatePress = async () => {
   let { status } = await Location.requestForegroundPermissionsAsync();
   if (status !== 'granted') {
     alert('Permission to access location was denied');
     return;
   }
  
   let location = await Location.getCurrentPositionAsync({});
   Geocoder.from(location.coords.latitude, location.coords.longitude)
     .then(json => {
       const addressComponent = json.results[0].formatted_address;
       setAddress(addressComponent);
     })
     .catch(error => console.warn(error));
 };

 const handleSubmit = async () => {
  if (!fuelType || !volume || !carNumber || !address) {
    Alert.alert('Erreur', 'Tous les champs sont obligatoires');
    return;
  }

  if (Number(carNumber) >= 2) {
    Alert.alert(
      "Information",
      "Si vous avez plus de 2 véhicules, veuillez contacter notre service client au 0123456789",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
    return;
  }

  const user = auth.currentUser;
  if (user) {
    try {
      const bookingDate = new Date(); // Date actuelle
      const formattedBookingDate = formatDate(bookingDate); // Formatage de la date
      const bookingData = {
        userId: user.uid,
        userName: user.displayName || 'Utilisateur Inconnu',
        fuelType,
        volume,
        carNumber,
        address,
        time: selectedTime,
        bookingDate: formattedBookingDate,
        created: bookingDate, 
        isActive: true
      };

      await addDoc(collection(db, 'RefuelBookings'), bookingData);
      Alert.alert("Rendez-vous confirmé", `Votre rendez-vous a été confirmé pour le ${selectedTime}`);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous', error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la confirmation du rendez-vous");
    }
  } else {
    Alert.alert("Erreur", "Vous devez être connecté pour effectuer cette action");
  }
   // Logic for handling form submission
   console.log('Form submitted');
 };

 return (
   <View style={tw`p-4`}>
     {/* Fuel Type */}
     <View style={tw`mb-4`}>
       <Text style={tw`text-lg font-bold`}>Type de carburant</Text>
       <Picker
         selectedValue={fuelType}
         onValueChange={(value) => setFuelType(value)}
         style={tw`border-b-2 border-black`}
       >
         <Picker.Item label="SP98" value="SP98" />
         <Picker.Item label="SP95" value="SP95" />
         <Picker.Item label="Gasoil" value="Gasoil" />
         <Picker.Item label="Diesel" value="Diesel" />
       </Picker>
     </View>

     {/* Volume in Liters */}
     <View style={tw`mb-4`}>
       <Text style={tw`text-lg font-bold`}>Volume en Litres</Text>
       <TextInput
         style={tw`border-b-2 border-black`}
         keyboardType="numeric"
         value={volume}
         onChangeText={setVolume}
       />
     </View>

     {/* Number of Vehicles */}
     <View style={tw`mb-4`}>
       <Text style={tw`text-lg font-bold`}>Nombre de véhicules</Text>
       <TextInput
         style={tw`border-b-2 border-black`}
         keyboardType="numeric"
         value={carNumber}
         onChangeText={setCarNumber}
       />
     </View>

     {/* Address */}
     <View style={tw`mb-4`}>
       <Text style={tw`text-lg font-bold`}>Adresse</Text>
       <TextInput
         style={tw`border-b-2 border-black`}
         value={address}
         onChangeText={setAddress}
       />
       <TouchableOpacity
         onPress={handleLocatePress}
       >
         <Text style={tw`text-blue-900 m-2`}> Me géolocaliser</Text>
       </TouchableOpacity>
     </View>

     <View>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={tw`bg-black p-2 rounded-md w-1/2 items-center`}
      >
        <Text style={tw`text-white`}>Choisir un Horaire</Text>
      </TouchableOpacity>
      {/* Choix de l'horaire */}
      <Text style={tw`text-lg`}>Horaire sélectionné : {selectedTime}</Text>

      {/* Composant Modale */}
      <ChooseTimeModal
        isVisible={isModalVisible}
        onTimeSelect={handleTimeSelect}
        onClose={() => setIsModalVisible(false)}
        times={times}
      />
     </View>

     {/* Submit Button */}
     <View style={tw`mb-4 flex items-center`}>
       <TouchableOpacity
         onPress={handleSubmit}
         style={tw`bg-black p-2 rounded-md w-1/2 items-center`}
       >
         <Text style={tw`text-white`}>Choisir mon rendez-vous</Text>
       </TouchableOpacity>
     </View>
   </View>
 );
};

export default RefuelForm;
