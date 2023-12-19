import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import tw from 'twrnc';
import { auth } from '../../firebaseConfig'; // Assurez-vous que le chemin est correct
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = ({ onSignUpPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Connexion reussie");
      // Connexion réussie
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={tw`p-4`}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={tw`border p-2 rounded mb-2`}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={tw`border p-2 rounded mb-2`}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={tw`mt-4 text-center`} onPress={onSignUpPress}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

export default LoginForm;
