import React from 'react';
import { View, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import tw from 'twrnc';
import { entretien } from '../assets';


const data = [
  {
    id: "1",
    title: "Pare-brise",
    image: entretien,
    screen: "energyScreen",
  },
  {
    id: "2",
    title: "Pneus",
    image: entretien,
    screen: "maintenanceScreen",
  },
  {
    id: "3",
    title: "Rétroviseurs",
    image: entretien,
    screen: "maintenanceScreen",
  },
  {
    id: "4",
    title: "Révision",
    image: entretien,
    screen: "maintenanceScreen",
  },
  {
    id: "5",
    title: "C.technique",
    image: entretien,
    screen: "maintenanceScreen",
  },
];

const SuggestedList = () => {
  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={tw`p-2 m-2 items-center bg-gray-200 rounded-xl`}
        onPress={() => console.log(`Navigate to ${item.screen}`)} 
      >
        <Image
          source={item.image}
          style={tw`w-15 h-15`}
        /> 
      </TouchableOpacity>
      <Text style={tw`m-1 mb-2 text-sm font-semibold text-center`}>{item.title}</Text>
    </View>
  );

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

export default SuggestedList;
