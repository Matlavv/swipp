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
import { AuthContext } from "../AuthContext"; // Importer le contexte d'authentification
import { gas, maintenance, reparation, services, swippLogo } from "../assets"; // Importer les images
import SuggestedRepair from "../components/Services/SuggestedRepairs"; // Importer la liste des réparations suggérées

const ServiceScreen = () => {
  const navigation = useNavigation(); // Accéder à la navigation
  const { isAuthenticated } = useContext(AuthContext); // Accéder à l'état d'authentification via le contexte

  // Fonction pour naviguer vers un écran, avec vérification de l'authentification
  const handleNavigation = (screenName) => {
    if (!isAuthenticated) {
      Alert.alert(
        "Accès Restreint",
        "Vous devez être connecté pour accéder à cette fonctionnalité.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Se connecter",
            onPress: () => navigation.navigate("LoginScreen"), // Rediriger vers l'écran de connexion
          },
        ]
      );
      return;
    }
    navigation.navigate(screenName); // Naviguer vers l'écran si l'utilisateur est authentifié
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1 mb-10`}>
        {/* Logo */}
        <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} /> {/* Logo de l'application */}
        </View>
        <Text style={tw`text-2xl font-bold m-5`}>Nos Services</Text>

        {/* Première ligne de services */}
        <View style={tw`flex-row justify-around items-center`}>
          {/* Bouton pour la livraison de carburant */}
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

          {/* Bouton pour la réparation du véhicule */}
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

        {/* Deuxième ligne de services */}
        <View style={tw`flex-row justify-around items-center mt-6`}>
          {/* Bouton pour l'entretien du véhicule */}
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

          {/* Bouton pour le contrôle technique */}
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

        {/* Section de suggestions */}
        <View style={tw`flex flex-row justify-between items-center p-2 mt-5`}>
          <Text style={tw`text-2xl font-semibold`}>Suggestions</Text>
        </View>
        <SuggestedRepair /> {/* Liste des réparations suggérées */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceScreen;
