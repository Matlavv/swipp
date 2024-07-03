import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { auth, db } from "../../firebaseConfig";

const RefuelIncomingReservation = () => {
  const [reservations, setReservations] = useState([]);
  const navigation = useNavigation();

  const navigateToDetail = (reservationId) => {
    navigation.navigate("DetailledRefuelReservation", { reservationId });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Utilisateur connecté, charger les réservations
        loadReservations();
      } else {
        // Utilisateur déconnecté, décharger les réservations
        setReservations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadReservations = async () => {
    const q = query(
      collection(db, "RefuelBookings"),
      where("userId", "==", auth.currentUser.uid),
      where("isActive", "==", true),
      where("cancelled", "==", false)
    );

    try {
      const querySnapshot = await getDocs(q);
      const loadedReservations = querySnapshot.docs.map((doc) => {
        const reservation = {
          id: doc.id,
          ...doc.data(),
        };
        reservation.fuelType = getFuelTypeFromVehicleId(reservation.vehicleId);
        return reservation;
      });
      setReservations(loadedReservations);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReservations();
    }, [])
  );

  const getFuelTypeFromVehicleId = (vehicleId) => {
    const parts = vehicleId.split(" - ");
    return parts[parts.length - 1];
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`flex-row ml-6 w-90 p-2 bg-white border border-gray-200 rounded-2xl shadow-md mt-1 mb-3`}
            onPress={() => navigateToDetail(item.id)}
          >
            <View style={tw`flex-1`}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={tw`w-36 overflow-hidden text-gray-700 font-black text-xl mt-3 my-2 ml-2`}
              >
                {item.address}
              </Text>
              <View style={tw`ml-2`}>
                <Text style={tw`text-gray-700 font-light text-xs my-2`}>
                  {item.bookingDate} - {item.bookingHour}
                </Text>
              </View>
            </View>
            <View style={tw`flex-row justify-end items-center`}>
              <View
                style={tw`flex bg-white border border-gray-200 rounded-xl m-1 shadow-md w-20 items-center justify-center py-5`}
              >
                <Text style={tw`text-[#34469C] text-base font-semibold`}>
                  {item.fuelType}
                </Text>
              </View>
              <View
                style={tw`flex bg-white border border-gray-200 rounded-xl m-1 shadow-md w-20 items-center justify-center py-5`}
              >
                <Text style={tw`text-[#34469C] text-base font-semibold`}>
                  {item.price}€
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default RefuelIncomingReservation;
