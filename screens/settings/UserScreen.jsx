import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { auth } from '../../firebaseConfig';
import LoginForm from '../../components/Settings/LoginForm';
import UserProfile from '../../components/Settings/UserProfile'; 

const UserScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Se désabonner lors du démontage
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (currentUser) {
    // L'utilisateur est connecté, afficher le profil
    return <UserProfile />;
  } else {
    // L'utilisateur n'est pas connecté, afficher le formulaire de connexion
    return <LoginForm />;
  }
};

export default UserScreen;
