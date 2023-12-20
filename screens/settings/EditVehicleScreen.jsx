import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';
import { db, auth } from '../../firebaseConfig'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const EditVehicleScreen = ({ route, navigation }) => {
  const { vehicleId, onGoBack } = route.params;
  const [label, setLabel] = useState('');
  const [type, setType] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [carburant, setCarburant] = useState('');
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [annee, setAnnee] = useState('');
  

  useEffect(() => {
    const fetchVehicleData = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'vehicles', vehicleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const vehicleData = docSnap.data();
        setLabel(vehicleData.label);
        setType(vehicleData.type);
        setImmatriculation(vehicleData.immatriculation);
        setCarburant(vehicleData.carburant);
        setMarque(vehicleData.marque);
        setModele(vehicleData.modele);
        setAnnee(vehicleData.annee);
      }
    };
    fetchVehicleData();
  }, [vehicleId]);

  const handleUpdateVehicle = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'vehicles', vehicleId), {
        label, type, immatriculation, carburant, marque, modele, annee
      });
      Alert.alert("Véhicule mis à jour !");
      navigation.goBack(); // Retourner à la page précédente
    } catch (error) {
      console.error('Erreur lors de la mise à jour du véhicule', error);
    }
    if (onGoBack) onGoBack();
     navigation.goBack();
  };

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      <View style={tw`p-4`}>
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Label"
          value={label}
          onChangeText={setLabel}
        />
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Type (voiture, moto, scooter, camionette)"
          value={type}
          onChangeText={setType}
        />
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Plaque d'immatriculation"
          value={immatriculation}
          onChangeText={setImmatriculation}
        />
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Type de carburant (diesel, SP98, SP95, gasoil, E85)"
          value={carburant}
          onChangeText={setCarburant}
        />
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Marque"
          value={marque}
          onChangeText={setMarque}
        />
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Modèle"
          value={modele}
          onChangeText={setModele}
        />
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Année de circulation"
          keyboardType="numeric"
          value={annee}
          onChangeText={setAnnee}
        />
        <Button title="Mettre à jour le véhicule" onPress={handleUpdateVehicle} />
      </View>
    </ScrollView>
  );
};

export default EditVehicleScreen;
