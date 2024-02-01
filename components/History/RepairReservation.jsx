import React, { Component } from "react";
import { SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";

export class RepairReservation extends Component {
  render() {
    return (
      <SafeAreaView>
        <View>
          <Text style={tw`flex font-bold text-2xl m-3`}>A venir</Text>
        </View>
        <View></View>
      </SafeAreaView>
    );
  }
}

export default RepairReservation;
