import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Importation des fonctions pour interagir avec Firestore
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc"; // Utilisation de Tailwind CSS pour styliser les composants React Native
import { swippLogo } from "../../assets"; // Importation du logo de l'application
import { db } from "../../firebaseConfig"; // Importation de la configuration Firebase

const DetailledRefuelReservation = ({ route }) => {
  const { reservationId } = route.params; // Récupération de l'ID de la réservation depuis les paramètres de la route
  const [reservation, setReservation] = useState(null); // État local pour stocker les informations de la réservation
  const navigation = useNavigation(); // Hook pour la navigation

  // Chargement des données de la réservation depuis Firestore
  useEffect(() => {
    const fetchReservation = async () => {
      const docRef = doc(db, "RefuelBookings", reservationId); // Référence au document de la réservation
      const docSnap = await getDoc(docRef); // Récupération des données de la réservation

      if (docSnap.exists()) {
        setReservation({ id: docSnap.id, ...docSnap.data() }); // Mise à jour de l'état avec les données de la réservation
      } else {
        Alert.alert("Erreur", "Réservation non trouvée."); // Alerte si la réservation n'est pas trouvée
      }
    };

    fetchReservation();
  }, [reservationId]); // Exécution lorsque reservationId change

  // Fonction pour annuler la réservation
  const handleCancelReservation = async () => {
    const now = new Date(); // L'heure actuelle
    const createdAt = reservation.createdAt.toDate(); // Convertit le Timestamp Firestore en objet Date JavaScript
    const timeDiff = now - createdAt; // Différence entre l'heure actuelle et l'heure de création
    const minutesDiff = timeDiff / (1000 * 60); // Convertit la différence en minutes

    // Vérifie si la réservation peut être annulée
    if (reservation.isActive && minutesDiff <= 60) {
      const reservationRef = doc(db, "RefuelBookings", reservationId); // Référence à la réservation

      await updateDoc(reservationRef, {
        cancelled: true, // Mise à jour du statut d'annulation
      });

      Alert.alert(
        "Réservation annulée",
        "Votre réservation a été annulée avec succès."
      );
      navigation.goBack(); // Retour à l'écran précédent
    } else if (!reservation.isActive) {
      // Si la réservation a déjà été honorée
      Alert.alert(
        "Annulation impossible",
        "Cette réservation a déjà été honorée et ne peut plus être annulée."
      );
    } else {
      // Si la réservation a été faite il y a plus de 60 minutes
      Alert.alert(
        "Annulation impossible",
        "Le délai d'annulation d'une heure est dépassé. Veuillez contacter le garage pour toute demande d'annulation."
      );
    }
  };

  // Fonction utilitaire pour extraire le type de carburant depuis l'ID du véhicule
  const getFuelTypeFromVehicleId = (vehicleId) => {
    const parts = vehicleId.split(" - "); // Sépare l'ID en utilisant un tiret
    return parts[parts.length - 1]; // Retourne la dernière partie (le type de carburant)
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      {/* Affichage du logo en haut de la page */}
      <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
        <Image style={tw`w-25 h-15`} source={swippLogo} />
      </View>
      <View style={tw`flex-row`}>
        {/* Bouton de retour pour naviguer vers l'écran précédent */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`mt-5 ml-3`}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold m-5`}>Votre réservation</Text>
      </View>

      {/* Si la réservation est chargée, afficher les détails */}
      {reservation && (
        <View style={tw`p-4`}>
          <Text style={tw`text-lg font-semibold`}>
            A propos de votre réservation du {reservation.bookingDate} de{" "}
            {reservation.bookingHour}
          </Text>
          {/* Détails du véhicule */}
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Véhicule :</Text>
            <Text style={tw`text-lg font-semibold`}>
              {" "}
              {reservation.vehicleId}
            </Text>
          </View>
          {/* Détails du carburant */}
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Carburant choisi :</Text>
            <Text style={tw`text-lg font-semibold`}>
              {" "}
              {getFuelTypeFromVehicleId(reservation.vehicleId)}
            </Text>
          </View>
          {/* Détails du volume de carburant */}
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Volume :</Text>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-lg font-semibold`}>
                {reservation.volume} Litres
              </Text>
            </View>
          </View>
          {/* Adresse de livraison */}
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>A l'adresse :</Text>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-lg font-semibold`}>
                {reservation.address}
              </Text>
            </View>
          </View>
          {/* Détails sur la création de la réservation */}
          <View
            style={tw`mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>
              Vous avez fait cette réservation le{" "}
            </Text>
            <Text style={tw`text-lg font-semibold`}>
              {reservation.createdAt.toDate().toLocaleString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          {/* Bouton pour annuler la réservation */}
          <TouchableOpacity
            style={tw`bg-red-500 mt-8 p-2 rounded-lg shadow-xl`}
            onPress={handleCancelReservation}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              Annuler la réservation
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default DetailledRefuelReservation;
