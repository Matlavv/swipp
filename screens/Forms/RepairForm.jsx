import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
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
import { SelectList } from "react-native-dropdown-select-list";
import tw from "twrnc";
import { swippLogo } from "../../assets";
import ChooseGarageModal from "../../components/Modal/ChooseGarageModal";
import { auth, db } from "../../firebaseConfig";

const RepairForm = ({ route, navigation }) => {
  const [selectedValue, setSelectedValue] = useState("Réparation du moteur");
  const [address, setAddress] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState({
    id: "",
    immatriculationPlate: "",
  });
  const [isGarageModalVisible, setGarageModalVisible] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);

  const repairOptions = [
    { id: "moteur", value: "Réparation du moteur", price: 100 },
    { id: "transmission", value: "Réparation de la transmission", price: 200 },
    { id: "direction", value: "Réparation de la direction", price: 150 },
    { id: "carrosserie", value: "Réparation de la carrosserie", price: 250 },
    {
      id: "echappement",
      value: "Réparation du système d'échappement",
      price: 180,
    },
  ];

  useEffect(() => {
    if (route.params?.address) {
      setAddress(route.params.address);
    }
  }, [route.params?.address]);

  const handleSelectGarage = (garage) => {
    setSelectedGarage(garage);
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

  const navigateToChooseRepairDate = () => {
    if (!selectedValue || !selectedVehicleId.id || !selectedGarage) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    navigation.navigate("ChooseRepairDate", {
      selectedValue,
      selectedVehicleId,
      selectedGarage,
      selectedPrice,
    });
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
          <View style={tw`rounded-md`}>
            <SelectList
              setSelected={(itemValue) => {
                const selectedOption = repairOptions.find(
                  (option) => option.id === itemValue
                );
                if (selectedOption) {
                  setSelectedValue(selectedOption.value);
                  setSelectedPrice(selectedOption.price);
                }
              }}
              data={repairOptions.map((option) => ({
                key: option.id,
                value: `${option.value} - ${option.price}€`,
              }))}
              placeholder="Sélectionnez votre besoin"
              boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
            />
          </View>
        </View>
        {/* Choose vehicle */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
          <View style={tw`rounded-md`}>
            <SelectList
              setSelected={(itemValue) => {
                const selectedVehicle = vehicles.find(
                  (vehicle) => vehicle.id === itemValue
                );
                if (selectedVehicle) {
                  setSelectedVehicleId({
                    id: selectedVehicle.id,
                    immatriculationPlate: selectedVehicle.immatriculation,
                  });
                } else {
                  console.error("Selected vehicle not found");
                  Alert.alert(
                    "Error",
                    "The selected vehicle was not found in the list."
                  );
                }
              }}
              data={vehicles.map((vehicle) => ({
                key: vehicle.id, // Use vehicle.id as the key for selection
                value: `${vehicle.label} - ${vehicle.immatriculation}`, // Display format
              }))}
              placeholder="Indiquez le véhicule"
              boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
            />
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
        <View style={tw`mb-4 mt-3 flex items-center`}>
          <Text style={tw`font-bold text-lg`}>Prix : {selectedPrice}</Text>
          <TouchableOpacity
            onPress={navigateToChooseRepairDate}
            style={tw`bg-[#34469C] p-4 rounded-md w-5/6 items-center mt-3`}
          >
            <Text style={tw`text-white font-semibold text-base`}>
              Choisir une date
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RepairForm;
