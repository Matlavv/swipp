import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import tw from 'twrnc';
import { auth } from '../../firebaseConfig'; // Assurez-vous que le chemin est correct
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpForm = ({ onSignInPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Stocker les informations supplémentaires dans Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username, // Assurez-vous que vous avez une entrée pour le nom d'utilisateur dans votre formulaire
      });
      // Suite du processus d'inscription
    } catch (error) {
      // Gestion des erreurs
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
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        secureTextEntry
        style={tw`border p-2 rounded mb-2`}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text style={tw`mt-4 text-center`} onPress={onSignInPress}>
        Already have an account? Sign In
      </Text>
    </View>
  );
};

export default SignUpForm;
