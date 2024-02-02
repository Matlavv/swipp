import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import GarageList from "./GarageList";

const ChooseGarageModal = ({ isVisible, onClose, onSelectGarage }) => {
  const [address, setAddress] = useState("");

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={tw`flex-1 justify-center items-center`}>
        <BlurView intensity={50} style={tw`absolute w-full h-full`}>
          <View style={tw`bg-white rounded-xl pt-2 shadow-lg w-full mt-8`}>
            <TouchableOpacity
              onPress={onClose}
              style={tw`absolute top-1 left-2`}
            >
              <Text style={tw`text-black text-2xl font-bold`}>✕</Text>
            </TouchableOpacity>
            <View style={tw`absolute`}>
              <TextInput
                style={tw`border-b-2 border-[#34469C] font-bold text-sm w-full my-5 ml-12`}
                value={address}
                onChangeText={setAddress}
                placeholder="Entrez votre adresse pour trouver un garage"
              />
            </View>
            <View style={tw`mt-15`}>
              <GarageList
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
