import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Hooks pour gérer la navigation et les effets liés au focus de l'écran
import { onAuthStateChanged } from "firebase/auth"; // Surveille les changements d'état de connexion de l'utilisateur
import { collection, getDocs, query, where } from "firebase/firestore"; // Permet d'interagir avec Firestore pour les requêtes
import React, { useCallback, useEffect, useState } from "react"; // Importation des hooks React
import {
  FlatList, // Composant pour afficher une liste défilante
  SafeAreaView, // Gère les marges liées aux zones sûres de l'appareil (Safe Area)
  Text, // Pour afficher du texte
  TouchableOpacity, // Élément cliquable
  View, // Conteneur de vue
} from "react-native";
import tw from "twrnc"; // Utilisation de Tailwind CSS pour les styles
import { auth, db } from "../../firebaseConfig"; // Importation de l'authentification Firebase et de la configuration Firestore
import NoHistory from "./NoHistory"; // Composant affichant un message en cas d'absence de réservations

// Composant pour afficher les réservations de carburant passées
const RefuelPastReservation = () => {
  const [reservations, setReservations] = useState([]); // État pour stocker les réservations
  const navigation = useNavigation(); // Permet de naviguer entre les écrans

  // Fonction pour naviguer vers l'écran de détail d'une réservation
  const navigateToDetail = (reservationId) => {
    navigation.navigate("DetailledRefuelReservation", { reservationId });
  };

  // Utilisation d'un effet pour surveiller l'état de connexion de l'utilisateur
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Si l'utilisateur est connecté, charger les réservations
        loadReservations();
      } else {
        // Si l'utilisateur est déconnecté, vider les réservations
        setReservations([]);
      }
    });

    return () => unsubscribe(); // Nettoyage de l'effet lors du démontage du composant
  }, []);

  // Fonction pour charger les réservations à partir de Firestore
  const loadReservations = async () => {
    const q = query(
      collection(db, "RefuelBookings"), // Requête pour la collection "RefuelBookings"
      where("userId", "==", auth.currentUser.uid), // Filtrer par l'utilisateur connecté
      where("isActive", "==", false), // Filtrer les réservations inactives (celles qui sont passées)
      where("cancelled", "==", false) // Filtrer les réservations non annulées
    );

    try {
      const querySnapshot = await getDocs(q); // Exécuter la requête
      const loadedReservations = querySnapshot.docs.map((doc) => {
        const reservation = {
          id: doc.id, // Récupérer l'ID du document
          ...doc.data(), // Ajouter les données du document
        };
        // Extraire et ajouter le type de carburant à l'objet de la réservation
        reservation.fuelType = getFuelTypeFromVehicleId(reservation.vehicleId);
        return reservation;
      });
      setReservations(loadedReservations); // Mettre à jour l'état avec les réservations chargées
    } catch (error) {
      console.error("Erreur lors du chargement des réservations", error); // Gestion des erreurs
    }
  };

  // Utilisation de useFocusEffect pour recharger les réservations à chaque focus de l'écran
  useFocusEffect(
    useCallback(() => {
      loadReservations(); // Recharger les réservations
    }, [])
  );

  // Fonction pour extraire le type de carburant à partir de l'ID du véhicule
  const getFuelTypeFromVehicleId = (vehicleId) => {
    const parts = vehicleId.split(" - "); // Séparer l'ID du véhicule par des tirets
    return parts[parts.length - 1]; // Retourner la dernière partie (qui est le type de carburant)
  };

  return (
    <SafeAreaView style={tw`flex-1`}> {/* Garde la zone sûre pour le contenu */ }
      {/* Si aucune réservation n'est trouvée, afficher le composant NoHistory */}
      {reservations.length == 0 ? (
        <NoHistory /> // Affichage du composant en cas d'absence d'historique
      ) : (
        <FlatList // Composant pour afficher une liste défilante de réservations
          data={reservations} // Passer les données des réservations
          keyExtractor={(item) => item.id} // Utiliser l'ID de la réservation comme clé unique
          renderItem={({ item }) => ( // Pour chaque réservation, afficher une vue
            <TouchableOpacity
              style={tw`flex-row ml-6 w-90 p-2 bg-white border border-gray-200 rounded-2xl shadow-md mt-1 mb-3`} // Style pour chaque réservation
              onPress={() => navigateToDetail(item.id)} // Naviguer vers l'écran de détail au clic
            >
              <View style={tw`flex-1`}>
                <Text
                  numberOfLines={1} // Limite à une ligne
                  ellipsizeMode="tail" // Afficher "..." si le texte dépasse
                  style={tw`w-36 overflow-hidden text-gray-700 font-black text-xl mt-3 my-2 ml-2`}
                >
                  {item.address} {/* Adresse de la réservation */}
                </Text>
                <View style={tw`ml-2`}>
                  <Text style={tw`text-gray-700 font-light text-xs my-2`}>
                    {item.bookingDate} - {item.bookingHour} {/* Date et heure */}
                  </Text>
                </View>
              </View>
              <View style={tw`flex-row justify-end items-center`}>
                <View
                  style={tw`flex bg-white border border-gray-200 rounded-xl m-1 shadow-md w-20 items-center justify-center py-5`}
                >
                  <Text style={tw`text-[#34469C] text-base font-semibold`}>
                    {item.fuelType} {/* Type de carburant */}
                  </Text>
                </View>
                <View
                  style={tw`flex bg-white border border-gray-200 rounded-xl m-1 shadow-md w-20 items-center justify-center py-5`}
                >
                  <Text style={tw`text-[#34469C] text-base font-semibold`}>
                    {item.price}€ {/* Prix de la réservation */}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default RefuelPastReservation; // Exporter le composant pour l'utiliser dans d'autres parties de l'application
