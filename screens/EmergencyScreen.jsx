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
  // Hook pour accéder à la navigation
  const navigation = useNavigation();

  // Fonction pour naviguer vers l'écran des informations sur un accident
  const navigateToCrashInfo = () => {
    navigation.navigate("CrashInfo");
  };

  // Fonction pour naviguer vers l'écran des informations sur une panne
  const navigateToBreakdownInfo = () => {
    navigation.navigate("BreakdownInfo");
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      {/* Section du logo */}
      <View style={tw`p-5 mt-5 justify-start items-start flex-row`}>
        <Image style={tw`w-25 h-15`} source={swippLogo} />
      </View>

      {/* Titre principal de la page */}
      <Text style={tw`text-2xl font-bold m-5`}>Services d'urgences</Text>

      {/* Conteneur des boutons */}
      <View style={tw`items-center`}>
        {/* Premier bouton pour signaler une panne */}
        <TouchableOpacity
          style={tw`w-96 h-55 bg-[#34469C] border border-gray-200 rounded-2xl shadow-md flex-row justify-between items-center px-5`}
          onPress={navigateToBreakdownInfo}
        >
          {/* Texte du bouton pour signaler une panne */}
          <Text style={tw`text-white font-bold text-3xl`}>
            {"Prévenir\nune panne"}
          </Text>
          {/* Image d'une panne */}
          <Image
            source={breakdown}
            resizeMode="contain"
            style={tw`w-55 h-50`}
          />
        </TouchableOpacity>

        {/* Deuxième bouton pour signaler un accident */}
        <TouchableOpacity
          style={tw`w-96 h-55 bg-[#34469C] border border-gray-200 rounded-2xl shadow-md relative flex-row items-center px-5 mt-5`}
          onPress={navigateToCrashInfo}
        >
          {/* Texte du bouton pour signaler un accident */}
          <Text style={tw`text-white font-bold text-3xl z-10`}>
            {"Indiquer\nun accident"}
          </Text>
          {/* Image d'un accident, positionnée en arrière-plan avec un style absolu */}
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
