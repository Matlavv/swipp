import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyC7G4Z0E2levTb0mVYJOX_1bNgSVMvlK-Y");

const RefuelForm = () => {
 const [fuelType, setFuelType] = useState('');
 const [volume, setVolume] = useState('');
 const [carNumber, setCarNumber] = useState('');
 const [address, setAddress] = useState('');

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

 const handleSubmit = () => {
   if (!fuelType || !volume || !carNumber || !address) {
     alert('Tous les champs sont obligatoires');
     return;
   }

   if (Number(carNumber) >= 2) {
     Alert.alert(
       "Information",
       "Si vous avez plus de 2 véhicules, veuillez contacter notre service client au 0123456789",
       [
         {
           text: "OK",
           onPress: () => console.log("OK Pressed")
         }
       ]
     );
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
