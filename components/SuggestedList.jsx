import React from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import tw from 'twrnc';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const services = [
  { id: '1', name: 'Pare brise', icon: 'car-windshield' },
  { id: '2', name: 'Pneu', icon: 'car-tire-alert' },
  { id: '3', name: 'Carrosserie', icon: 'car-cog' },
  { id: '4',name: 'Carrosserie', icon: 'car-cog' }, 
  { id: '5', name: 'Carrosserie', icon: 'car-cog' },
];

const SuggestedList = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={tw`w-24 items-center p-2 bg-white border border-gray-200 rounded-lg m-1`}
    >
      <MaterialCommunityIcons name={item.icon} size={38} color="#103783" />
      <Text style={tw`mt-2 text-xs text-gray-700 font-semibold`}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      horizontal
      data={services}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false} // Hide horizontal bar
      contentContainerStyle={tw`p-2`}
    />
  );
};

export default SuggestedList;
