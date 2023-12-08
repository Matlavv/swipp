import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from '@rneui/themed';


const NavOptions = () => {

 return (
  <View style={tw`flex flex-row`}>
  {/* first button */}
  <TouchableOpacity
    style={tw`p-10 pl-6 pb-8 pt-4 bg-gray-200 m-3 rounded-lg justify-center items-center`}
  >
    <View>
      <Icon
        style={tw`ml-5`}
        name="local-gas-station"
        size={40}
      />
      <Text style={tw`mt-3 ml-2 pt-1 text-lg font-bold`}>Services</Text>
    </View>
  </TouchableOpacity>
  {/* second button */}
  <TouchableOpacity
    style={tw`p-10 pl-6 pb-8 pt-4 bg-gray-200 m-3 rounded-lg justify-center items-center`}
  >
    <View>
      <Icon
        name="car-repair"
        style={tw`ml-5`}
        size={40}
      />
      <Text style={tw`mt-3 ml-3 pt-1 text-lg font-bold`}>Activité</Text>
    </View>
  </TouchableOpacity>
</View>  
 );
};

export default NavOptions;
