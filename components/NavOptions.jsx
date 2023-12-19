import React from 'react';
import { Text, View, SafeAreaView, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';

const NavOptions = () => {

 return (
  <SafeAreaView>
    {/* Two buttons */}
    <View style={tw`flex flex-row justify-center`}>
    {/* first button */}
    <LinearGradient
      colors={['#9bafd9', '#103783']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={tw`m-3 rounded-lg justify-center items-center`}
    >
      <TouchableOpacity
        style={tw`p-10 pl-6 pb-6 pt-3 m-2 justify-center items-center`}
      >
        <View>
          <Icon
            style={tw`ml-5`}
            name="local-car-wash"
            size={40}
            color="#fff"
          />
          <Text style={tw`mt-3 ml-2 pt-1 text-lg font-bold text-white`}>Entretiens</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
    
    {/* second button */}
    <LinearGradient
      colors={['#103783','#9bafd9']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={tw`m-3 rounded-lg justify-center items-center`}
    >
      <TouchableOpacity
        style={tw`p-10 pl-6 pb-6 pt-3 m-2`}
      >
        <View>
          <Icon
            name="warning"  
            style={tw`ml-5`}
            size={40}
            color="#fff" 
          />
          <Text style={tw`ml-2 mt-3 pt-1 text-lg font-bold text-white`}>Urgences</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
    </View> 
  </SafeAreaView>
 );
};

export default NavOptions;
