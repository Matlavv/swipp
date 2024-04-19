import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const validateInputs = () => {
    if (email.length === 0 || !email.includes("@")) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères, incluant au moins un chiffre et une majuscule."
      );
      return false;
    }
    if (username.length === 0) {
      Alert.alert("Erreur", "Veuillez entrer un nom d'utilisateur.");
      return false;
    }
    if (firstName.length === 0) {
      Alert.alert("Erreur", "Veuillez entrer votre prénom.");
      return false;
    }
    if (lastName.length === 0) {
      Alert.alert("Erreur", "Veuillez entrer votre nom.");
      return false;
    }
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/; // Adjust regex as needed for your format
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Erreur", "Veuillez entrer un numéro de téléphone valide.");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);

      const defaultProfileImgUrl =
        "https://firebasestorage.googleapis.com/v0/b/swipp-b74be.appspot.com/o/profileImages%2FprofilePic.png?alt=media&token=34edfdcb-9114-45a4-b84f-bd9a22f92c57";

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        firstName,
        lastName,
        phoneNumber,
        createdAt: Timestamp.now(),
        profileImageUrl: defaultProfileImgUrl,
        role: "user",
      });

      navigation.navigate("LoginScreen");
      Alert.alert(
        "Vérification de l'email",
        "Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception."
      );
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
            placeholder="Mot de passe"
            autoCapitalize="none"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Prénom"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Nom"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Numéro de téléphone"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
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
