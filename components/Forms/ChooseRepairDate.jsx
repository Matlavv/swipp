import { Ionicons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { auth, db } from "../../firebaseConfig";

const ChooseRepairDate = ({ route, navigation }) => {
  const { selectedValue, selectedVehicleId, selectedGarage, selectedPrice } =
    route.params;
  const [availabilities, setAvailabilities] = useState([]);
  const [expandedDate, setExpandedDate] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (selectedGarage.id) {
        const docRef = doc(db, "garages", selectedGarage.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { availabilities } = docSnap.data();
          setAvailabilities(availabilities || []);
        }
      }
    };
    fetchAvailabilities();
  }, [selectedGarage.id]);

  const handleDatePress = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const handleTimeSlotPress = (date, time) => {
    const selectedDateTime = `${date} ${time}`;
    setSelectedDateTime(selectedDateTime);
  };

  const formatDate = (dateString) => {
    const options = { weekday: "long", day: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const isFormValid = () => {
    return selectedDateTime;
  };

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(
      "https://europe-west3-swipp-b74be.cloudfunctions.net/createPaymentIntent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPrice * 100,
        }),
      }
    );
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const openPaymentSheet = async () => {
    if (!isFormValid()) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner une date et une heure avant de procéder au paiement."
      );
      return;
    }
    const clientSecret = await fetchPaymentIntentClientSecret();
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: "Swipp",
      style: "alwaysLight",
    });
    if (error) {
      console.error(error);
      return;
    }
    const result = await presentPaymentSheet();
    if (result.error) {
      Alert.alert("Erreur de paiement", result.error.message);
    } else {
      Alert.alert(
        "Paiement réussi",
        "Votre paiement a été effectué avec succès."
      );
      await handleReservationConfirm();
    }
  };

  const handleReservationConfirm = async () => {
    const userId = auth.currentUser.uid;
    const bookingDate = new Date(selectedDateTime);

    const fetchUserData = async (userId) => {
      const userDoc = doc(db, "users", userId);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("Aucun document utilisateur trouvé!");
        return null;
      }
    };

    const userData = await fetchUserData(userId);
    if (!userData) {
      Alert.alert(
        "Erreur",
        "Impossible de récupérer les informations de l'utilisateur."
      );
      return;
    }
    // Création de l'objet réservation
    const reservation = {
      userId,
      vehicleId: selectedVehicleId.id,
      immatriculationPlate: selectedVehicleId.immatriculationPlate,
      isActive: true,
      createdAt: new Date(),
      reparationType: "Réparation",
      reparationDetail: selectedValue,
      bookingDate: bookingDate,
      garageId: selectedGarage.id,
      isActive: true,
      cancelled: false,
      price: selectedPrice,
      location: selectedGarage.name,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      username: userData.username,
      state: "Active",
    };

    try {
      // Ajout de la réservation à Firestore
      const docRef = await addDoc(
        collection(db, "RepairBookings"),
        reservation
      );

      // Mise à jour des créneaux disponibles du garage
      const garageRef = doc(db, "garages", selectedGarage.id);
      const garageDoc = await getDoc(garageRef);
      if (garageDoc.exists()) {
        const availabilities = garageDoc.data().availabilities || [];
        const updatedAvailabilities = availabilities.map((avail) => {
          if (avail.date === selectedDateTime.split(" ")[0]) {
            return {
              ...avail,
              slots: avail.slots.filter(
                (slot) => slot !== selectedDateTime.split(" ")[1]
              ),
            };
          }
          return avail;
        });
        await updateDoc(garageRef, { availabilities: updatedAvailabilities });
      }

      Alert.alert("Succès", "Votre rendez-vous a été enregistré avec succès.");
      navigation.goBack();

      // Ajout de la facture à Firestore
      await addDoc(collection(db, "purchases"), {
        userId: auth.currentUser.uid,
        amount: selectedPrice,
        createdAt: new Date(),
        dateTime: bookingDate,
        bookingId: docRef.id,
        type: "Reparation",
        reparationDetail: selectedValue,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réservation", error);
      Alert.alert(
        "Erreur",
        "Un problème est survenu lors de l'enregistrement de votre réservation."
      );
    }
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mt-5 ml-3`}
          >
            <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold m-5`}>Choisir une date</Text>
        </View>
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Sélectionnez votre date et heure
          </Text>
          <View style={tw`rounded-md`}>
            {availabilities
              .filter(
                (availability) => new Date(availability.date) >= new Date()
              )
              .map((availability, index) => (
                <View key={index} style={tw`mb-4`}>
                  <TouchableOpacity
                    onPress={() => handleDatePress(availability.date)}
                    style={tw`flex-row justify-between items-center border-b pb-2`}
                  >
                    <Text style={tw`text-lg`}>
                      {formatDate(availability.date)}
                    </Text>
                    <Ionicons
                      name={
                        expandedDate === availability.date
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                  {expandedDate === availability.date && (
                    <View style={tw`mt-2`}>
                      {availability.slots.map((slot, slotIndex) => (
                        <TouchableOpacity
                          key={slotIndex}
                          onPress={() =>
                            handleTimeSlotPress(availability.date, slot)
                          }
                          style={[
                            tw`mb-2 p-2 rounded`,
                            selectedDateTime === `${availability.date} ${slot}`
                              ? tw`bg-blue-800`
                              : tw`bg-blue-200`,
                          ]}
                        >
                          <Text
                            style={[
                              tw`text-center`,
                              selectedDateTime ===
                              `${availability.date} ${slot}`
                                ? tw`text-white`
                                : tw`text-black`,
                            ]}
                          >
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
          </View>
        </View>
        {/* Submit button */}
        <View style={tw`mb-4 mt-3 flex items-center`}>
          <Text style={tw`font-bold text-lg`}>Prix : {selectedPrice}€</Text>
          <TouchableOpacity
            onPress={openPaymentSheet}
            style={tw`bg-[#34469C] p-4 rounded-md w-5/6 items-center mt-3`}
          >
            <Text style={tw`text-white font-semibold text-base`}>
              Valider mon rendez-vous
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChooseRepairDate;
