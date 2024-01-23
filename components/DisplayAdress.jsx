import { Icon } from "@rneui/themed";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const DisplayAdress = () => {
  const adressesTemporaires = [
    {
      id: "1",
      label: "Maison",
      adresse: "123 Rue de la Paix",
      ville: "Paris",
    },
    {
      id: "2",
      label: "Bureau",
      adresse: "456 Avenue de Montmartre",
      ville: "Paris",
    },
  ];

  const [adresses] = React.useState(adressesTemporaires);

  return (
    <ScrollView style={tw`flex-1 mb-10`}>
      {adresses.map((adresse, index) => (
        <TouchableOpacity
          key={adresse.id}
          style={tw`flex-row items-center bg-white px-4 py-2 rounded-lg mx-2 my-2`}
        >
          <View
            style={tw`w-12 h-12 rounded-full bg-[#E6E6E6] items-center justify-center mr-4`}
          >
            <Icon name="location-pin" size={24} color="#34469C" />
          </View>
          <View style={tw`flex-1 ml-2`}>
            <Text style={tw`text-xl font-bold text-black`}>
              {adresse.label}
            </Text>
            <Text style={tw`mt-1 text-sm text-gray-500`}>
              {adresse.adresse}, {adresse.ville}
            </Text>
          </View>
          <Icon name="chevron-right" size={35} color="#34469C" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default DisplayAdress;
