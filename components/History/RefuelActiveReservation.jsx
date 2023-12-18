import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';

const reservations = [
  {
      index: '1',
      address: '45 avenue Georges Politzer',
      date: '19/10/23'
  },
  {
      index: '2',
      address: '10 rue des Potiers',
      date: '08/12/23'
  },
  {
      index: '3',
      address: '10 rue des Potiers',
      date: '08/12/23'
  },
  {
      index: '4',
      address: '10 rue des Potiers',
      date: '08/12/23'
  },
]

const RefuelActiveReservation = () => {
  return (
    <View>
     {reservations.map((reservation, index) => (
       <TouchableOpacity key={index} style={tw`flex-row justify-between items-center bg-white p-4 rounded-lg mx-4 mt-4`}>
         <View style={tw`w-12 h-12 rounded-full bg-gray-200 items-center justify-center`}>
           <Icon name="local-gas-station" size={24} color="#103783" />
         </View>
         <View style={tw`flex-1 ml-10`}>
           <Text style={tw`text-xl font-bold text-black`}>{reservation.address}</Text>
           <Text style={tw`text-sm text-gray-500`}>{reservation.date}</Text>
         </View> 
       </TouchableOpacity>
     ))}
   </View>
  );
};

export default RefuelActiveReservation;