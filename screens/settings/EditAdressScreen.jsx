import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';
import { db, auth } from '../../firebaseConfig'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';


const EditAdressScreen = ({ route, navigation }) => {
  const { adressId } = route.params;
  const [adresse, setAdresse] = useState('');
  const [pays, setPays] = useState('');
  const [ville, setVille] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    const fetchAdressData = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid, 'adresses', adressId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const adressData = docSnap.data();
        setAdresse(adressData.adresse);
        setPays(adressData.pays);
        setVille(adressData.ville);
        setCodePostal(adressData.codePostal);
        setLabel(adressData.label);
      }
    };
    fetchAdressData();
  }, [adressId]);
  

  const handleUpdateAdress = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'adresses', adressId), {
        adresse, pays, ville, codePostal, label
      });
      Alert.alert("Adresse mise à jour !");
      navigation.goBack(); // Retourner à la page précédente
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'adresse', error);
    }
  };

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      <View style={tw`p-4`}>
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Adresse"
          value={adresse}
          onChangeText={setAdresse}
        />
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Pays"
          value={pays}
          onChangeText={setPays}
        />
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Ville"
          value={ville}
          onChangeText={setVille}
        />
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Code Postal"
          keyboardType="numeric"
          value={codePostal}
          onChangeText={setCodePostal}
        />
        <TextInput
          style={tw`border-b p-2 mb-4`}
          placeholder="Label de l'adresse"
          value={label}
          onChangeText={setLabel}
        />
        <Button title="Mettre à jour l'adresse" onPress={handleUpdateAdress} />
      </View>
    </ScrollView>
  );
};

export default EditAdressScreen;
