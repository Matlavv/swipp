import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import tw from "twrnc";
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";
import ChooseGarageModal from "./ChooseGarageModal";
import DateTimePickerModal from "./DateTimePickerModal";

const MaintenanceForm = ({ navigation }) => {
  const [selectedMaintenance, setSelectedMaintenance] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedGarage, setSelectedGarage] = useState({});
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [isGarageModalVisible, setGarageModalVisible] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  // Options pour l'entretien
  const maintenanceOptions = [
    { id: "plaquette", value: "Changements des plaquettes" },
    { id: "filtre", value: "Remplacement des filtres" },
    { id: "huile", value: "Changement d'huile" },
    { id: "pneu", value: "Changement de pneus" },
    { id: "batterie", value: "Changement de batterie" },
  ];

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
            value: `${doc.data().label} - ${doc.data().immatriculation}`,
          }));
          setVehicles(userVehicles);
        } catch (error) {
          console.error("Erreur lors du chargement des véhicules", error);
        }
      }
    };
    loadVehicles();
  }, []);

  const handleDateTimeConfirm = (dateTime) => {
    setSelectedDateTime(dateTime);
    setDateTimePickerVisible(false);
  };

  const handleSelectGarage = (garage) => {
    setSelectedGarage(garage);
    setGarageModalVisible(false);
  };

  const handleReservationConfirm = async () => {
    if (
      !selectedMaintenance ||
      !selectedVehicleId ||
      !selectedGarage ||
      !selectedDateTime
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs requis.");
      return;
    }
    const userId = auth.currentUser.uid;
    const bookingDate = new Date(selectedDateTime);
    const reparationType = "Entretien";

    try {
      const reservation = {
        userId,
        vehicleId: selectedVehicleId,
        garageId: selectedGarage,
        bookingDate: bookingDate,
        createdAt: new Date(),
        reparationType: reparationType,
        reparationDetail: selectedMaintenance,
        isActive: true,
      };
      await addDoc(collection(db, "RepairBookings"), reservation);
      Alert.alert(
        "Succès",
        "Votre rendez-vous pour l'entretien a été enregistré avec succès."
      );
      navigation.goBack();
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

        {/* Choose Maintenance */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-4`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Sélectionnez votre besoin
          </Text>
          <SelectList
            setSelected={setSelectedMaintenance}
            data={maintenanceOptions}
            placeholder="Sélectionnez votre besoin"
            boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
          />
        </View>

        {/* Choose vehicle */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-4`}>
          <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
          <SelectList
            setSelected={setSelectedVehicleId}
            data={vehicles}
            placeholder="Sélectionnez le véhicule"
            boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
          />
        </View>

        {/* Choose Garage */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-4`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Choisissez votre garage
          </Text>
          <TouchableOpacity
            onPress={() => setGarageModalVisible(true)}
            style={tw`border-b-2 border-[#34469C] py-2`}
          >
            <Text style={tw`text-black font-bold text-base`}>
              {selectedGarage.name || "Sélectionnez un garage"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Choose Date */}
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

        {/* Modal Components for Garage and Date selection */}
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

        {/* Submit button */}
        <View style={tw`mb-4 mt-5 flex items-center`}>
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

export default MaintenanceForm;
