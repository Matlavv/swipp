// ProfileScreen.jsx
import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import UserScreen from './settings/UserScreen';
import LoginScreen from './Forms/LoginScreen';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (!user) {
        navigation.navigate('LoginScreen');
      }
    });
    return unsubscribe;
  }, [navigation]);

  if (!currentUser) {
    // Rendre un écran de chargement ou null pendant que l'état d'authentification est vérifié
    return null;
  }

  // Si connecté, afficher UserScreen
  return <UserScreen />;
};

export default ProfileScreen;
