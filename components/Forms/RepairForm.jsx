import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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
import tw from "twrnc";
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";
import ChooseGarageModal from "./ChooseGarageModal";
import DateTimePickerModal from "./DateTimePickerModal";

const RepairForm = ({ route, navigation }) => {
  const [selectedValue, setSelectedValue] = useState("Réparation du moteur");
  const [address, setAddress] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [isGarageModalVisible, setGarageModalVisible] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState("");

  useEffect(() => {
    if (route.params?.address) {
      setAddress(route.params.address);
    }
  }, [route.params?.address]);

  const handleVehicleChange = (itemValue) => {
    setSelectedVehicleId(itemValue);
  };

  const handleSelectGarage = (garage) => {
    setSelectedGarage(garage);
  };

  const handleDateTimeConfirm = (dateTime) => {
    setSelectedDateTime(dateTime);
    setDateTimePickerVisible(false);
  };

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

  const handleReservationConfirm = async () => {
    // Assurez-vous que toutes les informations nécessaires sont présentes
    if (
      !selectedValue ||
      !selectedVehicleId ||
      !selectedGarage ||
      !selectedDateTime
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs requis.");
      return;
    }

    const userId = auth.currentUser.uid;
    const bookingDate = new Date(selectedDateTime);
    const reparationType = "Réparation";

    try {
      // Création de l'objet réservation
      const reservation = {
        userId,
        vehicleId: selectedVehicleId,
        isActive: true,
        createdAt: new Date(),
        reparationType: reparationType,
        reparationDetail: selectedValue,
        bookingDate: bookingDate,
        garageId: selectedGarage.name,
      };

      // Ajout de la réservation à Firestore
      await addDoc(collection(db, "RepairsBookings"), reservation);
      Alert.alert("Succès", "Votre rendez-vous a été enregistré avec succès.");
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
          <Image style={tw`w-25 h-15`} source={swippLogo} />
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mt-5 ml-3`}
          >
            <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold m-5`}>Réparation du véhicule</Text>
        </View>
        {/* Choose reparation */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Sélectionnez votre besoin
          </Text>
          <View style={tw`bg-white rounded-md`}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
            >
              <Picker.Item
                color="#34469C"
                label="Réparation du moteur"
                value="moteur"
              />
              <Picker.Item
                color="#34469C"
                label="Réparation de la transmission"
                value="transmission"
              />
              <Picker.Item
                color="#34469C"
                label="Réparation de la direction"
                value="direction"
              />
              <Picker.Item
                color="#34469C"
                label="Réparation de la carrosserie"
                value="carrosserie"
              />
              <Picker.Item
                color="#34469C"
                label="Réparation du système d'échappement"
                value="echappement"
              />
            </Picker>
          </View>
        </View>
        {/* Choose vehicle */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
          <View style={tw`bg-white rounded-md`}>
            <Picker
              selectedValue={selectedVehicleId}
              onValueChange={(itemValue) => setSelectedVehicleId(itemValue)}
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
        {/* Choose Garage */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Choisissez votre garage
          </Text>
          <View style={tw`rounded-md`}>
            <TouchableOpacity
              onPress={() => setGarageModalVisible(true)}
              style={tw`border-b-2 border-[#34469C] font-bold text-base`}
              value={selectedGarage}
              editable={false}
            >
              <TextInput
                style={tw`text-black font-bold text-base`}
                placeholder="Sélectionnez un garage"
                value={selectedGarage.name}
                editable={false}
              />
            </TouchableOpacity>

            <ChooseGarageModal
              isVisible={isGarageModalVisible}
              onClose={() => setGarageModalVisible(false)}
              onSelectGarage={handleSelectGarage}
            />
          </View>
        </View>
        {/* Choose Date */}
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
        {/* Submit button */}
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

export default RepairForm;
