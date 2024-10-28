import { Ionicons } from "@expo/vector-icons"; // Importation des icônes Ionicons
import { useStripe } from "@stripe/stripe-react-native"; // Utilisation de Stripe pour les paiements
import * as Location from "expo-location"; // Librairie pour obtenir la géolocalisation
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore"; // Firestore pour interagir avec la base de données
import React, { useEffect, useState } from "react"; // Utilisation de React et de ses hooks
import {
  Alert, // Affichage d'alertes
  Image, // Affichage d'images
  SafeAreaView, // Zone de sécurité pour éviter le chevauchement avec les éléments natifs
  ScrollView, // Vue défilante pour le contenu
  Text, // Affichage de texte
  TextInput, // Saisie de texte
  TouchableOpacity, // Composant tactile
  View, // Conteneur de base
  FlatList, // Liste pour afficher plusieurs éléments
} from "react-native";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list"; // Listes de sélection unique et multiple
import Geocoder from "react-native-geocoding"; // Utilisation de l'API Geocoder pour obtenir une adresse à partir de coordonnées GPS
import tw from "twrnc"; // Utilisation de Tailwind CSS pour styliser les composants
import { swippLogo } from "../../assets"; // Importation du logo de l'application
import ChooseRefuelerModal from "../../components/Modal/ChooseRefuelerModal"; // Modal pour choisir un refueler
import RefuelDateTimePickerModal from "../../components/Modal/RefuelDateTimePickerModal"; // Modal pour sélectionner une date et une heure
import { auth, db } from "../../firebaseConfig"; // Authentification et base de données Firebase
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Utilisation de la navigation dans l'application
import { KeyboardAvoidingView, Platform } from 'react-native'; // Gestion du clavier pour éviter qu'il ne chevauche les champs de texte

// Initialisation de Geocoder avec une clé API
Geocoder.init("AIzaSyAxJi9a4Bt8lKrKtl5DH6WIsPWkbBMgbeg");

