import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

Geocoder.init("AIzaSyC7G4Z0E2levTb0mVYJOX_1bNgSVMvlK-Y");

const MaintenanceForm = () => {
  const [maintenanceType, setMaintenanceType] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      const user = auth.currentUser;
      if (user) {
        const vehiclesRef = db.collection('users').doc(user.uid).collection('vehicles');
        const snapshot = await vehiclesRef.get();
        const vehiclesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVehicles(vehiclesData);
      }
    };
    fetchVehicles();
  }, []);

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
  
        await addDoc(collection(db, 'RepairBookings'), bookingData);
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
      {/* Type d'entretien */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-bold`}>Type d'entretien</Text>
        <Picker
          selectedValue={maintenanceType}
          onValueChange={(itemValue) => setMaintenanceType(itemValue)}
        >
          <Picker.Item label="Contrôle technique" value="contrôle technique" />
          <Picker.Item label="Révision" value="révision" />
        </Picker>
      </View>

      {/* Sélection du véhicule */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-bold`}>Véhicule</Text>
        <Picker
          selectedValue={selectedVehicle}
          onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
        >
          {vehicles.map(vehicle => (
            <Picker.Item key={vehicle.id} label={vehicle.label} value={vehicle.id} />
          ))}
        </Picker>
      </View>

      {/* Adresse */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-bold`}>Secteur</Text>
        <TextInput
          style={tw`border-b-2 border-black`}
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity onPress={handleLocatePress}>
          <Text style={tw`text-blue-900 m-2`}>Me géolocaliser</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton de soumission */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={tw`bg-black p-2 rounded-md items-center`}
      >
        <Text style={tw`text-white`}>Soumettre</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MaintenanceForm;
