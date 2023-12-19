import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import tw from 'twrnc';
import { auth } from '../../firebaseConfig';

const LoginForm = ({ onSignUpPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Connexion réussie
    } catch (error) {
      console.error(error);
      // Gérer les erreurs ici
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
      <Text style={tw`mt-4 text-center`} onPress={onSignUpPress}>Don't have an account? Sign Up</Text>
    </View>
  );
};

export default LoginForm;
