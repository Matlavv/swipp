import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";
import { auth, db } from "../../firebaseConfig";

const RefuelReservation = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const loadReservations = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, "RefuelBookings"),
          where("userId", "==", auth.currentUser.uid)
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
      }
    };

    loadReservations();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Text style={tw`text-2xl font-bold mt-4 ml-4`}>A venir</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={tw`flex-row ml-6 w-90 p-2 bg-white border border-gray-200 rounded-2xl shadow-md mt-3`}
          >
            <View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={tw`w-30 overflow-hidden text-gray-700 font-black text-xl mt-3 m-2`}
              >
                {item.address}
              </Text>
              <Text style={tw`text-gray-700 font-light text-xs m-2`}>
                {item.bookingDate.toDate().toLocaleString()}
              </Text>
            </View>
            <View style={tw`flex-row justify-center w-65`}>
              <View
                style={tw`flex bg-white border border-gray-200 rounded-xl m-1 shadow-md w-1/4 items-center justify-center`}
              >
                <Text style={tw`text-[#34469C] text-base font-semibold`}>
                  {item.fuelType}
                </Text>
              </View>
              <View
                style={tw`flex bg-white border border-gray-200 rounded-xl m-1 shadow-md w-1/4 items-center justify-center`}
              >
                <Text style={tw`text-[#34469C] text-base font-semibold`}>
                  {item.price}€
                </Text>
              </View>
            </View>
          </View>
        )}
      />
      <Text style={tw`text-2xl font-bold mt-4 ml-4`}>Passées</Text>
    </SafeAreaView>
  );
};

export default RefuelReservation;
