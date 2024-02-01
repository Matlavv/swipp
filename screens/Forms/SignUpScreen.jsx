import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const validateInputs = () => {
    if (email.length === 0 || !email.includes("@")) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return false;
    }
    if (username.length === 0) {
      Alert.alert("Erreur", "Veuillez entrer un nom d'utilisateur.");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return; // Valider les entrées avant de continuer

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: Timestamp.now(),
      });
      navigation.navigate("LoginScreen");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Inscription impossible", "Erreur lors de l'inscription");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Email invalide", "L'adresse email est invalide.");
      } else {
        Alert.alert("Erreur", error.message);
      }
    }
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
        {/* Logo */}
        <View style={tw`p-5 mt-5 items-center justify-center flex-row`}>
          <Image style={tw`w-60 h-30`} source={swippLogo} />
        </View>
        <Text style={tw`text-xl font-bold m-5 mt-10`}>Créez votre compte</Text>
        <View style={tw`flex-1 justify-center items-center mt-10`}>
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity
            onPress={handleSignUp}
            style={tw`bg-[#34469C] px-5 py-3 rounded-full flex mt-7 shadow-2xl`}
          >
            <Text style={tw`text-white text-base`}>S'inscrire</Text>
          </TouchableOpacity>
          <View style={tw`flex-row justify-center items-center mt-8`}>
            <Text style={tw`text-black font-semibold text-sm`}>
              Vous avez deja un compte ?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={tw`text-blue-500 ml-2 font-bold text-sm`}>
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
