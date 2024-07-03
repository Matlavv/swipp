import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { AuthContext } from "../AuthContext";
import { gas, maintenance, reparation, services, swippLogo } from "../assets";
import SuggestedRepair from "../components/Services/SuggestedRepairs";

const ServiceScreen = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useContext(AuthContext);

  const handleNavigation = (screenName) => {
    if (!isAuthenticated) {
      Alert.alert(
        "Accès Restreint",
        "Vous devez être connecté pour accéder à cette fonctionnalité.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Se connecter",
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ]
      );
      return;
    }
    navigation.navigate(screenName);
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
            <TouchableOpacity
              style={tw`justify-center items-center`}
              onPress={() => handleNavigation("RefuelForm")}
            >
              <Image source={gas} resizeMode="contain" style={tw`w-20 h-20`} />
              <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
                Livraison carburant
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* second button */}
          <LinearGradient
            colors={["#FFFFFF", "#FFFFFF"]}
            style={tw`w-45 h-45 justify-center items-center rounded-2xl elevation-5 shadow-lg`}
          >
            <TouchableOpacity
              style={tw`justify-center items-center`}
              onPress={() => handleNavigation("RepairForm")}
            >
              <Image
                source={reparation}
                resizeMode="contain"
                style={tw`w-20 h-20`}
              />
              <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
                Réparation véhicule
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
            <TouchableOpacity
              style={tw`justify-center items-center`}
              onPress={() => handleNavigation("MaintenanceForm")}
            >
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
            <TouchableOpacity
              style={tw`justify-center items-center`}
              onPress={() => handleNavigation("TechnicalControlForm")}
            >
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
