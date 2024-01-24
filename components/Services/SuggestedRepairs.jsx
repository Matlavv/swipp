import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { maintenance, oil_change, reparation } from "../../assets";

const services = [
  {
    id: "1",
    name: "Changement d'huile",
    image: oil_change,
    price: "A partir de 60 €",
  },
  {
    id: "2",
    name: "Révision générales",
    image: maintenance,
    price: "A partir de 50 €",
  },
  {
    id: "3",
    name: "Contrôle technique",
    image: reparation,
    price: "A partir de 40 €",
  },
];

const SuggestedRepair = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={tw`w-70 h-45 p-2 bg-white border border-gray-200 rounded-2xl m-1 mr-4 shadow-md`}
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
            style={tw`bg-[#34469C] px-4 py-1 rounded-full self-start flex-row mt-7`}
          >
            <Text style={tw`text-white text-sm`}>Réserver</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Image
          source={item.image}
          resizeMode="contain"
          style={tw`w-30 h-full`}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      horizontal
      data={services}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`p-2 ml-2`}
    />
  );
};

export default SuggestedRepair;