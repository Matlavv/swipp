import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { garage1 } from "../../assets";
import DateTimePickerModal from "./DateTimePickerModal";

const GarageList = () => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState(null);

  const handleBookPress = (garage) => {
    setSelectedGarage(garage);
    setPickerVisible(true);
  };

  const handleClose = () => {
    setPickerVisible(false);
  };

  const handleConfirm = (dateTime) => {
    console.log("Réservation pour", selectedGarage, "à", dateTime);
    // Ici, vous pouvez gérer la confirmation, comme la mise à jour d'un état ou l'envoi à un serveur
    setPickerVisible(false);
  };

  const garages = [
    {
      name: "ChrisFix Garage",
      description: "Peinture & carrosserie",
      workerCount: "50",
      image: garage1,
    },
    {
      name: "Garage 2",
      description: "Pneu et jantes",
      workerCount: "20",
      image: garage1,
    },
    {
      name: "Garage 3",
      description: "Peinture",
      workerCount: "20",
      image: garage1,
    },
  ];

  return (
    <>
      <ScrollView>
        {garages.map((garage, index) => (
          <View key={index} style={tw`flex w-95 ml-4`}>
            <View
              style={tw`flex mb-4 bg-white rounded-xl border border-gray-200 shadow-xl`}
            >
              <Image
                source={garage.image}
                style={tw`h-32 w-full rounded-t-xl`}
              />
              <View style={tw`px-4 py-2 bg-white rounded-b-xl`}>
                <Text style={tw`text-lg font-bold`}>{garage.name}</Text>
                <View style={tw`flex-row justify-between pt-2`}>
                  <Text
                    style={tw`text-sm text-black border-2 rounded-full px-3 py-1 border-slate-400`}
                  >
                    {garage.description}
                  </Text>
                  <Text
                    style={tw`text-sm text-black border-2 rounded-full px-3 py-1 border-slate-400`}
                  >
                    {garage.workerCount} Workers
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleBookPress(garage)}
                    style={tw`bg-[#34469C] px-4 py-1 rounded-full flex-row`}
                  >
                    <Text style={tw`text-white text-sm mr-1`}>Book</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default GarageList;
