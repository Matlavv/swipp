import { Text, View, SafeAreaView, Image, TextInput, ScrollView } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';
import NavOptions from '../components/NavOptions';
import DisplayAdress from '../components/DisplayAdress';
import { swippLogo } from '../assets';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
 return (
   <SafeAreaView style={tw`flex bg-white h-full`}>
     <ScrollView style={tw`flex-1`}>
       {/* Logo */}
       <View style={tw`flex p-5 mt-3 justify-center items-center`}>
         <Image 
           style={tw`w-40 h-20`}
           source={swippLogo}
         />   
       </View>
       {/* Location bar */}
       <View style={tw`flex items-center ml-9 flex-row bg-gray-200 h-10 w-5/6 rounded-full`}>
       <Ionicons name="search" style={tw`p-2`} size={15} />
       <TextInput
         placeholder='Ou souhaitez-vous recevoir votre plein ?'
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
     </ScrollView>
   </SafeAreaView>
 )
}

export default HomeScreen;
