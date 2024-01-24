import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { gas, services } from "../assets/index";

const NavOptions = () => {
  return (
    <SafeAreaView>
      <View style={tw`flex-row justify-around items-center`}>
        {/* Our Services Button */}
        <LinearGradient
          colors={["#FFFFFF", "#FFFFFF"]}
          style={tw`w-45 h-45 justify-center items-center rounded-2xl elevation-5 shadow-lg`}
        >
          <TouchableOpacity style={tw`justify-center items-center`}>
            <Image
              source={services}
              resizeMode="contain"
              style={tw`w-20 h-20`}
            />
            <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
              Nos Services
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Refuel Now Button */}
        <LinearGradient
          colors={["#FFFFFF", "#FFFFFF"]}
          style={tw`w-45 h-45 justify-center items-center rounded-2xl elevation-5 shadow-lg`}
        >
          <TouchableOpacity style={tw`justify-center items-center`}>
            <Image source={gas} resizeMode="contain" style={tw`w-20 h-20`} />
            <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
              Livraison carburant
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default NavOptions;
