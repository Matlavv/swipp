import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import tw from 'twrnc';


const EmergencyScreen = () => {
  return (
    <SafeAreaView>
      <View style={tw`mt-10`}>
        <Text>Emergency Screen</Text>
      </View>
    </SafeAreaView>
  )
}

export default EmergencyScreen