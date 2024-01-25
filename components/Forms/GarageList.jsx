import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { garage1 } from "../../assets";

function GarageList() {
  const services = [
    {
      id: "1",
      name: "Changement d'huile",
      image: garage1,
      price: "A partir de 60 €",
    },
    {
      id: "2",
      name: "Révision générales",
      image: garage1,
      price: "A partir de 50 €",
    },
    {
      id: "3",
      name: "Contrôle technique",
      image: garage1,
      price: "A partir de 40 €",
    },
  ];

  const renderItem = ({ item }) => (
    <View
      style={tw`w-full p-2 bg-white border border-gray-200 rounded-2xl m-1 shadow-md`}
    >
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-1 justify-between`}>
          <Text style={tw`text-gray-700 font-black text-xl mt-5`}>
            {item.name}
          </Text>
          <Text style={tw`text-gray-700 font-light text-xs mt-1`}>
            {item.price}
          </Text>
          <TouchableOpacity
            style={tw`bg-[#34469C] px-4 py-1 rounded-full self-end flex-row mt-7 items-center`}
          >
            <Text style={tw`text-white text-sm`}>Réserver</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Image source={item.image} style={tw`w-20 h-20 mt-5`} />
      </View>
    </View>
  );
  return (
    <FlatList
      data={services}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`p-2`}
    />
  );
}

export default GarageList;
