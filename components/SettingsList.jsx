import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const SettingsList = () => {
  return (
    <SafeAreaView style={tw`flex justify-start`}>
        <ScrollView style={tw``}>
            <View style={tw`flex flex-row ml-4`}>
                <Ionicons 
                    style={tw`ml-9`}
                    name="apps"
                    size={20}
                />
                <Text style={tw`ml-4`}>Username</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default SettingsList;