const RefuelForm = ({ route }) => {
  // État pour chaque champ du formulaire
  const [selectedFuel, setSelectedFuel] = useState("");
  const [volume, setVolume] = useState("");
  const [options, setOptions] = useState([]);
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [price, setPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Stripe pour la gestion du paiement
  const [isRefuelerModalVisible, setRefuelerModalVisible] = useState(false);
  const [selectedRefueler, setSelectedRefueler] = useState(null);
  const navigation = useNavigation(); // Gestion de la navigation
  const [currentStep, setCurrentStep] = useState(1); // Gestion des étapes du formulaire
  const [refuelers, setRefuelers] = useState([]); // Liste des refuelers
  const data = [
    { key: "1", value: "adblue" },
    { key: "2", value: "lave vitre" },
    { key: "3", value: "gonflage de pneus" },
    { key: "4", value: "liquide de refroidissement" },
  ]; // Liste des options supplémentaires pour le service de refuel

  // Fonction pour naviguer vers l'écran des véhicules
  const goToVehiculeScreen = () => {
    navigation.navigate("VehicleScreen");
  };

  // Fonction pour naviguer vers l'écran des adresses
  const goToAddressScreen = () => {
    navigation.navigate("AdressScreen");
  };

  // Fonction pour charger les adresses et véhicules au focus de l'écran
  useFocusEffect(
    React.useCallback(() => {
      loadAddresses(); // Chargement des adresses
      loadVehicles(); // Chargement des véhicules
      fetchRefuelers(); // Chargement des refuelers
    }, [])
  );

  // Si l'adresse a été passée via les paramètres, elle est définie ici
  useEffect(() => {
    if (route.params?.address) {
      setAddress(route.params.address);
    }
  }, [route.params?.address]);

  // Vérification si le formulaire est valide
  const isFormValid = () => {
    return (
      selectedFuel &&
      volume &&
      address &&
      selectedDate &&
      selectedTime &&
      selectedVehicleId &&
      selectedRefueler
    );
  };

  // Fonction pour récupérer la liste des refuelers depuis Firestore
  const fetchRefuelers = async () => {
    try {
      const refuelersCollection = collection(db, "users");
      const refuelersQuery = query(refuelersCollection, where("role", "==", "refueler"));
      const querySnapshot = await getDocs(refuelersQuery);
      const refuelersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRefuelers(refuelersList);
    } catch (error) {
      console.error("Erreur lors de la récupération des refuelers", error);
    }
  };

  // Sélection d'un refueler
  const handleSelectRefueler = (refueler) => {
    setSelectedRefueler(refueler);
  };

  // Fonction pour gérer le paiement avec Stripe
  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(
      "https://europe-west3-swipp-b74be.cloudfunctions.net/createPaymentIntent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: calculateTotalPrice() * 100, // Montant en centimes pour Stripe
        }),
      }
    );

    const { clientSecret } = await response.json();
    return clientSecret;
  };

  // Ouverture de la feuille de paiement
  const openPaymentSheet = async () => {
    if (!isFormValid()) {
      Alert.alert(
        "Erreur",
        "Veuillez remplir tous les champs avant de procéder au paiement."
      );
      return;
    }

    try {
      const clientSecret = await fetchPaymentIntentClientSecret();
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Swipp", // Nom de l'entreprise pour Stripe
        style: "alwaysLight", // Style de la feuille de paiement
      });

      if (error) {
        console.error(
          "Erreur d'initialisation de la feuille de paiement",
          error
        );
        return;
      }

      const result = await presentPaymentSheet(); // Présentation de la feuille de paiement

      if (result.error) {
        Alert.alert("Erreur de paiement", result.error.message);
      } else {
        Alert.alert(
          "Paiement réussi",
          "Votre paiement a été effectué avec succès."
        );
        await handleReservationConfirm(); // Confirmation de la réservation après paiement
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'ouverture de la feuille de paiement",
        error
      );
    }
  };

  // Chargement des adresses de l'utilisateur depuis Firestore
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

  useEffect(() => {
    loadAddresses(); // Chargement des adresses lors du montage du composant
  }, []);

  // Fonction pour récupérer la localisation de l'utilisateur
  const handleLocatePress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const json = await Geocoder.from(latitude, longitude);
      const addressComponent = json.results[0].formatted_address;
      setAddress(addressComponent);
    } catch (error) {
      console.error("Erreur lors de la géolocalisation", error);
      Alert.alert("Erreur", "Impossible de récupérer votre localisation.");
    }
  };

  // Chargement des véhicules de l'utilisateur depuis Firestore
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

  useEffect(() => {
    loadVehicles(); // Chargement des véhicules lors du montage du composant
  }, []);

  // Confirmation de la sélection de la date et de l'heure
  const handleDateTimeConfirm = (dateTimeObj) => {
    setSelectedDate(dateTimeObj.date);
    setSelectedTime(dateTimeObj.timeSlot);
    setDateTimePickerVisible(false);
  };

  // Affichage du sélecteur de date et heure
  const showDateTimePicker = () => {
    setDateTimePickerVisible(true);
  };

  // Calcul du prix total en fonction du volume sélectionné et du prix unitaire
  const calculateTotalPrice = () => {
    if (!volume || !price) {
      return 0;
    }
    const totalPrice = parseFloat(volume) * price;
    return totalPrice.toFixed(2);
  };

  // Sélection d'un véhicule
  const handleSelectVehicle = async (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    const user = auth.currentUser;
    if (user) {
      try {
        const vehicleDoc = await getDoc(
          doc(db, "users", user.uid, "vehicles", vehicleId)
        );
        if (vehicleDoc.exists()) {
          const vehicleData = vehicleDoc.data();
          setCarBrand(vehicleData.marque); // Enregistrement de la marque
          setCarModel(vehicleData.modele); // Enregistrement du modèle
          setSelectedVehicle(vehicleData); // Enregistrement des informations du véhicule
          const parts = vehicleId.split("-");
          const lastPart = parts[parts.length - 1].trim();
          setSelectedFuel(lastPart); // Extraction du carburant sélectionné
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations du véhicule",
          error
        );
      }
    }
  };

  // Confirmation de la réservation et enregistrement dans Firestore
  const handleReservationConfirm = async () => {
    const reservation = {
      address,
      vehicleId: selectedVehicleId,
      createdAt: new Date(),
      isActive: true,
      userId: auth.currentUser.uid,
      volume: parseFloat(volume),
      price: calculateTotalPrice(),
      options: selectedOptions,
      bookingDate: selectedDate,
      bookingHour: selectedTime,
      cancelled: false,
      state: "Active",
      refuelerId: selectedRefueler.id,
      vehicle: selectedVehicleId,
    };

    try {
      const docRef = await addDoc(
        collection(db, "RefuelBookings"),
        reservation
      );
      Alert.alert("Succès", `Votre réservation a été enregistrée.`);
      navigation.goBack();

      await addDoc(collection(db, "purchases"), {
        userId: auth.currentUser.uid,
        amount: calculateTotalPrice(),
        fuelType: selectedFuel,
        createdAt: new Date(),
        bookingDate: selectedDate,
        bookingHour: selectedTime,
        bookingId: docRef.id,
        type: "Refuel",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réservation", error);
      Alert.alert(
        "Erreur",
        "Un problème est survenu lors de l'enregistrement de votre réservation."
      );
    }
  };

  // Calcul du prix en fonction du carburant sélectionné
  const calculatePrice = (selectedFuel, currentAddress) => {
    let basePrice;
    switch (selectedFuel) {
      case "SP98":
        basePrice = 1.95;
        break;
      case "SP95":
        basePrice = 1.82;
        break;
      case "Gasoil":
        basePrice = 1.72;
        break;
      case "E85":
        basePrice = 1.65;
        break;
      default:
        basePrice = 0;
    }
    setPrice(basePrice);
  };

  // Recalcul du prix lorsque le carburant ou l'adresse changent
  useEffect(() => {
    calculatePrice(selectedFuel, address);
  }, [selectedFuel, address]);

  // Navigation vers l'étape suivante
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      calculatePrice(selectedFuel);
    }
  };

  // Navigation vers l'étape précédente
  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    calculatePrice(selectedFuel);
  };

  // Effacer l'adresse sélectionnée
  const clearAddress = () => {
    setAddress("");
  };

  // Définition des différentes étapes du formulaire
  const Step1 = () => (
    <View>
      {/* Choix du point de rendez-vous */}
      <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
        <Text style={tw`text-xl font-bold mb-4`}>Indiquez le point de rendez-vous</Text>
        <View style={tw`rounded-md flex-row items-center`}>
          <TextInput
            style={tw`border-b-2 mb-4 border-[#34469C] font-bold text-base flex-1`}
            value={address}
            onChangeText={setAddress}
          />
          {address !== "" && (
            <TouchableOpacity onPress={clearAddress} style={tw`ml-2`}>
              <Ionicons name="close-circle" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        {address === "" && (
          <>
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
            <Text style={tw`text-lg font-semibold mb-2`}>Ou</Text>
            <TouchableOpacity
              onPress={handleLocatePress}
              style={tw`bg-blue-900 py-2 px-4 rounded-lg justify-center items-center`}
            >
              <Text style={tw`text-white font-semibold`}>Me géolocaliser</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goToAddressScreen}
              style={tw`bg-blue-900 py-2 px-4 rounded-lg justify-center items-center mt-4`}
            >
              <Text style={tw`text-white font-semibold`}>Ajouter une adresse</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Choix du véhicule */}
      <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
        <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
        <View style={tw`rounded-md`}>
          <SelectList
            data={vehicles.map((vehicle) => ({
              id: vehicle.id,
              value: `${vehicle.label} - ${vehicle.immatriculation} - ${vehicle.carburant}`,
            }))}
            setSelected={handleSelectVehicle}
            placeholder="Véhicule"
            boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
          />
        </View>
        <TouchableOpacity
          onPress={goToVehiculeScreen} // Utilisation de la fonction corrigée
          style={tw`bg-blue-900 py-2 px-4 rounded-lg justify-center items-center mt-4`}
        >
          <Text style={tw`text-white font-semibold`}>
            Ajouter un véhicule
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Étape 2 : Choix du volume de carburant et des options
  const Step2 = () => (
    <View>
      {/* Indication du volume de carburant */}
      <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
        <Text style={tw`text-xl font-bold mb-4`}>
          Indiquez le nombre de litres
        </Text>
        <TextInput
          style={tw`border-b-2 border-[#34469C] font-bold text-base`}
          keyboardType="numeric"
          value={volume}
          onChangeText={setVolume}
        />
      </View>

      {/* Choix des options supplémentaires */}
      <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 my-3`}>
        <Text style={tw`text-xl font-bold mb-4`}>Ajouter des options</Text>
        <View style={tw`bg-gray-200`}>
          <MultipleSelectList
            setSelected={(val) => setSelectedOptions(val)}
            data={data}
            save="value"
            placeholder="Options"
            search={false}
            label="Options"
            boxStyles={{
              backgroundColor: "white",
              borderColor: "#34469C",
              borderRadius: 10,
            }}
            dropdownStyles={{ backgroundColor: "white" }}
          />
        </View>
      </View>
    </View>
  );

  // Étape 3 : Choix du refueler
  const Step3 = () => (
    <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
      <Text style={tw`text-xl font-bold mb-4`}>Choisissez votre refueler</Text>
      <FlatList
        data={refuelers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectRefueler(item)}>
            <View style={tw`flex-row justify-between items-center p-4 border-b`}>
              <Image
                source={{ uri: item.profileImageUrl || 'URL_DE_L_IMAGE_PAR_DÉFAUT' }}
                style={tw`w-12 h-12 rounded-full`}
              />
              <Text style={tw`text-lg font-semibold`}>
                {item.firstName} - {item.phoneNumber}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  // Étape 4 : Choix de la date et validation du paiement
  const Step4 = () => (
    <View>
      {/* Sélection de la date et de l'heure */}
      <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
        <Text style={tw`text-xl font-bold mb-4`}>
          Choisissez votre date de rendez-vous
        </Text>
        <View style={tw`rounded-md`}>
          <TouchableOpacity
            style={tw`border-b-2 border-[#34469C] font-bold text-base`}
            value={selectedDate ? `${selectedDate} ${selectedTime}` : ""}
            onPress={() => setDateTimePickerVisible(true)}
            editable={false}
          >
            <TextInput
              style={tw`text-black font-bold text-base`}
              placeholder="Choisissez une date et une heure"
              value={selectedDate ? `${selectedDate} ${selectedTime}` : ""}
              onFocus={showDateTimePicker}
              editable={false}
            />
          </TouchableOpacity>
        </View>
      </View>

      <RefuelDateTimePickerModal
        isVisible={isDateTimePickerVisible}
        onClose={() => setDateTimePickerVisible(false)}
        onConfirm={handleDateTimeConfirm}
      />

      {/* Validation du paiement */}
      <View style={tw`mb-4 mt-3 flex items-center`}>
        <Text style={tw`text-lg font-semibold`}>
          Prix total : {calculateTotalPrice()} €
        </Text>
        <TouchableOpacity
          onPress={openPaymentSheet}
          style={tw`bg-[#34469C] p-4 rounded-md w-5/6 items-center`}
        >
          <Text style={tw`text-white font-semibold text-base`}>
            Payer maintenant
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Interface utilisateur principale avec gestion des étapes
  return (
    <SafeAreaView style={tw`flex-1`}>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Affichage du logo et des étapes */}
        <View style={tw`flex-row justify-center my-4`}>
          {[1, 2, 3, 4].map((step) => (
            <View key={step} style={tw`flex-row items-center`}>
              <View
                style={tw`w-8 h-8 rounded-full ${
                  currentStep === step ? 'bg-blue-900' : 'bg-gray-300'
                } flex items-center justify-center`}
              >
                <Text style={tw`text-white font-bold`}>{step}</Text>
              </View>
              {step < 4 && (
                <View
                  style={tw`w-8 h-1 ${currentStep > step ? 'bg-blue-900' : 'bg-gray-300'}`}
                />
              )}
            </View>
          ))}
        </View>

        <ScrollView contentContainerStyle={tw`flex-grow p-4`}>
          {/* Affichage des étapes en fonction de la progression */}
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
        </ScrollView>

        {/* Boutons de navigation entre les étapes */}
        <View style={tw`flex-row justify-between p-4 bg-white`}>
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={handlePreviousStep}
              style={tw`bg-gray-400 px-5 py-3 rounded-full`}
            >
              <Text style={tw`text-white`}>Précédent</Text>
            </TouchableOpacity>
          )}
          {currentStep < 4 && (
            <TouchableOpacity
              onPress={handleNextStep}
              style={tw`bg-blue-900 px-5 py-3 rounded-full`}
            >
              <Text style={tw`text-white`}>Suivant</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RefuelForm;
