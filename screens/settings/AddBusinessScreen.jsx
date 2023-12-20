import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';
import { db, auth } from '../../firebaseConfig';
import { doc, collection, addDoc, getDocs, updateDoc } from 'firebase/firestore';

const AddBusinessScreen = () => {
    const [businessName, setBusinessName] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [businessPhone, setBusinessPhone] = useState('');
    const [businessId, setBusinessId] = useState(null);

    useEffect(() => {
        const fetchBusinessData = async () => {
          const user = auth.currentUser;
          if (user) {
            const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'businesses'));
            if (!querySnapshot.empty) {
              const businessData = querySnapshot.docs[0].data();
              setBusinessId(querySnapshot.docs[0].id);
              setBusinessName(businessData.businessName);
              setBusinessAddress(businessData.businessAddress);
              setBusinessPhone(businessData.businessPhone);
            }
          }
        };
    
        fetchBusinessData();
      }, []);

      const handleAddOrUpdateBusiness = async () => {
        const user = auth.currentUser;
        if (user) {
          try {
            const businessData = {
              businessName,
              businessAddress,
              businessPhone,
              // Autres champs
            };
      
            if (businessId) {
              // Mise à jour de l'entreprise existante
              await updateDoc(doc(db, 'users', user.uid, 'businesses', businessId), businessData);
              Alert.alert("Business Updated!");
            } else {
              // Ajout d'une nouvelle entreprise
              await addDoc(collection(db, 'users', user.uid, 'businesses'), businessData);
              Alert.alert("Business Added!");
            }
          } catch (error) {
            console.error('Error adding/updating business', error);
          }
        }
      };
      

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      <View style={tw`p-4`}>
        <TextInput
          style={tw`border w-80 p-2 mb-4`}
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
        />
        <TextInput
          style={tw`border w-80 p-2 mb-4`}
          placeholder="Business Address"
          value={businessAddress}
          onChangeText={setBusinessAddress}
        />
        <TextInput
          style={tw`border w-80 p-2 mb-4`}
          placeholder="Business Phone"
          value={businessPhone}
          onChangeText={setBusinessPhone}
        />
<Button title={businessId ? "Update Business" : "Add Business"} onPress={handleAddOrUpdateBusiness} />
      </View>
    </ScrollView>
  );
};

export default AddBusinessScreen;
