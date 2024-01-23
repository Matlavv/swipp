import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { carRefuel, swippLogo } from "../assets";
import ServicesButtonList from "../components/Services/ServicesButtonList";

const ServiceScreen = () => {
  const navigation = useNavigation();

  const navigateToRefuelForm = () => {
    navigation.navigate("RefuelForm");
  };
  const navigateToMaintenanceForm = () => {
    navigation.navigate("MaintenanceForm");
  };

  const navigateToEmergencyScreen = () => {
    navigation.navigate("EmergencyScreen");
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
        {/* Logo */}
        <View style={tw`flex p-5 mt-3 justify-start items-start flex flex-row`}>
          <Image style={tw`w-35 h-20`} source={swippLogo} />
          <Text style={tw`text-2xl font-bold m-9`}>Bonjour, Mathis !</Text>
        </View>
        {/* Refuel button */}
        <View style={tw`flex justify-center items-center`}>
          <TouchableOpacity
            style={tw`flex-row justify-start items-center w-5/6 h-33 mt-4 bg-white border-2 border-blue-500 rounded-lg`}
            onPress={navigateToRefuelForm}
          >
            <View style={tw`ml-4`}>
              <Text style={tw`text-xl font-bold justify-start mb-2`}>
                Energies
              </Text>
              <Text style={tw`text-gray-500 w-50 text-sm font-semibold`}>
                Faites vous livrer votre carburant où vous le souhaitez
              </Text>
            </View>
            <Image style={tw`w-25 h-25 ml-3`} source={carRefuel} />
          </TouchableOpacity>
        </View>
        <Text style={tw`font-bold text-xl m-3 mt-5`}>
          Découvrez nos autres services
        </Text>
        {/* Two buttons */}
        <View style={tw`flex flex-row justify-center`}>
          {/* first button */}
          <LinearGradient
            colors={["#9bafd9", "#103783"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`m-3 rounded-lg justify-center items-center`}
          >
            <TouchableOpacity
              style={tw`p-10 pl-6 pb-6 pt-3 m-2 justify-center items-center`}
              onPress={navigateToMaintenanceForm}
            >
              <View>
                <Icon
                  style={tw`ml-5`}
                  name="local-car-wash"
                  size={40}
                  color="#fff"
                />
                <Text style={tw`mt-3 ml-2 pt-1 text-lg font-bold text-white`}>
                  Entretiens
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          {/* second button */}
          <LinearGradient
            colors={["#103783", "#9bafd9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`m-3 rounded-lg justify-center items-center`}
          >
            <TouchableOpacity
              style={tw`p-10 pl-6 pb-6 pt-3 m-2`}
              onPress={navigateToEmergencyScreen}
            >
              <View>
                <Icon name="warning" style={tw`ml-5`} size={40} color="#fff" />
                <Text style={tw`ml-2 mt-3 pt-1 text-lg font-bold text-white`}>
                  Urgences
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View>
          <ServicesButtonList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceScreen;
