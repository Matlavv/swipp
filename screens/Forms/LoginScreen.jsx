import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
import { auth } from "../../firebaseConfig";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (email.length === 0 || !email.includes("@")) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return false;
    }
    if (password.length === 0) {
      Alert.alert("Erreur", "Veuillez entrer un mot de passe.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("UserScreen");
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        Alert.alert(
          "Identifiants incorrects",
          "Email ou mot de passe incorrect."
        );
      } else {
        Alert.alert("Erreur", error.message);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (email.length === 0 || !email.includes("@")) {
      Alert.alert(
        "Erreur",
        "Veuillez fournir une adresse email valide pour réinitialiser votre mot de passe."
      );
    } else {
      try {
        await sendPasswordResetEmail(auth, email);
        Alert.alert(
          "Réinitialisation du mot de passe",
          "Un email de réinitialisation de mot de passe a été envoyé. Veuillez vérifier votre boîte de réception."
        );
      } catch (error) {
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de la réinitialisation du mot de passe."
        );
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
        <Text style={tw`text-xl font-bold m-5 mt-10`}>
          Connectez-vous à votre compte
        </Text>
        <View style={tw`p-4 flex-1 justify-center items-center mt-10`}>
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Mot de passe"
            autoCapitalize="none"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={handleLogin}
            style={tw`bg-[#34469C] px-5 py-3 rounded-full flex mt-7 shadow-2xl`}
          >
            <Text style={tw`text-white text-base`}>Connexion</Text>
          </TouchableOpacity>
          <View style={tw`flex-row justify-center items-center mt-8`}>
            <Text style={tw`text-black font-semibold text-sm`}>
              Pas de compte ?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <Text style={tw`text-blue-500 ml-2 font-bold text-sm`}>
                S'inscrire
              </Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex justify-center items-center mt-8`}>
            <TouchableOpacity onPress={handlePasswordReset} style={tw`mt-5`}>
              <Text style={tw`text-blue-500 text-center font-bold text-sm`}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
