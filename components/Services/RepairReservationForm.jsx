import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import RepairForm from './RepairForm';

const RepairReservationForm = () => {
  return (
    <ScrollView>
      <View>
        <Text style={tw`text-4xl font-bold m-5`}>Réparation</Text>
      </View>
      <View>
        <Text style={tw`text-xl font-semibold m-2`}>Je choisi ma réparation</Text>
      </View>
      <RepairForm />
    </ScrollView>
  );
};

export default RepairReservationForm;