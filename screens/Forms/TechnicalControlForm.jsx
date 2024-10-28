// Importation des dépendances nécessaires
import { Ionicons } from "@expo/vector-icons"; // Icônes Ionicons
import { useStripe } from "@stripe/stripe-react-native"; // Intégration de Stripe pour les paiements
import { addDoc, collection, getDocs } from "firebase/firestore"; // Fonctionnalités Firestore pour gérer les données
import React, { useEffect, useState } from "react"; // Hooks React pour la gestion des états et des effets
import {
  Alert, // Affichage des alertes
  Image, // Affichage des images
  SafeAreaView, // Composant pour respecter les zones sûres sur les appareils
  ScrollView, // Vue défilable
  Text, // Composant texte
  TextInput, // Entrée de texte
  TouchableOpacity, // Boutons cliquables
  View, // Conteneur de vues
} from "react-native"; // Composants React Native
import { SelectList } from "react-native-dropdown-select-list"; // Liste déroulante pour sélectionner des éléments
import tw from "twrnc"; // Utilisation de Tailwind CSS pour le style
import { swippLogo } from "../../assets"; // Logo de l'application
import ChooseGarageModal from "../../components/Modal/ChooseGarageModal"; // Modal pour choisir un garage
import DateTimePickerModal from "../../components/Modal/DateTimePickerModal"; // Modal pour choisir une date/heure
import { auth, db } from "../../firebaseConfig"; // Configuration Firebase pour l'authentification et Firestore

