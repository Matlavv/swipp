import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import RefuelForm from './RefuelForm';

const RefuelReservationForm = () => {
  return (
    <ScrollView>
      <View>
        <Text style={tw`text-4xl font-bold m-5`}>Refuel</Text>
      </View>
      <View style={tw`bg-gray-950 h-0.3 m-4`} />

      <View>
        <Text style={tw`text-xl font-semibold m-2`}>Je choisi mon carburant</Text>
      </View>
      <RefuelForm />
    </ScrollView>
  );
};

export default RefuelReservationForm;