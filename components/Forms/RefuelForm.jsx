import { Ionicons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import * as Location from "expo-location";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import Geocoder from "react-native-geocoding";
import tw from "twrnc";
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";
import ChooseRefuelerModal from "./ChooseRefuelerModal";
import RefuelDateTimePickerModal from "./RefuelDateTimePickerModal";

Geocoder.init("YOUR_GOOGLE_API_KEY");

const RefuelForm = ({ route, navigation }) => {
  const [selectedFuel, setSelectedFuel] = useState("SP98");
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
  const [carBrand, setCarBrand] = useState(""); // Nouvelle état pour la marque de la voiture
  const [carModel, setCarModel] = useState(""); // Nouvelle état pour le modèle de la voiture
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Nouvelle état pour le véhicule
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isRefuelerModalVisible, setRefuelerModalVisible] = useState(false);
  const [selectedRefueler, setSelectedRefueler] = useState(null);

  const data = [
    { key: "1", value: "adblue" },
    { key: "2", value: "lave vitre" },
    { key: "3", value: "gonflage de pneus" },
    { key: "4", value: "liquide de refroidissement" },
  ];

  useEffect(() => {
    if (route.params?.address) {
      setAddress(route.params.address);
    }
  }, [route.params?.address]);

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

  const handleSelectRefueler = (refueler) => {
    setSelectedRefueler(refueler);
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
          amount: calculateTotalPrice() * 100, // Convertir en centimes pour Stripe
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
    loadAddresses();
  }, []);

  const handleLocatePress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    Geocoder.from(location.coords.latitude, location.coords.longitude)
      .then((json) => {
        const addressComponent = json.results[0].formatted_address;
        setAddress(addressComponent);
      })
      .catch((error) => console.warn(error));
  };

  // Charger les véhicules
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
    loadVehicles();
  }, []);

  const handleDateTimeConfirm = (dateTimeObj) => {
    setSelectedDate(dateTimeObj.date);
    setSelectedTime(dateTimeObj.timeSlot);
    setDateTimePickerVisible(false);
  };

  const showDateTimePicker = () => {
    setDateTimePickerVisible(true);
  };

  const calculateTotalPrice = () => {
    const totalPrice = parseFloat(volume) * price;
    return totalPrice.toFixed(2);
  };

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
          setCarBrand(vehicleData.marque);
          setCarModel(vehicleData.modele);
          setSelectedVehicle(vehicleData); // Enregistre les informations du véhicule
          const parts = vehicleId.split("-");
          const lastPart = parts[parts.length - 1].trim();
          setSelectedFuel(lastPart); // Utiliser la partie après le dernier "-" comme carburant sélectionné
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations du véhicule",
          error
        );
      }
    }
  };

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

      // Enregistrer l'achat dans Firestore pour déclencher la création de la facture
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

  useEffect(() => {
    calculatePrice(selectedFuel, address);
  }, [selectedFuel, address]);

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
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
          <Text style={tw`text-2xl font-bold m-5`}>
            Réservez votre carburant
          </Text>
        </View>
        {/* Location */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Indiquez le point de rendez-vous
          </Text>
          <View style={tw`rounded-md`}>
            {/* Text input pour saisir l'adresse */}
            <TextInput
              style={tw`border-b-2 mb-4 border-[#34469C] font-bold text-base`}
              value={address}
              onChangeText={setAddress}
            />
            <Text style={tw`text-lg font-semibold mb-2`}>Mes adresses</Text>
            <SelectList
              setSelected={(val) => setAddress(val)}
              placeholder="Adresse"
              boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
              data={addresses.map((address) => ({
                value: `${address.adresse} - ${address.codePostal} - ${address.ville}`, // Ajoute l'adresse et le code postal
                id: address.id, // Ajoute l'identifiant de l'adresse comme une autre variable
              }))}
              onSelect={() => setAddress(address)}
              save="value"
            />
            {/* Bouton pour se géolocaliser */}
            <Text style={tw`text-lg font-semibold mb-2`}>Ou</Text>
            <TouchableOpacity
              onPress={handleLocatePress}
              style={tw`bg-blue-900 py-2 px-4 rounded-lg justify-center items-center`}
            >
              <Text style={tw`text-white font-semibold`}>Me géolocaliser</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Choose vehicle */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
          <View style={tw`rounded-md`}>
            <SelectList
              data={vehicles.map((vehicle) => ({
                id: vehicle.id,
                value: `${vehicle.label} - ${vehicle.immatriculation} - ${vehicle.carburant}`, // Utiliser l'ID du véhicule comme valeur
              }))}
              setSelected={handleSelectVehicle}
              placeholder="Véhicule"
              boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
            />
          </View>
        </View>
        {/* Choose litter */}
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
          <Text style={tw`text-lg font-semibold mt-4`}>
            Prix: {price.toFixed(2)}€
          </Text>
        </View>
        {/* Choose Refueler */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Choisissez votre refueler
          </Text>
          <View style={tw`rounded-md`}>
            <TouchableOpacity
              onPress={() => setRefuelerModalVisible(true)}
              style={tw`border-b-2 border-[#34469C] font-bold text-base`}
              value={selectedRefueler}
              editable={false}
            >
              <TextInput
                style={tw`text-black font-bold text-base`}
                placeholder="Sélectionnez un refueler"
                value={selectedRefueler ? selectedRefueler.firstName : ""}
                editable={false}
              />
            </TouchableOpacity>

            <ChooseRefuelerModal
              isVisible={isRefuelerModalVisible}
              onClose={() => setRefuelerModalVisible(false)}
              onSelectRefueler={handleSelectRefueler}
            />
          </View>
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default RefuelForm;
