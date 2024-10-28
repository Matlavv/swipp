import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useState, useContext } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { gas, services, swippLogo } from "../assets/index"; // Import des assets (icônes et logo)
import RefuelIncomingReservation from "../components/History/RefuelIncomingReservation"; // Composants pour les réservations de carburant à venir
import RefuelPastReservation from "../components/History/RefuelPastReservation"; // Composants pour les réservations de carburant passées
import RepairIncomingReservation from "../components/History/RepairIncomingReservation"; // Composants pour les réparations à venir
import RepairPastReservation from "../components/History/RepairPastReservation"; // Composants pour les réparations passées
import { AuthContext } from "../AuthContext"; // Contexte d'authentification
import NotAuth from "../components/History/NotAuth"; // Composant affiché si l'utilisateur n'est pas authentifié
const Tab = createMaterialTopTabNavigator(); // Création du composant de navigation par onglets

const HistoryScreen = () => {
  const [selected, setSelected] = useState("services"); // État pour suivre la catégorie sélectionnée (réparations ou carburant)
  const { isAuthenticated } = useContext(AuthContext); // Accès au contexte d'authentification pour vérifier si l'utilisateur est connecté

  // Fonction pour retourner le bon composant en fonction de l'onglet et de la catégorie sélectionnée
  const getComponent = (tabName) => {
    if (isAuthenticated ){ // Si l'utilisateur est authentifié
      if (selected === "gas" && tabName === "A venir") {
        return RefuelIncomingReservation; // Composant pour les réservations de carburant à venir
      } else if (selected === "gas" && tabName === "Passées") {
        return RefuelPastReservation; // Composant pour les réservations de carburant passées
      } else if (selected === "services" && tabName === "A venir") {
        return RepairIncomingReservation; // Composant pour les réparations à venir
      } else if (selected === "services" && tabName === "Passées") {
        return RepairPastReservation; // Composant pour les réparations passées
      } else {
        return null; // Aucun composant si aucune condition n'est remplie
      }
    } else {
      return NotAuth; // Si l'utilisateur n'est pas authentifié, afficher un composant qui le redirige ou l'informe
    }
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      {/* Affichage du logo en haut de l'écran */}
      <View style={tw`flex p-5 mt-5 justify-start items-start flex-row`}>
        <Image style={tw`w-25 h-15`} source={swippLogo} />
      </View>

      {/* Titre de la page */}
      <Text style={tw`text-2xl font-bold m-2 ml-5`}>
        Historique de vos réservations
      </Text>

      {/* Sélection de catégorie (réparations ou carburant) */}
      <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 my-3`}>
        <Text style={tw`text-xl font-bold mb-5`}>
          Selectionnez une catégorie
        </Text>
        <View style={tw`flex-row justify-around items-center`}>
          {/* Bouton pour les services de réparation */}
          <TouchableOpacity
            onPress={() => setSelected("services")} // Met à jour la sélection de la catégorie
            style={[
              tw`w-42 h-40 justify-center items-center rounded-xl bg-white shadow-xl`,
              {
                borderColor: selected === "services" ? "#34469C" : "#FFFFFF", // Borde la sélection active en bleu
                borderWidth: selected === "services" ? 4 : 0, // Augmente l'épaisseur de la bordure si sélectionnée
              },
            ]}
          >
            {/* Icône pour les réparations */}
            <Image
              source={services}
              resizeMode="contain"
              style={tw`w-20 h-20`}
            />
            <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
              Réparations
            </Text>
          </TouchableOpacity>

          {/* Bouton pour les services de carburant */}
          <TouchableOpacity
            onPress={() => setSelected("gas")} // Met à jour la sélection de la catégorie
            style={[
              tw`w-42 h-40 justify-center items-center rounded-xl bg-white shadow-xl`,
              {
                borderColor: selected === "gas" ? "#34469C" : "#FFFFFF", // Borde la sélection active en bleu
                borderWidth: selected === "gas" ? 4 : 0, // Augmente l'épaisseur de la bordure si sélectionnée
              },
            ]}
          >
            {/* Icône pour le carburant */}
            <Image source={gas} resizeMode="contain" style={tw`w-20 h-20`} />
            <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
              Carburant
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Onglets de navigation pour afficher les réservations passées ou à venir */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#34469C", // Couleur du texte des onglets actifs
          tabBarInactiveTintColor: "grey", // Couleur du texte des onglets inactifs
          tabBarStyle: { backgroundColor: "#F5F5F5" }, // Couleur de fond de la barre d'onglets
          tabBarIndicatorStyle: { backgroundColor: "#34469C", height: 4 }, // Indicateur sous l'onglet actif
          tabBarLabelStyle: { fontSize: 18, fontWeight: "bold" }, // Style du texte des onglets
        }}
        style={tw`w-full`}
      >
        {/* Onglet pour les réservations passées */}
        <Tab.Screen name="Passées" component={getComponent("Passées")} />

        {/* Onglet pour les réservations à venir */}
        <Tab.Screen name="A venir" component={getComponent("A venir")} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default HistoryScreen;
