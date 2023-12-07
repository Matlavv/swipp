import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import RepairActiveReservation from './RepairActiveReservation';
import RepairPastReservation from './RepairPastReservation';

const RepairHistory = () => {
  return (
    <ScrollView>
      <View>
        <Text style={tw`text-4xl font-bold m-5`}>Activité</Text>
      </View>
      <View>
        <Text style={tw`text-xl font-semibold m-2`}>A venir</Text>
      </View>
      {/* Coming reservation component */}
      <RepairActiveReservation />
      <View>
        <Text style={tw`text-xl font-semibold m-2 mt-4`}>Passées</Text>
      </View>
      {/* Past reservation component */}
      <RepairPastReservation />
    </ScrollView>
  )
}

export default RepairHistory;