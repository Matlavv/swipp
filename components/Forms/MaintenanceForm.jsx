import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
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

Geocoder.init("AIzaSyC7G4Z0E2levTb0mVYJOX_1bNgSVMvlK-Y");

const MaintenanceForm = ({ route, navigation }) => {
  const [selectedValue, setSelectedValue] = useState("SP98");
  const [volume, setVolume] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (route.params?.address) {
      setAddress(route.params.address);
    }
  }, [route.params?.address]);

  const handleSubmit = async () => {};

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
          <Text style={tw`text-2xl font-bold m-5`}>Entretien du véhicule</Text>
        </View>
        {/* Choose Maintenance */}
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
              style={tw``}
            >
              <Picker.Item
                color="#34469C"
                label="Changements des plaquettes"
                value="plaquette"
              />
              <Picker.Item
                color="#34469C"
                label="Remplacement des filtres"
                value="filtre"
              />
              <Picker.Item
                color="#34469C"
                label="Changement d'huile'"
                value="huile"
              />
              <Picker.Item
                color="#34469C"
                label="Changement de pneus"
                value="pneu"
              />
              <Picker.Item
                color="#34469C"
                label="Changement de batterie"
                value="batterie"
              />
            </Picker>
          </View>
        </View>
        {/* Choose vehicle */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
          <View style={tw`bg-white rounded-md`}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
              style={tw``}
            >
              <Picker.Item color="#34469C" label="206+" value="206+" />
              <Picker.Item color="#34469C" label="Clio" value="Clio" />
            </Picker>
          </View>
        </View>
        {/* Location */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Trouvez un garage près de chez vous
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
        {/* Submit button */}
        <View style={tw`mb-4 mt-3 flex items-center`}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={tw`bg-[#34469C] p-4 rounded-md w-5/6 items-center`}
          >
            <Text style={tw`text-white font-semibold text-base`}>
              Choisir mon garage
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MaintenanceForm;
