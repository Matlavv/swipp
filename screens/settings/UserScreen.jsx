import React, { useState, useEffect } from 'react';
import { View, Text, Button, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import SettingsList from '../../components/SettingsList';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../../firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';


const UserScreen = () => {
  const navigation = useNavigation();

  const navigateToServiceScreen = () => {
    navigation.navigate('Services');
  };

  const navigateToHistoryScreen = () => {
    navigation.navigate('Historique');
  };

  const navigateToUserScreen = () => {
    navigation.navigate('UserProfileScreen');
  };

  const navigateToAdressScreen = () => {
    navigation.navigate('AdressScreen');
  };

  const navigateToCarScreen = () => {
    navigation.navigate('VehicleScreen');
  };

  const navigateToLegalScreen = () => {
    navigation.navigate('LegalScreen');
  };

  const navigateToAboutScreen = () => {
    navigation.navigate('AboutScreen');
  };

  const [username, setUsername] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid); 
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setUsername(docSnap.data().username); 
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchUserData();
  }, [user]);
  

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };
  
  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`flex-1 items-center`}>
        
      <View style={tw`mt-10 p-10`}>
        <Text style={tw`text-2xl font-bold`}>{username || 'Username'}</Text>
      </View>


        <View style={tw`flex flex-row`}>
          {/* first button */}
          <TouchableOpacity
            onPress={navigateToServiceScreen}
            style={tw`p-10 pl-6 pb-8 pt-4 bg-gray-200 m-3 rounded-lg justify-center items-center`}
          >
            <View>
              <Ionicons
                style={tw`ml-7`}
                name="apps"
                size={40}
              />
              <Text style={tw`mt-3 ml-2 pt-1 text-lg font-bold`}>Services</Text>
            </View>
          </TouchableOpacity>
          {/* second button */}
          <TouchableOpacity
            onPress={navigateToHistoryScreen}
            style={tw`p-10 pl-6 pb-8 pt-4 bg-gray-200 m-3 rounded-lg justify-center items-center`}
          >
            <View>
              <Ionicons
                name="archive-outline"
                style={tw`ml-6`}
                size={40}
              />
              <Text style={tw`mt-3 ml-3 pt-1 text-lg font-bold`}>Activité</Text>
            </View>
          </TouchableOpacity>
        </View>     
        <View style={tw`bg-gray-200 h-1 w-full m-4`} />
           <SettingsList onPress={navigateToUserScreen} iconName="person" text="Gérer mon compte" />
        <View style={tw`bg-gray-950 h-0.3 w-1/2 m-4`} />
           <SettingsList onPress={navigateToAdressScreen} iconName="home" text="Mes adresses" />
        <View style={tw`bg-gray-950 h-0.3 w-1/2 m-4`} />
           <SettingsList onPress={navigateToCarScreen} iconName="car" text="Mes voitures" />
        <View style={tw`bg-gray-950 h-0.3 w-1/2 m-4`} />
           <SettingsList onPress={navigateToLegalScreen} iconName="bookmark" text="Mentions légales" />
        <View style={tw`bg-gray-950 h-0.3 w-1/2 m-4`} />
           <SettingsList onPress={navigateToAboutScreen} iconName="information-circle-sharp" text="A propos de Swipp" />
      </ScrollView>      
      <Button title="Déconnexion" onPress={handleSignOut} />
    </SafeAreaView>
  );
};

export default UserScreen;
