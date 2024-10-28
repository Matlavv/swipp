// Importation des dépendances nécessaires
import { Ionicons } from "@expo/vector-icons"; // Icônes Ionicons
import { useNavigation } from "@react-navigation/native"; // Hook de navigation
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Fonctions Firestore pour récupérer et mettre à jour des documents
import React, { useEffect, useState } from "react"; // Hooks React pour la gestion des états et des effets
import {
  Alert, // Affichage des alertes
  Image, // Composant pour afficher des images
  Linking, // Composant pour ouvrir des liens
  SafeAreaView, // Composant pour gérer les zones sûres sur les appareils
  Text, // Composant texte
  TouchableOpacity, // Composant pour les boutons cliquables
  View, // Conteneur de vues
} from "react-native"; // Composants React Native
import tw from "twrnc"; // Utilisation de Tailwind CSS pour le style
import { swippLogo } from "../../../assets"; // Logo de l'application
import { db } from "../../../firebaseConfig"; // Configuration Firestore

// Composant AdminRefuelReservationDetailled pour afficher et gérer les détails d'une réservation de ravitaillement
const AdminRefuelReservationDetailled = ({ route }) => {
  // Récupération de l'ID de la réservation passée en paramètre via la navigation
  const { reservationId } = route.params;
  // Déclaration des états locaux pour gérer les informations de la réservation et de l'utilisateur
  const [reservation, setReservation] = useState(null);
  const [user, setUser] = useState(null);
  const navigation = useNavigation(); // Hook pour la navigation

  // Chargement des données de la réservation à partir de Firestore à l'ouverture de l'écran
  useEffect(() => {
    const fetchReservation = async () => {
      const docRef = doc(db, "RefuelBookings", reservationId); // Récupération de la réservation à partir de son ID
      const docSnap = await getDoc(docRef); // Récupération du document

      if (docSnap.exists()) {
        const reservationData = docSnap.data(); // Récupération des données de la réservation
        setReservation({ id: docSnap.id, ...reservationData }); // Mise à jour de l'état avec les données de la réservation
        const userSnap = await getDoc(doc(db, "users", reservationData.userId)); // Récupération des informations de l'utilisateur lié à la réservation
        if (userSnap.exists()) {
          setUser(userSnap.data()); // Mise à jour de l'état avec les données de l'utilisateur
        }
      } else {
        Alert.alert("Erreur", "Réservation non trouvée."); // Affichage d'une alerte si la réservation n'existe pas
      }
    };

    fetchReservation(); // Appel de la fonction pour charger les données de la réservation
  }, [reservationId]); // Exécution de l'effet à chaque changement de l'ID de la réservation

  // Fonction pour marquer la réservation comme effectuée
  const handleMarkAsCompleted = async () => {
    const reservationRef = doc(db, "RefuelBookings", reservationId); // Récupération de la référence de la réservation
    await updateDoc(reservationRef, {
      isActive: false, // Mise à jour de l'état de la réservation comme inactive (effectuée)
    });
    Alert.alert("Succès", "La réservation a été marquée comme effectuée."); // Affichage d'une alerte de succès
    navigation.goBack(); // Retour à l'écran précédent
  };

  // Fonction pour annuler la réservation
  const handleCancelReservation = async () => {
    Alert.alert(
      "Confirmation", // Titre de l'alerte
      "Êtes-vous sûr de vouloir annuler cette réservation ?", // Message de confirmation
      [
        {
          text: "Annuler", // Option pour annuler
          style: "cancel",
        },
        {
          text: "Oui", // Option pour confirmer l'annulation
          onPress: async () => {
            const reservationRef = doc(db, "RefuelBookings", reservationId); // Récupération de la référence de la réservation
            await updateDoc(reservationRef, {
              cancelled: true, // Mise à jour de l'état de la réservation comme annulée
            });
            Alert.alert("Succès", "La réservation a été annulée."); // Affichage d'une alerte de succès
            navigation.goBack(); // Retour à l'écran précédent
          },
        },
      ]
    );
  };

  // Fonction pour ouvrir l'adresse dans Google Maps
  const openInMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`; // Construction de l'URL pour Google Maps
    Linking.openURL(url).catch((err) =>
      Alert.alert("Erreur", "Impossible d'ouvrir Google Maps.") // Gestion des erreurs lors de l'ouverture de l'URL
    );
  };

  // Fonction pour extraire le type de carburant à partir de l'ID du véhicule
  const getFuelTypeFromVehicleId = (vehicleId) => {
    const parts = vehicleId.split(" - ");
    return parts[parts.length - 1]; // Retourne la dernière partie de l'ID (type de carburant)
  };

  // Fonction pour extraire les informations du véhicule à partir de l'ID du véhicule
  const getVehiculeInformation = (vehicleId) => {
    const parts = vehicleId.split(" - ");
    return parts[parts.length - 2]; // Retourne l'avant-dernière partie de l'ID (informations sur le véhicule)
  };

  // Rendu du composant
  return (
    <SafeAreaView style={tw`flex h-full`}>
      <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
        <Image style={tw`w-25 h-15`} source={swippLogo} /> {/* Logo de l'application */}
      </View>
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Retour à l'écran précédent
          style={tw`mt-5 ml-3`}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold m-5`}>
          Réservation de {user?.firstName}
          {user?.lastName} {/* Affichage du nom de l'utilisateur */}
        </Text>
      </View>
      {/* Affichage des informations de la réservation */}
      {reservation && (
        <View style={tw`p-4`}>
          <Text style={tw`text-lg font-semibold`}>
            Réservation du {reservation.bookingDate} de{" "}
            {reservation.bookingHour}
          </Text>
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Véhicule :</Text>
            <Text style={tw`text-lg font-semibold`}>
              {" "}
              {getVehiculeInformation(reservation.vehicleId)} {/* Informations sur le véhicule */}
            </Text>
          </View>
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Carburant choisi :</Text>
            <Text style={tw`text-lg font-semibold`}>
              {" "}
              {getFuelTypeFromVehicleId(reservation.vehicleId)} {/* Type de carburant */}
            </Text>
          </View>
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Volume :</Text>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-lg font-semibold`}>
                {reservation.volume} Litres {/* Volume de carburant */}
              </Text>
            </View>
          </View>
          {/* Bouton pour ouvrir l'adresse dans Google Maps */}
          <TouchableOpacity
            onPress={() => openInMaps(reservation.address)}
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Adresse :</Text>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-lg font-semibold text-[#34469C]`}>
                {reservation.address} {/* Adresse de la réservation */}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={tw`mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Réservation faite le </Text>
            <Text style={tw`text-lg font-semibold`}>
              {reservation.createdAt.toDate().toLocaleString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })} {/* Date de création de la réservation */}
            </Text>
          </View>
          {/* Bouton pour marquer la réservation comme effectuée */}
          <TouchableOpacity
            style={tw`bg-green-500 mt-8 p-2 rounded-lg shadow-xl`}
            onPress={handleMarkAsCompleted}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              Marquer comme effectuée
            </Text>
          </TouchableOpacity>
          {/* Bouton pour annuler la réservation */}
          <TouchableOpacity
            style={tw`bg-red-500 mt-2 p-2 rounded-lg shadow-xl`}
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

// Export du composant
export default AdminRefuelReservationDetailled;
