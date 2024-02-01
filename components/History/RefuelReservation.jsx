import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
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

  const renderItem = ({ item }) => (
    <View>
      <Text>Adresse: {item.address}</Text>
      <Text>Date: {item.bookingDate.toDate().toLocaleString()}</Text>
      <Text>Type de Carburant: {item.fuelType}</Text>
      <Text>Prix: {item.price}€</Text>
    </View>
  );

  return (
    <SafeAreaView>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default RefuelReservation;
