import { Ionicons } from "@expo/vector-icons"; // Importation des icônes Ionicons pour les boutons
import { useStripe } from "@stripe/stripe-react-native"; // Hook Stripe pour les paiements
import { addDoc, collection, doc, getDoc } from "firebase/firestore"; // Importation de Firestore pour ajouter des documents et récupérer des données
import React, { useEffect, useState } from "react"; // Importation de React et des hooks useState et useEffect
import {
  Alert, // Pour afficher des alertes natives
  SafeAreaView, // Composant pour délimiter une zone de contenu sécurisée
  ScrollView, // Permet de scroller le contenu plus grand que l'écran
  Text, // Composant pour afficher du texte
  TouchableOpacity, // Composant pour rendre des éléments cliquables
  View, // Conteneur de base pour structurer les éléments
} from "react-native";
import tw from "twrnc"; // Utilisation de la bibliothèque Tailwind CSS pour styliser les composants
import { auth, db } from "../../firebaseConfig"; // Importation de Firebase Authentication et Firestore

// Composant principal pour choisir une date de réparation
const ChooseRepairDate = ({ route, navigation }) => {
  // Récupération des paramètres passés via `route`
  const { selectedValue, selectedVehicleId, selectedGarage, selectedPrice } = route.params;

  // États pour stocker les disponibilités, la date sélectionnée et le créneau sélectionné
  const [availabilities, setAvailabilities] = useState([]);
  const [expandedDate, setExpandedDate] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState("");

  const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Hooks de Stripe pour initialiser et présenter la feuille de paiement

  // Hook useEffect pour charger les disponibilités du garage lors du montage du composant
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (selectedGarage.id) {
        const docRef = doc(db, "garages", selectedGarage.id); // Récupération des données du garage
        const docSnap = await getDoc(docRef); // Obtient les données du garage
        if (docSnap.exists()) {
          const { availabilities } = docSnap.data(); // Extrait les disponibilités
          setAvailabilities(availabilities || []); // Stocke les disponibilités dans l'état
        }
      }
    };
    fetchAvailabilities();
  }, [selectedGarage.id]); // Exécution à chaque changement d'ID de garage

  // Gestion de l'ouverture et fermeture des créneaux horaires pour une date sélectionnée
  const handleDatePress = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  // Gestion de la sélection d'un créneau horaire
  const handleTimeSlotPress = (date, time) => {
    const selectedDateTime = `${date} ${time}`;
    setSelectedDateTime(selectedDateTime);
  };

  // Fonction pour formater la date en français
  const formatDate = (dateString) => {
    const options = { weekday: "long", day: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Vérification si une date et une heure ont été sélectionnées
  const isFormValid = () => {
    return selectedDateTime;
  };

  // Récupère le secret du PaymentIntent depuis le backend
  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(
      "https://europe-west3-swipp-b74be.cloudfunctions.net/createPaymentIntent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPrice * 100, // Conversion du prix en centimes pour Stripe
        }),
      }
    );
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  // Fonction pour ouvrir la feuille de paiement
  const openPaymentSheet = async () => {
    if (!isFormValid()) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner une date et une heure avant de procéder au paiement."
      );
      return;
    }

    const clientSecret = await fetchPaymentIntentClientSecret(); // Récupère le clientSecret depuis le backend
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: "Swipp", // Nom de l'entreprise affiché dans la feuille de paiement
      style: "alwaysLight", // Style de la feuille de paiement
    });

    if (error) {
      console.error(error); // Gestion des erreurs d'initialisation
      return;
    }

    const result = await presentPaymentSheet(); // Présente la feuille de paiement à l'utilisateur
    if (result.error) {
      Alert.alert("Erreur de paiement", result.error.message);
    } else {
      Alert.alert(
        "Paiement réussi",
        "Votre paiement a été effectué avec succès."
      );
      await handleReservationConfirm(); // Confirmation de la réservation après paiement
    }
  };

  // Fonction pour confirmer la réservation après paiement
  const handleReservationConfirm = async () => {
    const userId = auth.currentUser.uid;

    // Extraction et formatage de la date et de l'heure sélectionnées
    const [weekday, monthName, day, year, time] = selectedDateTime.split(" ");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = months.indexOf(monthName);

    if (monthIndex === -1) {
      console.error("Invalid month:", monthName);
      Alert.alert("Erreur", "Le mois sélectionné est invalide.");
      return;
    }

    // Création de l'objet Date en fonction de la date et heure sélectionnées
    const bookingDateHour = new Date(year, monthIndex, day, ...time.split(":"));

    if (isNaN(bookingDateHour.getTime())) {
      console.error("Invalid date or time:", selectedDateTime);
      Alert.alert("Erreur", "La date ou l'heure sélectionnée est invalide.");
      return;
    }

    const bookingDate = bookingDateHour.toISOString().split("T")[0]; // Format YYYY-MM-DD
    const bookingHour = bookingDateHour.toTimeString().split(" ")[0].slice(0, 5); // Format HH:MM

    // Récupération des informations utilisateur depuis Firestore
    const fetchUserData = async (userId) => {
      const userDoc = doc(db, "users", userId);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        return docSnap.data(); // Retourne les données utilisateur si elles existent
      } else {
        console.error("Aucun document utilisateur trouvé!");
        return null;
      }
    };

    const userData = await fetchUserData(userId);
    if (!userData) {
      Alert.alert("Erreur", "Impossible de récupérer les informations de l'utilisateur.");
      return;
    }

    // Création de l'objet réservation avec les données récupérées et sélectionnées
    const reservation = {
      userId,
      vehicleId: selectedVehicleId.id,
      immatriculationPlate: selectedVehicleId.immatriculationPlate,
      isActive: true,
      createdAt: new Date().toISOString(),
      reparationType: "Réparation",
      reparationDetail: selectedValue,
      bookingDate: bookingDate,
      bookingHour: bookingHour,
      bookingDateHour: bookingDateHour.toISOString(),
      garageId: selectedGarage.id,
      isActive: true,
      cancelled: false,
      price: selectedPrice,
      adress: selectedGarage.address,
      phoneNumber: selectedGarage.phoneNumber,
      location: selectedGarage.name,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      username: userData.username,
      state: "Active",
    };

    console.log("Creating reservation with data:", reservation);

    try {
      // Ajout de la réservation à Firestore
      const docRef = await addDoc(collection(db, "RepairBookings"), reservation);

      Alert.alert("Succès", "Votre rendez-vous a été enregistré avec succès.");
      navigation.goBack();

      // Ajout de la facture à Firestore
      await addDoc(collection(db, "purchases"), {
        userId: auth.currentUser.uid,
        amount: selectedPrice,
        createdAt: new Date().toISOString(),
        dateTime: `${bookingDate} ${bookingHour}`,
        bookingId: docRef.id,
        type: "Reparation",
        reparationDetail: selectedValue,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réservation", error);
      Alert.alert("Erreur", "Un problème est survenu lors de l'enregistrement de votre réservation.");
    }
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
        {/* En-tête avec le bouton retour et le titre */}
        <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mt-5 ml-3`}
          >
            <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold m-5`}>Choisir une date</Text>
        </View>

        {/* Section pour la sélection de la date et heure */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>Sélectionnez votre date et heure</Text>
          <View style={tw`rounded-md`}>
            {availabilities
              .filter(
                (availability) => new Date(availability.date) >= new Date() // Filtre les dates antérieures à aujourd'hui
              )
              .map((availability, index) => (
                <View key={index} style={tw`mb-4`}>
                  {/* Affichage de chaque date disponible */}
                  <TouchableOpacity
                    onPress={() => handleDatePress(availability.date)}
                    style={tw`flex-row justify-between items-center border-b pb-2`}
                  >
                    <Text style={tw`text-lg`}>{formatDate(availability.date)}</Text>
                    <Ionicons
                      name={expandedDate === availability.date ? "chevron-up" : "chevron-down"}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>

                  {/* Affichage des créneaux horaires pour la date sélectionnée */}
                  {expandedDate === availability.date && (
                    <View style={tw`mt-2`}>
                      {availability.slots.map((slot, slotIndex) => (
                        <TouchableOpacity
                          key={slotIndex}
                          onPress={() => handleTimeSlotPress(availability.date, slot)}
                          style={[
                            tw`mb-2 p-2 rounded`,
                            selectedDateTime === `${availability.date} ${slot}` ? tw`bg-blue-800` : tw`bg-blue-200`,
                          ]}
                        >
                          <Text style={[
                              tw`text-center`,
                              selectedDateTime === `${availability.date} ${slot}` ? tw`text-white` : tw`text-black`,
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

        {/* Bouton pour valider le rendez-vous et lancer le paiement */}
        <View style={tw`mb-4 mt-3 flex items-center`}>
          <Text style={tw`font-bold text-lg`}>Prix : {selectedPrice}€</Text>
          <TouchableOpacity
            onPress={openPaymentSheet}
            style={tw`bg-[#34469C] p-4 rounded-md w-5/6 items-center mt-3`}
          >
            <Text style={tw`text-white font-semibold text-base`}>Valider mon rendez-vous</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChooseRepairDate; // Export du composant pour l'utiliser dans l'application
