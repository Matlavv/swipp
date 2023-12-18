import React from 'react';
import { Text, View, SafeAreaView, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import NavOptions from '../components/NavOptions';
import DisplayAdress from '../components/DisplayAdress';
import { swippLogo } from '../assets';
import { Ionicons } from '@expo/vector-icons';
import SuggestedList from '../components/SuggestedList';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const navigateToServiceScreen = () => {
    navigation.navigate('Services');
  };

  return (
    <SafeAreaView style={tw`flex bg-white h-full`}>
      <ScrollView style={tw`flex-1`}>
        {/* Logo */}
        <View style={tw`flex p-5 mt-3 justify-start items-start flex flex-row`}>
          <Image
            style={tw`w-35 h-20`}
            source={swippLogo}
          />
          <Text style={tw`text-2xl font-bold m-9`}>Bonjour, Mathis !</Text>
        </View>
        {/* Location bar */}
        <View style={tw`flex items-center ml-9 flex-row bg-gray-200 h-10 w-5/6 rounded-full`}>
          <Ionicons name="search" style={tw`p-2`} size={15} />
          <TextInput
            placeholder="Ou souhaitez-vous recevoir votre plein ?"
            style={tw`flex-1 px-2`}
          />
        </View>
        {/* My adresses */}
        <View>
          <DisplayAdress />
        </View>
        <View style={tw`flex ml-7`}>
          <NavOptions />
        </View>
        {/* Suggestions section */}
        <View style={tw`flex flex-row justify-between items-center p-2`}>
          <Text style={tw`text-xl font-semibold`}>Suggestions</Text>
          <TouchableOpacity onPress={navigateToServiceScreen}>
            <Text style={tw`font-semibold`}>Tout afficher</Text>
          </TouchableOpacity>
        </View>
        <SuggestedList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
