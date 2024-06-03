import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";

const DetailledRepairReservation = ({ route }) => {
  const { reservationId } = route.params;
  const [vehicle, setVehicle] = useState(null);
  const [reservation, setReservation] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReservation = async () => {
      const docRef = doc(db, "RepairBookings", reservationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const reservationData = { id: docSnap.id, ...docSnap.data() };
        setReservation(reservationData);

        // Charger les détails du véhicule
        const vehicleRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "vehicles",
          reservationData.vehicleId
        );
        const vehicleSnap = await getDoc(vehicleRef);

        // if (vehicleSnap.exists()) {
        //   setVehicle({ id: vehicleSnap.id, ...vehicleSnap.data() });
        // } else {
        //   Alert.alert("Erreur", "Véhicule non trouvé.");
        // }
      } else {
        Alert.alert("Erreur", "Réservation non trouvée.");
      }
    };

    fetchReservation();
  }, [reservationId]);

  const handleCancelReservation = async () => {
    const now = new Date(); // L'heure actuelle
    const createdAt = reservation.createdAt.toDate(); // Convertit le Timestamp Firestore en objet Date JavaScript
    const timeDiff = now - createdAt; // Différence en millisecondes
    const minutesDiff = timeDiff / (1000 * 60); // Convertit en minutes

    if (reservation.isActive && minutesDiff <= 60) {
      const reservationRef = doc(db, "RepairBookings", reservationId);

      await updateDoc(reservationRef, {
        cancelled: true,
      });

      Alert.alert(
        "Réservation annulée",
        "Votre réservation a été annulée avec succès."
      );
      navigation.goBack();
    } else if (!reservation.isActive) {
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

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
        <Image style={tw`w-25 h-15`} source={swippLogo} />
      </View>
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`mt-5 ml-3`}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold m-5`}>Votre réservation</Text>
      </View>
      {reservation && (
        <View style={tw`p-4`}>
          <Text style={tw`text-lg font-semibold`}>
            A propos de votre réservation du{" "}
            {reservation.bookingDate.toDate().toLocaleString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>

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
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Type de réparation :</Text>
            <Text style={tw`text-lg font-semibold`}>
              {" "}
              {reservation.reparationType}
            </Text>
          </View>
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
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Lieu de l'entretien : </Text>
            <Text style={tw`text-lg font-semibold w-55`}>
              {reservation.location}
            </Text>
          </View>

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
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Montant total :</Text>
            <Text style={tw`text-lg font-semibold`}> {reservation.price}</Text>
          </View>
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
