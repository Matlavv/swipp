import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Permet de gérer la navigation entre les écrans
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Fonctions pour interagir avec Firestore
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc"; // Bibliothèque Tailwind pour styliser les composants React Native
import { swippLogo } from "../../assets"; // Importation du logo de l'application
import { auth, db } from "../../firebaseConfig"; // Importation de la configuration Firebase

// Composant principal pour afficher les détails d'une réservation de réparation
const DetailledRepairReservation = ({ route }) => {
  const { reservationId } = route.params; // Récupération de l'ID de la réservation à partir des paramètres de la route
  const [vehicle, setVehicle] = useState(null); // État local pour stocker les informations du véhicule
  const [reservation, setReservation] = useState(null); // État local pour stocker les informations de la réservation
  const navigation = useNavigation(); // Hook pour la navigation

  // Fonction pour charger les données de la réservation et du véhicule associé
  useEffect(() => {
    const fetchReservation = async () => {
      const docRef = doc(db, "RepairBookings", reservationId); // Référence au document de la réservation dans Firestore
      const docSnap = await getDoc(docRef); // Récupère les données de la réservation

      if (docSnap.exists()) {
        const reservationData = { id: docSnap.id, ...docSnap.data() }; // Sauvegarde les données de la réservation
        setReservation(reservationData);

        // Charger les détails du véhicule associé à la réservation
        const vehicleRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "vehicles",
          reservationData.vehicleId
        );
        const vehicleSnap = await getDoc(vehicleRef);

        if (vehicleSnap.exists()) {
          setVehicle({ id: vehicleSnap.id, ...vehicleSnap.data() }); // Sauvegarde les informations du véhicule
        } else {
          Alert.alert("Erreur", "Véhicule non trouvé."); // Alerte si le véhicule n'est pas trouvé
        }
      } else {
        Alert.alert("Erreur", "Réservation non trouvée."); // Alerte si la réservation n'est pas trouvée
      }
    };

    fetchReservation();
  }, [reservationId]); // Dépendance sur `reservationId` pour réexécuter lorsque cette valeur change

  // Fonction pour annuler la réservation
  const handleCancelReservation = async () => {
    const now = new Date(); // L'heure actuelle
    const createdAt = new Date(reservation.createdAt); // Convertit la date de création de la réservation en objet Date
    const timeDiff = now - createdAt; // Calcul de la différence de temps entre la création et maintenant
    const minutesDiff = timeDiff / (1000 * 60); // Convertit la différence en minutes

    // Si la réservation est active et faite il y a moins de 60 minutes
    if (reservation.isActive && minutesDiff <= 60) {
      const reservationRef = doc(db, "RepairBookings", reservationId); // Référence à la réservation

      await updateDoc(reservationRef, {
        cancelled: true, // Met à jour le statut de la réservation comme annulée
      });

      Alert.alert(
        "Réservation annulée",
        "Votre réservation a été annulée avec succès."
      );
      navigation.goBack(); // Retour à l'écran précédent
    } else if (!reservation.isActive) {
      Alert.alert(
        "Annulation impossible",
        "Cette réservation a déjà été honorée et ne peut plus être annulée."
      );
    } else {
      Alert.alert(
        "Annulation impossible",
        "Le délai d'annulation d'une heure est dépassé. Veuillez contacter le garage pour toute demande d'annulation."
      );
    }
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      {/* Affichage du logo en haut de la page */}
      <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
        <Image style={tw`w-25 h-15`} source={swippLogo} />
      </View>

      {/* Bouton de retour */}
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`mt-5 ml-3`}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold m-5`}>Votre réservation</Text>
      </View>

      {/* Si la réservation est chargée, afficher ses détails */}
      {reservation && (
        <View style={tw`p-4`}>
          <Text style={tw`text-lg font-semibold`}>
            A propos de votre réservation du{" "}
            {new Date(
              `${reservation.bookingDate} ${reservation.bookingHour}`
            ).toLocaleString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>

          {/* Affichage des détails du véhicule */}
          {vehicle && (
            <View
              style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
            >
              <Text style={tw`text-lg`}>Véhicule :</Text>
              <Text style={tw`text-lg font-semibold`}>
                {" "}
                {vehicle.label} - {vehicle.immatriculation}
              </Text>
            </View>
          )}

          {/* Détails de la réparation */}
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Type de réparation :</Text>
            <Text style={tw`text-lg font-semibold`}>
              {" "}
              {reservation.reparationType}
            </Text>
          </View>

          {/* Détails supplémentaires */}
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Détails :</Text>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-lg font-semibold`}>
                {reservation.reparationDetail}
              </Text>
            </View>
          </View>

          {/* Lieu de l'entretien */}
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Lieu de l'entretien : </Text>
            <Text style={tw`text-lg font-semibold w-55`}>
              {reservation.adress}
            </Text>
          </View>

          {/* Garage responsable */}
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Garage : </Text>
            <Text style={tw`text-lg font-semibold w-55`}>
              {reservation.location}
            </Text>
          </View>

          {/* Numéro de téléphone */}
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Numéro de téléphone : </Text>
            <Text style={tw`text-lg font-semibold w-55`}>
              {reservation.phoneNumber}
            </Text>
          </View>

          {/* Détails sur la création de la réservation */}
          <View
            style={tw`mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>
              Vous avez fait cette réservation le{" "}
            </Text>
            <Text style={tw`text-lg font-semibold`}>
              {new Date(reservation.createdAt).toLocaleString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {/* Affichage du montant total */}
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Montant total :</Text>
            <Text style={tw`text-lg font-semibold`}> {reservation.price}</Text>
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

export default DetailledRepairReservation;
