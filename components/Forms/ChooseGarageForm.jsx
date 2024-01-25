import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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
import { swippLogo } from "../../assets";
import GarageList from "./GarageList";

const ChooseGarageForm = ({ item }) => {
  const navigation = useNavigation();
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
            Choisissez votre garage
          </Text>
        </View>
        {/* Show garages */}
        <View>
          <GarageList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChooseGarageForm;
