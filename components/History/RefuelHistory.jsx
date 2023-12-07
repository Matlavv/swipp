import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import RefuelActiveReservation from './RefuelActiveReservation';
import RefuelPastReservation from './RefuelPastReservation';


const RefuelHistory = () => {
  return (
    <ScrollView>
      <View>
        <Text style={tw`text-4xl font-bold m-5`}>Activité</Text>
      </View>
      <View>
        <Text style={tw`text-xl font-semibold m-2`}>A venir</Text>
      </View>
      {/* Coming reservation component */}
      <RefuelActiveReservation />
      <View>
        <Text style={tw`text-xl font-semibold m-2 mt-4`}>Passées</Text>
      </View>
      {/* Past reservation component */}
      <RefuelPastReservation />
    </ScrollView>
  )
}

export default RefuelHistory;