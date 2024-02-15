import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { maintenance, oil_change, reparation } from "../../assets";
import { auth, db } from "../../firebaseConfig";

const RepairIncomingReservation = () => {
  const [reservations, setReservations] = useState([]);
  const navigation = useNavigation();

  const navigateToDetail = (reservationId) => {
    navigation.navigate("DetailledRepairReservation", { reservationId });
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

    return () => unsubscribe(); // Nettoyer l'écouteur lors du démontage du composant
  }, []);

  const loadReservations = async () => {
    const q = query(
      collection(db, "RepairBookings"),
      where("userId", "==", auth.currentUser.uid),
      where("isActive", "==", true),
      where("cancelled", "==", false)
    );

    try {
      const querySnapshot = await getDocs(q);
      const loadedReservations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(loadedReservations);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations", error);
    }
  };

  const renderItem = ({ item }) => {
    let imageSource;

    switch (item.reparationType) {
      case "Contrôle technique":
        imageSource = maintenance;
        break;
      case "Entretien":
        imageSource = oil_change;
        break;
      case "Réparation":
        imageSource = reparation;
        break;
      default:
        imageSource = null;
    }

    const bookingDate = new Date(item.bookingDate.toDate());
    const formattedTime = bookingDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return (
      <View
        style={tw`w-93 h-55 p-2 bg-white border border-gray-200 rounded-2xl m-1 mr-4 shadow-md mt-3`}
      >
        <TouchableOpacity
          style={tw`flex-row justify-between`}
          onPress={() => navigateToDetail(item.id)}
        >
          <View style={tw`flex-1`}>
            <Text
              style={tw`text-gray-700 font-black text-2xl m-2`}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.reparationDetail || item.reparationType}
            </Text>
            <Text style={tw`text-gray-700 text-base font-light mt--2 ml-2`}>
              {item.reparationType}
            </Text>

            <View style={tw`flex-row mt-2 ml-2`}>
              <Ionicons name="calendar-outline" size={24} color="gray" />
              <Text style={tw`text-base ml-1`}>
                {bookingDate.toLocaleDateString("fr-FR")} - {formattedTime}
              </Text>
            </View>

            <View style={tw`flex-row mt-2 ml-2`}>
              <Ionicons name="location-outline" size={24} color="gray" />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={tw`text-base ml-1 w-40`}
              >
                {item.location}
              </Text>
            </View>

            <View
              style={tw`bg-[#34469C] px-4 py-1.5 rounded-full self-start flex-row mt-2`}
            >
              <Text style={tw`text-white text-sm font-bold`}>
                {item.price} €
              </Text>
            </View>
          </View>
          <View style={tw`w-35 h-35 mt-7`}>
            <Image
              source={imageSource}
              resizeMode="contain"
              style={tw`w-full h-full`}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <FlatList
        data={reservations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`p-2 ml-2`}
      />
    </SafeAreaView>
  );
};

export default RepairIncomingReservation;
