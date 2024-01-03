import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import tw from 'twrnc';
import Checkbox from 'expo-checkbox';

const RepairForm = () => {
 const [checked, setChecked] = useState({
  windshield: false,
  garage: false,
  tire: false,
  bodywork: false,
  ecoProper: false,
 });

 const handleCheck = (choice) => {
  setChecked({ ...checked, [choice]: !checked[choice] });
 };

 const handleNext = () => {
  // Logic for handling next button press
  console.log('Next button pressed');
 };

 return (
  <View style={tw`p-4`}>
    {/* Windshield */}
    <View style={tw`mb-4`}>
      <Text style={tw`text-lg font-bold`}>Pare-brise</Text>
      <Checkbox
        value={checked.windshield}
        onValueChange={() => handleCheck('windshield')}
      />
    </View>

    {/* Other choices... */}

    {/* Next Button */}
    <View style={tw`mb-4 flex items-center`}>
      <Button
        onPress={handleNext}
        title="Suivant"
      />
    </View>
  </View>
 );
};

export default RepairForm;