// Définition du composant principal pour le formulaire de contrôle technique
const TechnicalControlForm = ({ navigation }) => {
  // Déclaration des états locaux
  const [vehicles, setVehicles] = useState([]); // Liste des véhicules de l'utilisateur
  const [selectedVehicleId, setSelectedVehicleId] = useState(""); // ID du véhicule sélectionné
  const [selectedImmatriculationPlate, setSelectedImmatriculationPlate] =
    useState(""); // Plaque d'immatriculation du véhicule sélectionné
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false); // Visibilité du sélecteur de date
  const [selectedDateTime, setSelectedDateTime] = useState(""); // Date et heure sélectionnées
  const [isGarageModalVisible, setGarageModalVisible] = useState(false); // Visibilité du modal pour choisir un garage
  const [selectedGarage, setSelectedGarage] = useState({}); // Garage sélectionné
  const [controlPrice, setControlPrice] = useState(100); // Prix du contrôle technique
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Utilisation de Stripe pour le paiement

  // Chargement des véhicules de l'utilisateur depuis Firestore
  useEffect(() => {
    const loadVehicles = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const querySnapshot = await getDocs(
            collection(db, "users", user.uid, "vehicles")
          );
          const userVehicles = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVehicles(userVehicles); // Mise à jour de la liste des véhicules
        } catch (error) {
          console.error("Erreur lors du chargement des véhicules", error);
        }
      }
    };
    loadVehicles();
  }, []);

  // Fonction pour confirmer la sélection de la date
  const handleDateTimeConfirm = (dateTime) => {
    setSelectedDateTime(dateTime.toString()); // Conversion de la date/heure en chaîne de caractères
    setDateTimePickerVisible(false); // Masquer le modal de sélection de date
  };

  // Fonction pour sélectionner un garage
  const handleSelectGarage = (garage) => {
    setSelectedGarage(garage); // Mise à jour du garage sélectionné
    setGarageModalVisible(false); // Masquer le modal de sélection de garage
  };

  // Vérification si le formulaire est valide (tous les champs sont remplis)
  const isFormValid = () => {
    return selectedVehicleId && selectedGarage && selectedDateTime;
  };

  // Fonction pour obtenir un client secret pour le paiement via Stripe
  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(
      "https://europe-west3-swipp-b74be.cloudfunctions.net/createPaymentIntent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: controlPrice * 100, // Conversion du prix en centimes pour Stripe
        }),
      }
    );
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  // Fonction pour ouvrir la feuille de paiement avec Stripe
  const openPaymentSheet = async () => {
    if (!isFormValid()) {
      Alert.alert(
        "Erreur",
        "Veuillez remplir tous les champs avant de procéder au paiement."
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

  // Fonction pour confirmer la réservation
  const handleReservationConfirm = async () => {
    const userId = auth.currentUser.uid; // Récupération de l'ID de l'utilisateur
    const bookingDate = new Date(selectedDateTime); // Conversion de la date sélectionnée
    const reparationType = "Contrôle technique"; // Type de réparation

    // Création de l'objet réservation
    const reservation = {
      userId,
      vehicleId: selectedVehicleId,
      immatriculationPlate: selectedImmatriculationPlate,
      isActive: true,
      createdAt: new Date(),
      garageId: selectedGarage.id,
      reparationType: reparationType,
      bookingDate: bookingDate,
      location: selectedGarage.name,
      price: controlPrice,
      reparationDetail: "Contrôle technique",
      cancelled: false,
      state: "Active",
    };

    try {
      // Ajout de la réservation à Firestore
      const docRef = await addDoc(
        collection(db, "RepairBookings"),
        reservation
      );
      Alert.alert("Succès", "Votre rendez-vous a été enregistré avec succès.");
      navigation.goBack(); // Retour à l'écran précédent

      // Ajout de la facture à Firestore
      await addDoc(collection(db, "purchases"), {
        userId: auth.currentUser.uid,
        amount: controlPrice,
        createdAt: new Date(),
        dateTime: bookingDate,
        bookingId: docRef.id,
        type: "Contrôle technique",
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
        {/* Affichage du logo et du titre */}
        <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} />
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()} // Retour à l'écran précédent
            style={tw`mt-5 ml-3`}
          >
            <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold m-5`}>
            Contrôle technique du véhicule
          </Text>
        </View>

        {/* Choix du véhicule */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-5`}>
          <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
          <View style={tw`rounded-md`}>
            <SelectList
              setSelected={(itemValue) => {
                const vehicle = vehicles.find((v) => v.id === itemValue);
                if (vehicle) {
                  setSelectedVehicleId(vehicle.id); // Mise à jour de l'ID du véhicule sélectionné
                  setSelectedImmatriculationPlate(vehicle.immatriculation); // Mise à jour de la plaque d'immatriculation
                } else {
                  console.error("Selected vehicle not found");
                  Alert.alert(
                    "Erreur",
                    "Le véhicule sélectionné n'est pas trouvé dans la liste."
                  );
                }
              }}
              data={vehicles.map((vehicle) => ({
                key: vehicle.id,
                value: `${vehicle.label} - ${vehicle.immatriculation}`,
              }))}
              placeholder="Indiquez le véhicule"
              boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
            />
          </View>
        </View>

        {/* Choix du garage */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-7`}>
          <Text style={tw`text-xl font-bold mb-4`}>Choisissez votre garage</Text>
          <View style={tw`rounded-md`}>
            <TouchableOpacity
              onPress={() => setGarageModalVisible(true)} // Affichage du modal pour choisir un garage
              style={tw`border-b-2 border-[#34469C] font-bold text-base`}
              value={selectedGarage}
              editable={false}
            >
              <TextInput
                style={tw`text-black font-bold text-base`}
                placeholder="Sélectionnez un garage"
                value={selectedGarage.name}
                editable={false} // Non modifiable manuellement
              />
            </TouchableOpacity>

            {/* Modal pour choisir un garage */}
            <ChooseGarageModal
              isVisible={isGarageModalVisible}
              onClose={() => setGarageModalVisible(false)} // Fermeture du modal
              onSelectGarage={handleSelectGarage} // Sélection d'un garage
            />
          </View>
        </View>

        {/* Choix de la date de rendez-vous */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-7`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Choisissez votre date de rendez-vous
          </Text>
          <View style={tw`rounded-md`}>
            <TouchableOpacity
              style={tw`border-b-2 border-[#34469C] font-bold text-base`}
              value={selectedDateTime}
              onPress={() => setDateTimePickerVisible(true)} // Affichage du sélecteur de date
              editable={false}
            >
              <TextInput
                style={tw`text-black font-bold text-base`}
                placeholder="Choisissez une date et une heure"
                value={selectedDateTime}
                editable={false} // Non modifiable manuellement
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal pour choisir une date */}
        <DateTimePickerModal
          isVisible={isDateTimePickerVisible}
          onClose={() => setDateTimePickerVisible(false)} // Fermeture du modal
          onConfirm={handleDateTimeConfirm} // Confirmation de la date
        />

        {/* Bouton de validation du rendez-vous */}
        <View style={tw`mb-4 mt-5 flex items-center`}>
          <Text style={tw`font-bold text-lg`}>Prix : {controlPrice}</Text>
          <TouchableOpacity
            onPress={openPaymentSheet} // Ouverture du paiement
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

// Export du composant
export default TechnicalControlForm;
