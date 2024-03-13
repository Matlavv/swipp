import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { breakdown, crash, swippLogo } from "../assets";

const EmergencyScreen = ({ onPress }) => {
  const navigation = useNavigation();

  const navigateToCrashInfo = () => {
    navigation.navigate("CrashInfo");
  };

  const navigateToBreakdownInfo = () => {
    navigation.navigate("BreakdownInfo");
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      {/* Logo */}
      <View style={tw`p-5 mt-5 justify-start items-start flex-row`}>
        <Image style={tw`w-25 h-15`} source={swippLogo} />
      </View>
      <Text style={tw`text-2xl font-bold m-5`}>Services d'urgences</Text>
      <View style={tw`items-center`}>
        {/* First button */}
        <TouchableOpacity
          style={tw`w-96 h-55 bg-[#34469C] border border-gray-200 rounded-2xl shadow-md flex-row justify-between items-center px-5`}
          onPress={navigateToBreakdownInfo}
        >
          <Text style={tw`text-white font-bold text-3xl`}>
            {"Prévenir\nune panne"}
          </Text>
          <Image
            source={breakdown}
            resizeMode="contain"
            style={tw`w-55 h-50`}
          />
        </TouchableOpacity>
        {/* Second button */}
        <TouchableOpacity
          style={tw`w-96 h-55 bg-[#34469C] border border-gray-200 rounded-2xl shadow-md relative flex-row items-center px-5 mt-5`}
          onPress={navigateToCrashInfo}
        >
          <Text style={tw`text-white font-bold text-3xl z-10`}>
            {"Indiquer\nun accident"}
          </Text>
          <Image
            source={crash}
            resizeMode="contain"
            style={tw`absolute right-0 top-8 w-3/4 h-full z-0`}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EmergencyScreen;
