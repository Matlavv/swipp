import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import GarageList from "./GarageList";

const ChooseGarageModal = ({ isVisible, onClose, onSelectGarage }) => {
  const [address, setAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {};

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={tw`flex-1 justify-center items-center`}>
        <BlurView intensity={50} style={tw`absolute w-full h-full`}>
          <View style={tw`bg-white rounded-xl pt-2 shadow-lg w-full mt-8`}>
            <TouchableOpacity
              onPress={onClose}
              style={tw`absolute top-1 left-2`}
            >
              <Ionicons name="close-circle" size={34} color="gray" />
            </TouchableOpacity>
            <View style={tw`absolute flex-row`}>
              <TextInput
                style={tw`border-b-2 border-[#34469C] font-bold text-sm w-2/3 my-5 ml-12`}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Entrez votre ville ou département"
              />
              <TouchableOpacity
                onPress={handleSearch}
                style={tw`m-2 bg-blue-500 p-2 rounded-md`}
              >
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={tw`flex mt-15`}>
              <GarageList
                searchTerm={searchTerm}
                onSelectGarage={(garage) => {
                  onSelectGarage(garage);
                  onClose();
                }}
              />
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

export default ChooseGarageModal;
