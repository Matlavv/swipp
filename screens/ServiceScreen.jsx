import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { gas, maintenance, reparation, services, swippLogo } from "../assets";
import SuggestedRepair from "../components/Services/SuggestedRepairs";

const ServiceScreen = () => {
  const navigation = useNavigation();

  const navigateToRefuelForm = () => {
    navigation.navigate("RefuelForm");
  };
  const navigateToMaintenanceForm = () => {
    navigation.navigate("MaintenanceForm");
  };

  const navigateToEmergencyScreen = () => {
    navigation.navigate("EmergencyScreen");
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1 mb-10`}>
        {/* Logo */}
        <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} />
        </View>
        <Text style={tw`text-2xl font-bold m-5`}>Nos Services</Text>
        {/* Four buttons */}
        <View style={tw`flex-row justify-around items-center`}>
          {/* first button */}
          <LinearGradient
            colors={["#FFFFFF", "#FFFFFF"]}
            style={tw`w-45 h-45 justify-center items-center rounded-2xl elevation-5 shadow-lg`}
          >
            <TouchableOpacity style={tw`justify-center items-center`}>
              <Image
                source={reparation}
                resizeMode="contain"
                style={tw`w-20 h-20`}
              />
              <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
                Réparation véhicules
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* second button */}
          <LinearGradient
            colors={["#FFFFFF", "#FFFFFF"]}
            style={tw`w-45 h-45 justify-center items-center rounded-2xl elevation-5 shadow-lg`}
          >
            <TouchableOpacity style={tw`justify-center items-center`}>
              <Image source={gas} resizeMode="contain" style={tw`w-20 h-20`} />
              <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
                Livraison carbuant
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        {/* Second row */}
        <View style={tw`flex-row justify-around items-center mt-6`}>
          {/* first button */}
          <LinearGradient
            colors={["#FFFFFF", "#FFFFFF"]}
            style={tw`w-45 h-45 justify-center items-center rounded-2xl elevation-5 shadow-lg`}
          >
            <TouchableOpacity style={tw`justify-center items-center`}>
              <Image
                source={maintenance}
                resizeMode="contain"
                style={tw`w-20 h-20`}
              />
              <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
                Entretien
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* second button */}
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
                Contrôle technique
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        {/* Suggestions */}
        <View style={tw`flex flex-row justify-between items-center p-2 mt-5`}>
          <Text style={tw`text-2xl font-semibold`}>Suggestions</Text>
        </View>
        <SuggestedRepair />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceScreen;
