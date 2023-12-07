import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from '@rneui/themed';
import SettingsList from '../components/SettingsList';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const navigateToServiceScreen = () => {
    navigation.navigate('Services');
  };

  const navigateToHistoryScreen = () => {
    navigation.navigate('Historique');
  };

  const navigateToUserScreen = () => {
    navigation.navigate('UserScreen');
  };

  const navigateToAdressScreen = () => {
    navigation.navigate('AdressScreen');
  };

  const navigateToCarScreen = () => {
    navigation.navigate('CarScreen');
  };

  const navigateToLegalScreen = () => {
    navigation.navigate('LegalScreen');
  };

  const navigateToAboutScreen = () => {
    navigation.navigate('AboutScreen');
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`flex-1 items-center`}>
        
        <View style={tw`mt-10 p-10`}>
          <Text style={tw`text-2xl font-bold`}>Username</Text>
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
              {/* <Icon
                style={tw`p-2 bg-black rounded-full w-10 mt-4 ml-7`}
                name="arrowright"
                type="antdesign"
                color="white"
              /> */}
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
              {/* <Icon
                style={tw`p-2 bg-black rounded-full w-10 mt-4 ml-6`}
                name="arrowright"
                type="antdesign"
                color="white"
              /> */}
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
    </SafeAreaView>
  );
}

export default ProfileScreen;
