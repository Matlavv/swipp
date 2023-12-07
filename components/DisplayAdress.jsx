import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';

const DisplayAdress = () => {
    return (
      <View>
        {/* First adress */}
        <TouchableOpacity style={tw`flex-row justify-between items-center bg-white p-4 rounded-lg mx-4 mt-4`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-2xl font-bold text-black`}>Home</Text>
          <Text style={tw`text-sm text-gray-500`}>1234 Main St</Text>
        </View>
        <View style={tw`w-12 h-12 rounded-full bg-gray-200 items-center justify-center`}>
          <Icon name="home" size={24} color="black" />
        </View>
        </TouchableOpacity>
        <View style={tw`bg-gray-200 h-0.2 w-11/12 ml-5`} />
        {/* Second Adress */}
        <TouchableOpacity style={tw`flex-row justify-between items-center bg-white p-4 rounded-lg mx-4`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-2xl font-bold text-black`}>Work</Text>
            <Text style={tw`text-sm text-gray-500`}>5678 Main St</Text>
          </View>
          <View style={tw`w-12 h-12 rounded-full bg-gray-200 items-center justify-center`}>
            <Icon name="work" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    );
   };
   
export default DisplayAdress;