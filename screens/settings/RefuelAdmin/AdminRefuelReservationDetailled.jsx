import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { swippLogo } from "../../../assets";
import { db } from "../../../firebaseConfig";

const AdminRefuelReservationDetailled = ({ route }) => {
  const { reservationId } = route.params;
  const [reservation, setReservation] = useState(null);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReservation = async () => {
      const docRef = doc(db, "RefuelBookings", reservationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const reservationData = docSnap.data();
        setReservation({ id: docSnap.id, ...reservationData });
        const userSnap = await getDoc(doc(db, "users", reservationData.userId));
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }
      } else {
        Alert.alert("Erreur", "Réservation non trouvée.");
      }
    };

    fetchReservation();
  }, [reservationId]);

  const handleMarkAsCompleted = async () => {
    const reservationRef = doc(db, "RefuelBookings", reservationId);
    await updateDoc(reservationRef, {
      isActive: false,
    });
    Alert.alert("Succès", "La réservation a été marquée comme effectuée.");
    navigation.goBack();
  };

  const handleCancelReservation = async () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir annuler cette réservation ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Oui",
          onPress: async () => {
            const reservationRef = doc(db, "RefuelBookings", reservationId);
            await updateDoc(reservationRef, {
              cancelled: true,
            });
            Alert.alert("Succès", "La réservation a été annulée.");
            navigation.goBack();
          },
        },
      ]
    );
  };

  const openInMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Erreur", "Impossible d'ouvrir Google Maps.")
    );
  };

  const getFuelTypeFromVehicleId = (vehicleId) => {
    const parts = vehicleId.split(" - ");
    return parts[parts.length - 1];
  };

  const getVehiculeInformation = (vehicleId) => {
    const parts = vehicleId.split(" - ");
    return parts[parts.length - 2];
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
        <Text style={tw`text-xl font-bold m-5`}>
          Réservation de {user?.firstName}
          {user?.lastName}
        </Text>
      </View>
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
              {getVehiculeInformation(reservation.vehicleId)}
            </Text>
          </View>
          <View
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Carburant choisi :</Text>
            <Text style={tw`text-lg font-semibold`}>
              {" "}
              {getFuelTypeFromVehicleId(reservation.vehicleId)}
            </Text>
          </View>
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
          <TouchableOpacity
            onPress={() => openInMaps(reservation.address)}
            style={tw`flex-row mt-3 border border-gray-300 rounded-2xl p-2 bg-white`}
          >
            <Text style={tw`text-lg`}>Adresse :</Text>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-lg font-semibold text-[#34469C]`}>
                {reservation.address}
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
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={tw`bg-green-500 mt-8 p-2 rounded-lg shadow-xl`}
            onPress={handleMarkAsCompleted}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              Marquer comme effectuée
            </Text>
          </TouchableOpacity>
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

export default AdminRefuelReservationDetailled;
