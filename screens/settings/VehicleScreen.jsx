import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';
import { db, auth } from '../../firebaseConfig'; 
import { doc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const VehicleScreen = () => {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [carburant, setCarburant] = useState('');
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [annee, setAnnee] = useState('');
  const [vehicles, setVehicles] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    loadVehicles();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadVehicles();
    }, [])
  );

  const navigateToEditVehicle = (vehicleId) => {
    navigation.navigate('EditVehicleScreen', { vehicleId, onGoBack: () => loadVehicles() });
  };
  
  const loadVehicles = async () => {
    const user = auth.currentUser;
    if (user) {
      const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'vehicles'));
      const userVehicles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVehicles(userVehicles);
    }
  };

  const handleAddVehicle = async () => {
    const user = auth.currentUser;
    if (user && label && type && immatriculation && carburant && marque && modele && annee) {
      try {
        await addDoc(collection(db, 'users', user.uid, 'vehicles'), {
          label, type, immatriculation, carburant, marque, modele, annee
        });
        Alert.alert("Voiture ajoutée !");
        setLabel('');
        setType('');
        setImmatriculation('');
        setCarburant('');
        setMarque('');
        setModele('');
        setAnnee('');
        loadVehicles();
      } catch (error) {
        console.error('Erreur lors de l\'ajout du véhicule', error);
      }
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
    }
  };

  const deleteVehicle = async (vehicleId) => {
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'vehicles', vehicleId));
      Alert.alert("Véhicule supprimé !");
      loadVehicles(); // Recharger la liste après la suppression
    } catch (error) {
      console.error('Erreur lors de la suppression du véhicule', error);
    }
  };

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      {/* Affichage des véhicules existants */}
      {vehicles.map((vehicle, index) => (
        <View key={index} style={tw`m-4 p-4 bg-white rounded-lg`}>
          <Text style={tw`text-lg font-bold`}>{vehicle.label}</Text>
          <Text>Modèle : {vehicle.marque} {vehicle.modele} </Text>
          <Text>Type: {vehicle.type}</Text>
          <Text>Plaque: {vehicle.immatriculation}</Text>
          <Text>Carburant: {vehicle.carburant}</Text>
          <Text>Année: {vehicle.annee}</Text>
          <Button title="Modifier" onPress={() => navigateToEditVehicle(vehicle.id)} />
          <Button title="Supprimer" onPress={() => deleteVehicle(vehicle.id)} />
        </View>
      ))}

      {/* Formulaire pour ajouter un nouveau véhicule */}
      <View style={tw`m-4`}>
        <TextInput style={tw`border-b p-2 mb-4`} placeholder="Label" value={label} onChangeText={setLabel} />
        <TextInput style={tw`border-b p-2 mb-4`} placeholder="Type (voiture, moto, scooter, camionette)" value={type} onChangeText={setType} />
        <TextInput style={tw`border-b p-2 mb-4`} placeholder="Plaque d'immatriculation" value={immatriculation} onChangeText={setImmatriculation} />
        <TextInput style={tw`border-b p-2 mb-4`} placeholder="Type de carburant (diesel, SP98, SP95, gasoil, E85)" value={carburant} onChangeText={setCarburant} />
        <TextInput style={tw`border-b p-2 mb-4`} placeholder="Marque" value={marque} onChangeText={setMarque} />
        <TextInput style={tw`border-b p-2 mb-4`} placeholder="Modèle" value={modele} onChangeText={setModele} />
        <TextInput style={tw`border-b p-2 mb-4`} placeholder="Année de circulation" keyboardType="numeric" value={annee} onChangeText={setAnnee} />
        <Button title="Ajouter le véhicule" onPress={handleAddVehicle} />
      </View>
    </ScrollView>
  );
};

export default VehicleScreen;
