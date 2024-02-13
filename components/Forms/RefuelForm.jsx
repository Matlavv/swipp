import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { addDoc, collection, getDocs } from "firebase/firestore";
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
import DateTimePickerModal from "./DateTimePickerModal";

Geocoder.init("AIzaSyC7G4Z0E2levTb0mVYJOX_1bNgSVMvlK-Y");

const RefuelForm = ({ route, navigation }) => {
  const [selectedValue, setSelectedValue] = useState("SP98");
  const [volume, setVolume] = useState("");
  const [options, setOptions] = useState([]);
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [price, setPrice] = useState(0);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const data = [
    { key: "1", value: "adblue" },
    { key: "2", value: "lave vitre" },
    { key: "3", value: "gonflage de pneus" },
    { key: "4", value: "liquide de refroidissement" },
  ];

  const fuelOptions = [
    { id: "SP98", value: "SP98" },
    { id: "SP95", value: "SP95" },
    { id: "Gasoil", value: "Gasoil" },
    { id: "E85", value: "E85" },
  ];

  useEffect(() => {
    if (route.params?.address) {
      setAddress(route.params.address);
    }
  }, [route.params?.address]);

  const loadAddresses = async () => {
    const user = auth.currentUser;
    if (user) {
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
      }
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

  const handleDateTimeConfirm = (dateTime) => {
    setSelectedDateTime(dateTime);
    setDateTimePickerVisible(false);
  };

  const showDateTimePicker = () => {
    setDateTimePickerVisible(true);
  };

  const calculateTotalPrice = () => {
    const totalPrice = parseFloat(volume) * price;
    return totalPrice.toFixed(2);
  };

  const handleReservationConfirm = async () => {
    if (
      !selectedValue ||
      !volume ||
      !address ||
      !selectedDateTime ||
      !selectedVehicleId
    ) {
      Alert.alert(
        "Erreur",
        "Veuillez remplir tous les champs avant de confirmer la réservation."
      );
      return;
    }

    const totalPrice = calculateTotalPrice();
    const userId = auth.currentUser.uid;

    // Formatage correct de la date et l'heure
    const bookingDate = new Date(selectedDateTime);
    const formattedTime =
      bookingDate.getHours() + ":" + bookingDate.getMinutes();

    try {
      const reservation = {
        address,
        bookingDate: bookingDate,
        vehicleId: selectedVehicleId,
        createdAt: new Date(),
        fuelType: selectedValue,
        isActive: true,
        time: formattedTime,
        userId,
        volume: parseFloat(volume),
        price: totalPrice,
        options: selectedOptions,
      };

      await addDoc(collection(db, "RefuelBookings"), reservation);
      Alert.alert(
        "Succès",
        `Votre réservation a été enregistrée. Pour un total de : ${totalPrice} €`
      );
      navigation.goBack();
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
    calculatePrice(selectedValue, address);
  }, [selectedValue, address]);

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
        {/* Choose carburant */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 my-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Selectionnez votre carburant
          </Text>
          <View style={tw`rounded-md`}>
            <SelectList
              setSelected={(itemValue) => setSelectedValue(itemValue)}
              placeholder="Carburant"
              data={fuelOptions}
              boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
            />
          </View>
          {/* Afficher le prix calculé sous le choix de carburant */}
          <Text style={tw`text-lg font-semibold mt-4`}>
            Prix: {price.toFixed(2)}€
          </Text>
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
        {/* Choose vehicle */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
          <View style={tw`rounded-md`}>
            <SelectList
              setSelected={(itemValue) => setSelectedVehicleId(itemValue)}
              placeholder="Véhicule"
              data={vehicles.map((vehicle) => ({
                id: vehicle.id,
                value: `${vehicle.label} - ${vehicle.immatriculation}`,
              }))}
              boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
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
              value={selectedDateTime}
              onPress={() => setDateTimePickerVisible(true)}
              editable={false}
            >
              <TextInput
                style={tw`text-black font-bold text-base`}
                placeholder="Choisissez une date et une heure"
                value={selectedDateTime}
                onFocus={showDateTimePicker}
                editable={false}
              />
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isDateTimePickerVisible}
          onClose={() => setDateTimePickerVisible(false)}
          onConfirm={handleDateTimeConfirm}
        />

        <View style={tw`mb-4 mt-3 flex items-center`}>
          <Text style={tw`text-lg font-semibold`}>
            Prix total : {calculateTotalPrice()} €
          </Text>
          <TouchableOpacity
            onPress={handleReservationConfirm}
            style={tw`bg-[#34469C] p-4 rounded-md w-5/6 items-center`}
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

export default RefuelForm;
