import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const GaragesDetailsModal = ({ isVisible, onClose, garage }) => {
  if (!garage) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={tw`flex-1 justify-center items-center`}>
        <BlurView intensity={50} style={tw`absolute w-full h-full`}>
          <View style={tw`bg-white rounded-lg p-4 m-2 max-w-lg w-full`}>
            <TouchableOpacity onPress={onClose} style={tw`absolute p-2`}>
              <Ionicons name="close-circle" size={34} color="gray" />
            </TouchableOpacity>

            <Image
              source={{ uri: garage.image }}
              style={tw`h-40 w-full rounded-lg mt-8`}
            />

            <Text style={tw`text-2xl font-bold mt-2`}>{garage.name}</Text>

            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-semibold`}>Adresse : </Text>
              <Text style={tw`text-lg`}>{garage.address}</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-semibold`}>Ville : </Text>
              <Text style={tw`text-lg`}>
                {garage.city}, {garage.department}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-semibold`}>A propos : </Text>
              <Text style={tw`text-lg`}>{garage.description}</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg font-semibold`}>
                Nombre de garagistes :{" "}
              </Text>
              <Text style={tw`text-lg`}>{garage.workerCount}</Text>
            </View>
            <View style={tw`mt-2`}>
              <Text style={tw`text-lg font-semibold`}>Services :</Text>
              {garage.services.map((service, index) => (
                <Text key={index} style={tw`text-lg`}>
                  • {service}
                </Text>
              ))}
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

export default GaragesDetailsModal;
