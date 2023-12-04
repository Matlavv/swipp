import { Text, View, SafeAreaView, Image } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import NavOptions from '../components/NavOptions';
import { swippLogo } from '../assets';

const HomeScreen = () => {
  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image 
        style={{
          width: 150, height: 100, resizeMode: 'contain',
        }}
          source={swippLogo}
        />
        <NavOptions />
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen