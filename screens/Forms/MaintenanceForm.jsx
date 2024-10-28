import { Ionicons } from "@expo/vector-icons"; // Importation des icônes Ionicons pour les boutons
import { useStripe } from "@stripe/stripe-react-native"; // Hook Stripe pour les paiements
import { addDoc, collection, getDocs } from "firebase/firestore"; // Importation de Firestore pour ajouter des documents et récupérer des données
import React, { useEffect, useState } from "react"; // Importation de React et des hooks useState et useEffect
import {
  Alert, // Pour afficher des alertes natives
  Image, // Composant pour afficher des images
  SafeAreaView, // Composant pour délimiter une zone de contenu sécurisée
  ScrollView, // Permet de scroller le contenu plus grand que l'écran
  Text, // Composant pour afficher du texte
  TextInput, // Composant pour saisir du texte
  TouchableOpacity, // Composant pour rendre des éléments cliquables
  View, // Conteneur de base pour structurer les éléments
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list"; // Bibliothèque pour des listes déroulantes
import tw from "twrnc"; // Utilisation de la bibliothèque Tailwind CSS pour styliser les composants
import { swippLogo } from "../../assets"; // Importation du logo de l'application
import ChooseGarageModal from "../../components/Modal/ChooseGarageModal"; // Modal pour choisir un garage
import DateTimePickerModal from "../../components/Modal/DateTimePickerModal"; // Modal pour choisir une date et heure
import { auth, db } from "../../firebaseConfig"; // Importation de Firebase Authentication et Firestore

// Composant principal pour le formulaire d'entretien
const MaintenanceForm = ({ navigation, route }) => {
  // États pour stocker les choix de l'utilisateur (entretien, véhicule, garage, etc.)
  const [selectedMaintenance, setSelectedMaintenance] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedImmatriculationPlate, setSelectedImmatriculationPlate] = useState("");
  const [selectedGarage, setSelectedGarage] = useState({});
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [isGarageModalVisible, setGarageModalVisible] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [repairLocationType, setRepairLocationType] = useState("garage"); // 'garage' ou 'address'
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Hooks de Stripe pour les paiements

  // Options pour l'entretien
  const maintenanceOptions = [
    { id: "plaquette", value: "Changements des plaquettes", price: 80 },
    { id: "filtre", value: "Remplacement des filtres", price: 60 },
    { id: "huile", value: "Changement d'huile", price: 90 },
    { id: "pneu", value: "Changement de pneus", price: 100 },
    { id: "batterie", value: "Changement de batterie", price: 120 },
  ];

  // Vérification si tous les champs obligatoires sont remplis
  const isFormValid = () => {
    return (
      selectedMaintenance &&
      selectedVehicleId &&
      selectedDateTime &&
      ((repairLocationType === "garage" && selectedGarage) ||
        (repairLocationType === "address" && address))
    );
  };

  // Paiement avec Stripe
  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(
      "https://europe-west3-swipp-b74be.cloudfunctions.net/createPaymentIntent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPrice * 100, // Montant en centimes pour Stripe
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
        "Veuillez remplir tous les champs avant de procéder au paiement."
      );
      return;
    }
    const clientSecret = await fetchPaymentIntentClientSecret();
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

  // Charger les adresses de l'utilisateur depuis Firestore
  useEffect(() => {
    if (route.params?.address) {
      setAddress(route.params.address); // Si une adresse est passée via les paramètres de navigation
    }
  }, [route.params?.address]);

  const loadAddresses = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "adresses")
      );
      const userAddresses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAddresses(userAddresses);
    } catch (error) {
      console.error("Erreur lors du chargement des adresses", error);
      Alert.alert("Erreur", "Impossible de charger les adresses.");
    }
  };

  // Charger les véhicules de l'utilisateur depuis Firestore
  useEffect(() => {
    loadAddresses();
  }, []);

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
          setVehicles(userVehicles);
        } catch (error) {
          console.error("Erreur lors du chargement des véhicules", error);
        }
      }
    };
    loadVehicles();
  }, []);

  // Fonction pour gérer la sélection d'une date et heure
  const handleDateTimeConfirm = (dateTime) => {
    setSelectedDateTime(dateTime);
    setDateTimePickerVisible(false);
  };

  // Fonction pour gérer la sélection d'un garage
  const handleSelectGarage = (garage) => {
    setSelectedGarage(garage);
    setGarageModalVisible(false);
  };

  // Fonction pour gérer la sélection d'une option d'entretien
  const handleMaintenanceSelection = (selectedId) => {
    const selectedOption = maintenanceOptions.find(
      (option) => option.id === selectedId
    );
    if (selectedOption) {
      setSelectedMaintenance(selectedOption.value);
      setSelectedPrice(selectedOption.price); // Mise à jour du prix sélectionné
    }
  };

  // Confirmation de la réservation après le paiement
  const handleReservationConfirm = async () => {
    const userId = auth.currentUser.uid;
    const bookingDate = new Date(selectedDateTime);

    const reservation = {
      userId,
      vehicleId: selectedVehicleId,
      immatriculationPlate: selectedImmatriculationPlate,
      locationType: repairLocationType,
      location: repairLocationType === "garage" ? selectedGarage.name : address,
      garageId: repairLocationType === "garage" ? selectedGarage.id : "",
      bookingDate: bookingDate,
      createdAt: new Date(),
      reparationType: "Entretien",
      reparationDetail: selectedMaintenance,
      isActive: true,
      cancelled: false,
      price: selectedPrice,
    };

    try {
      const docRef = await addDoc(
        collection(db, "RepairBookings"),
        reservation
      );
      Alert.alert(
        "Succès",
        "Votre rendez-vous pour l'entretien a été enregistré avec succès."
      );
      navigation.goBack();

      await addDoc(collection(db, "purchases"), {
        userId: auth.currentUser.uid,
        amount: selectedPrice,
        createdAt: new Date(),
        dateTime: bookingDate,
        bookingId: docRef.id,
        type: "Entretien",
        reparationDetail: selectedMaintenance,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réservation", error);
      Alert.alert(
        "Erreur",
        "Un problème est survenu lors de l'enregistrement de votre réservation."
      );
    }
  };

  // Styles pour les boutons de sélection
  const selectedStyle = tw`bg-[#34469C] p-2 rounded-md`;
  const selectedTextStyle = tw`text-white`;

  const notSelectedStyle = tw`p-2 rounded-md border border-[#34469C]`;
  const notSelectedTextStyle = tw`text-black`;

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
        {/* Header et navigation */}
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
          <Text style={tw`text-2xl font-bold m-5`}>Entretien du véhicule</Text>
        </View>

        {/* Sélection de l'entretien */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-4`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Sélectionnez votre besoin
          </Text>
          <SelectList
            setSelected={handleMaintenanceSelection}
            data={maintenanceOptions.map((option) => ({
              key: option.id,
              value: `${option.value} - ${option.price}€`,
            }))}
            placeholder="Sélectionnez votre besoin"
            boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
          />
        </View>

        {/* Sélection du véhicule */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-4`}>
          <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
          <SelectList
            setSelected={(itemValue) => {
              const vehicle = vehicles.find((v) => v.id === itemValue);
              if (vehicle) {
                setSelectedVehicleId(vehicle.id);
                setSelectedImmatriculationPlate(vehicle.immatriculation);
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

        {/* Sélection du lieu de l'entretien */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-4`}>
          <Text style={tw`text-xl font-bold mb-4`}>Lieu de l'entretien</Text>
          <View style={tw`flex-row justify-around`}>
            <TouchableOpacity
              onPress={() => setRepairLocationType("garage")}
              style={
                repairLocationType === "garage"
                  ? selectedStyle
                  : notSelectedStyle
              }
            >
              <Text
                style={
                  repairLocationType === "garage"
                    ? selectedTextStyle
                    : notSelectedTextStyle
                }
              >
                Garage
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRepairLocationType("address")}
              style={
                repairLocationType === "address"
                  ? selectedStyle
                  : notSelectedStyle
              }
            >
              <Text
                style={
                  repairLocationType === "address"
                    ? selectedTextStyle
                    : notSelectedTextStyle
                }
              >
                Adresse
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Si "adresse" est sélectionnée, affichage de l'adresse */}
        {repairLocationType === "address" && (
          <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-4`}>
            <TextInput
              style={tw`border-b-2 mb-4 border-[#34469C] font-bold text-base`}
              value={address}
              onChangeText={setAddress}
              placeholder="Adresse"
            />
            <Text style={tw`text-lg font-semibold mb-2`}>Mes adresses</Text>
            <SelectList
              setSelected={(val) => setAddress(val)}
              placeholder="Adresse"
              boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
              data={addresses.map((address) => ({
                value: `${address.adresse} - ${address.codePostal} - ${address.ville}`,
                id: address.id,
              }))}
              onSelect={() => setAddress(address)}
              save="value"
            />
          </View>
        )}

        {/* Si "garage" est sélectionné, affichage du garage */}
        {repairLocationType === "garage" && (
          <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-4`}>
            <Text style={tw`text-xl font-bold mb-4`}>Choisissez un garage</Text>
            <TouchableOpacity
              onPress={() => setGarageModalVisible(true)}
              style={tw`border-b-2 border-[#34469C] py-2`}
            >
              <Text style={tw`text-black font-bold text-base`}>
                {selectedGarage.name || "Choisissez un garage"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sélection de la date */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-4`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Choisissez votre date de rendez-vous
          </Text>
          <TouchableOpacity
            onPress={() => setDateTimePickerVisible(true)}
            style={tw`border-b-2 border-[#34469C] py-2`}
          >
            <Text style={tw`text-black font-bold text-base`}>
              {selectedDateTime
                ? new Date(selectedDateTime).toLocaleString()
                : "Choisissez une date et une heure"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Composants modaux pour choisir un garage et une date */}
        <ChooseGarageModal
          isVisible={isGarageModalVisible}
          onClose={() => setGarageModalVisible(false)}
          onSelectGarage={handleSelectGarage}
        />

        <DateTimePickerModal
          isVisible={isDateTimePickerVisible}
          onClose={() => setDateTimePickerVisible(false)}
          onConfirm={handleDateTimeConfirm}
        />

        {/* Bouton pour valider la réservation */}
        <View style={tw`mb-4 mt-5 flex items-center`}>
          <Text style={tw`text-lg font-bold`}>Prix estimé : {selectedPrice} €</Text>
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

export default MaintenanceForm; // Export du composant pour l'utiliser dans l'application
