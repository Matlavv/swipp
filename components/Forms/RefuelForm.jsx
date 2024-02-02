import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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
import Geocoder from "react-native-geocoding";
import tw from "twrnc";
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";
import DateTimePickerModal from "./DateTimePickerModal";

Geocoder.init("AIzaSyC7G4Z0E2levTb0mVYJOX_1bNgSVMvlK-Y");

const RefuelForm = ({ route, navigation }) => {
  const [selectedValue, setSelectedValue] = useState("SP98");
  const [volume, setVolume] = useState("");
  const [address, setAddress] = useState("");
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [price, setPrice] = useState(0);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  useEffect(() => {
    if (route.params?.address) {
      setAddress(route.params.address);
    }
  }, [route.params?.address]);

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

    const totalPrice = parseFloat(price) * parseFloat(volume);
    const userId = auth.currentUser.uid;

    // Formatage correct de la date et l'heure
    const bookingDate = new Date(selectedDateTime);
    const formattedTime =
      bookingDate.getHours() + ":" + bookingDate.getMinutes();

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
    };

    try {
      await addDoc(collection(db, "RefuelBookings"), reservation);
      Alert.alert("Succès", "Votre réservation a été enregistrée.");
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
            <TextInput
              style={tw`border-b-2 border-[#34469C] font-bold text-base`}
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity onPress={handleLocatePress}>
              <Text style={tw`text-blue-900 m-2 font-semibold`}>
                Me géolocaliser
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Choose carburant */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 my-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Selectionnez votre carburant
          </Text>
          <View style={tw`bg-white rounded-md`}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
              style={tw``}
            >
              <Picker.Item color="#34469C" label="SP98" value="SP98" />
              <Picker.Item color="#34469C" label="SP95" value="SP95" />
              <Picker.Item color="#34469C" label="Gasoil" value="Gasoil" />
              <Picker.Item color="#34469C" label="E85" value="E85" />
            </Picker>
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
        {/* Choose vehicle */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
          <View style={tw`bg-white rounded-md`}>
            <Picker
              selectedValue={selectedVehicleId}
              onValueChange={(itemValue) => setSelectedVehicleId(itemValue)}
              style={tw``}
            >
              {vehicles.map((vehicle) => (
                <Picker.Item
                  key={vehicle.id}
                  label={vehicle.label}
                  value={vehicle.id}
                  color="#34469C"
                />
              ))}
            </Picker>
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
