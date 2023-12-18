import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';

const services = [
  { name: 'Pare brise', icon: 'format-paint' }, 
  { name: 'Pneu', icon: 'tire' }, 
  { name: 'Carrosserie', icon: 'van-utility' }, 
];

const services2 = [
    { name: 'Garages', icon: 'garage' }, 
    { name: 'Nettoyage', icon: 'gas-station' }, 
    { name: 'Autres', icon: 'van-utility' }, 
  ];

const ServicesButtonList = () => {
  return (
    <SafeAreaView>
        <View style={tw`flex-row justify-around items-center`}>
        {services.map((service, index) => (
            <TouchableOpacity
            key={index}
            style={tw`w-1/4 items-center p-4 bg-white border-2 border-gray-200 rounded-lg m-1`}
            >
            <MaterialCommunityIcons name={service.icon} size={38} color="#103783" />
            <Text style={tw`mt-2 text-xs text-gray-700 font-semibold`}>{service.name}</Text>
            </TouchableOpacity>
        ))}
        </View>
        {/* 2nd buttons row */}
        <View style={tw`flex-row justify-around items-center`}>
        {services2.map((services2, index) => (
            <TouchableOpacity
            key={index}
            style={tw`w-1/4 items-center p-4 bg-white border-2 border-gray-200 rounded-lg m-1`}
            >
            <MaterialCommunityIcons name={services2.icon} size={38} color="#103783" />
            <Text style={tw`mt-2 text-xs text-gray-700 font-semibold`}>{services2.name}</Text>
            </TouchableOpacity>
        ))}
        </View>
    </SafeAreaView>
  );
};

export default ServicesButtonList;
