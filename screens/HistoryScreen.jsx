import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { gas, services, swippLogo } from "../assets/index";
import RefuelIncomingReservation from "../components/History/RefuelIncomingReservation";
import RefuelPastReservation from "../components/History/RefuelPastReservation";
import RepairIncomingReservation from "../components/History/RepairIncomingReservation";
import RepairPastReservation from "../components/History/RepairPastReservation";

const Tab = createMaterialTopTabNavigator();

const HistoryScreen = () => {
  const [selected, setSelected] = useState("services");

  const getComponent = (type) => {
    if (selected === "services") {
      return type === "Passées"
        ? RepairPastReservation
        : RepairIncomingReservation;
    } else if (selected === "gas") {
      return type === "Passées"
        ? RefuelPastReservation
        : RefuelIncomingReservation;
    }
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
        {/* Logo */}
        <View style={tw`flex p-5 mt-5 justify-start items-start flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} />
        </View>
        <Text style={tw`text-2xl font-bold m-5`}>
          Historique de vos réservations
        </Text>
        {/* Category Selection */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 my-3`}>
          <Text style={tw`text-xl font-bold mb-5`}>
            Selectionnez une catégorie
          </Text>
          <View style={tw`flex-row justify-around items-center`}>
            {/* Our Services Button */}
            <TouchableOpacity
              onPress={() => setSelected("services")}
              style={[
                tw`w-42 h-40 justify-center items-center rounded-xl bg-white shadow-xl`,
                {
                  borderColor: selected === "services" ? "#34469C" : "#FFFFFF",
                  borderWidth: selected === "services" ? 4 : 0,
                },
              ]}
            >
              <Image
                source={services}
                resizeMode="contain"
                style={tw`w-20 h-20`}
              />
              <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
                Réparations
              </Text>
            </TouchableOpacity>

            {/* Refuel Now Button */}
            <TouchableOpacity
              onPress={() => setSelected("gas")}
              style={[
                tw`w-42 h-40 justify-center items-center rounded-xl bg-white shadow-xl`,
                {
                  borderColor: selected === "gas" ? "#34469C" : "#FFFFFF",
                  borderWidth: selected === "gas" ? 4 : 0,
                },
              ]}
            >
              <Image source={gas} resizeMode="contain" style={tw`w-20 h-20`} />
              <Text style={tw`text-lg font-bold text-[#34469C] mt-5`}>
                Carburant
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#34469C",
            tabBarInactiveTintColor: "grey",
            tabBarStyle: { backgroundColor: "#F5F5F5" },
            tabBarIndicatorStyle: { backgroundColor: "#34469C", height: 4 },
            tabBarLabelStyle: { fontSize: 18, fontWeight: "bold" },
          }}
          style={tw`pt-3 w-full`}
        >
          <Tab.Screen
            name="Passées"
            component={
              selected ? getComponent("Passées") : RefuelPastReservation
            }
          />
          <Tab.Screen
            name="A venir"
            component={
              selected ? getComponent("A venir") : RefuelIncomingReservation
            }
          />
        </Tab.Navigator>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
