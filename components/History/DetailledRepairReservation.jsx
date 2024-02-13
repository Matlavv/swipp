import React from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";
import { swippLogo } from "../../assets";

const DetailledRepairReservation = () => {
  return (
    <SafeAreaView style={tw`flex h-full`}>
      {/* Logo */}
      <View style={tw`flex p-5 mt-5 justify-start items-start flex-row`}>
        <Image style={tw`w-25 h-15`} source={swippLogo} />
      </View>
      <Text style={tw`text-2xl font-bold m-2 ml-5`}>
        A propos de votre réservation
      </Text>
    </SafeAreaView>
  );
};

export default DetailledRepairReservation;
