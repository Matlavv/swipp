import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Geocoder from "react-native-geocoding";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";

Geocoder.init("AIzaSyC7G4Z0E2levTb0mVYJOX_1bNgSVMvlK-Y");

const RefuelForm = () => {
  const [selectedValue, setSelectedValue] = useState("SP98");

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 my-3`}>
          <Text style={tw`text-xl font-bold mb-5`}>
            Selectionnez votre carburant
          </Text>
          <View style={tw`flex-row bg-white p-2 rounded-md`}>
            <Icon name="gas-pump" size={24} color="#000" style={tw`mr-2`} />
            <View style={tw`flex-1`}>
              <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                style={tw`flex-1`}
                dropdownIconColor="transparent"
              >
                {/* Picker.Items */}
              </Picker>
            </View>
            <Icon name="chevron-down" size={24} color="#000" />
            {/* Custom arrow icon */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RefuelForm;
