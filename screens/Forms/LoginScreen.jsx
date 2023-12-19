import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateInputs = () => {
    if (email.length === 0 || !email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
      return false;
    }
    if (password.length === 0) {
      Alert.alert('Erreur', 'Veuillez entrer un mot de passe.');
      return false;
    }
    return true;
  };
  

  const handleLogin = async () => {
    if (!validateInputs()) return; 
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('UserScreen');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert('Identifiants incorrects', 'Email ou mot de passe incorrect.');
      } else {
        Alert.alert('Erreur', error.message);
      }
    }
  };
  

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <TextInput
        style={tw`border w-80 p-2 mb-4`}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={tw`border w-80 p-2 mb-4`}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Connexion" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
        <Text style={tw`text-blue-500 mt-4`}>Pas de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
