// SignUpScreen.jsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const validateInputs = () => {
    if (email.length === 0 || !email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }
    if (username.length === 0) {
      Alert.alert('Erreur', 'Veuillez entrer un nom d\'utilisateur.');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return; // Valider les entrées avant de continuer
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), { username });
      navigation.navigate('LoginScreen');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Inscription impossible', 'Erreur lors de l\'inscription');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Email invalide', 'L\'adresse email est invalide.');
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
      <TextInput
        style={tw`border w-80 p-2 mb-4`}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="S'inscrire" onPress={handleSignUp} />
      {/* Lien vers l'écran de connexion */}
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={tw`text-blue-500 mt-4`}>Vous avez déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
