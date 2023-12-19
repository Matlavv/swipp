import { View, Text } from 'react-native'
import React from 'react'
import RefuelForm from '../components/Services/RefuelForm'
import tw from 'twrnc';


const EmergencyScreen = () => {
  return (
    <View style={tw`mt-10`}>
      <RefuelForm />
    </View>
  )
}

export default EmergencyScreen