import { Ionicons } from "@expo/vector-icons"; // Importation des icônes Ionicons pour les icônes du calendrier et de localisation
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Hooks pour la navigation et les effets lors du focus sur l'écran
import { onAuthStateChanged } from "firebase/auth"; // Fonction Firebase pour surveiller l'état d'authentification
import { collection, getDocs, query, where } from "firebase/firestore"; // Firebase Firestore pour effectuer des requêtes
import React, { useCallback, useEffect, useState } from "react"; // Hooks React pour gérer l'état et les effets
import {
  FlatList, // Composant pour afficher des listes déroulantes
  Image, // Composant pour afficher des images
  SafeAreaView, // Composant pour gérer les marges sûres sur les appareils
  Text, // Composant texte
  TouchableOpacity, // Élément cliquable
  View, // Conteneur de vue
} from "react-native";
import tw from "twrnc"; // Utilisation de Tailwind CSS pour le style
import { maintenance, oil_change, reparation } from "../../assets"; // Importation d'images pour différents types de réparations
import { auth, db } from "../../firebaseConfig"; // Importation de Firebase pour l'authentification et la base de données
import NoHistory from "./NoHistory"; // Composant à afficher lorsque l'historique est vide

// Composant pour afficher les réservations de réparations à venir
const RepairIncomingReservation = () => {
  const [reservations, setReservations] = useState([]); // État pour stocker les réservations
  const navigation = useNavigation(); // Hook pour gérer la navigation

  // Fonction pour naviguer vers les détails d'une réservation spécifique
  const navigateToDetail = (reservationId) => {
    navigation.navigate("DetailledRepairReservation", { reservationId });
  };

  // Effet pour surveiller l'état de connexion de l'utilisateur
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

    return () => unsubscribe(); // Nettoyer l'écouteur lors du démontage du composant
  }, []);

  // Fonction pour charger les réservations depuis Firestore
  const loadReservations = async () => {
    const q = query(
      collection(db, "RepairBookings"), // Collection des réservations de réparations
      where("userId", "==", auth.currentUser.uid), // Filtrer par l'utilisateur connecté
      where("isActive", "==", false), // Filtrer les réservations inactives (donc passées)
      where("cancelled", "==", false) // Filtrer les réservations non annulées
    );

    try {
      const querySnapshot = await getDocs(q); // Exécuter la requête
      const loadedReservations = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Obtenir l'ID du document
        ...doc.data(), // Ajouter les données du document
      }));
      setReservations(loadedReservations); // Mettre à jour l'état avec les réservations chargées
    } catch (error) {
      console.error("Erreur lors du chargement des réservations", error); // Gérer les erreurs
    }
  };

  // Utilisation de useFocusEffect pour recharger les données lors de chaque focus de l'écran
  useFocusEffect(
    useCallback(() => {
      loadReservations(); // Recharger les réservations
    }, [])
  );

  // Fonction pour définir l'image en fonction du type de réparation
  const renderItem = ({ item }) => {
    let imageSource;

    // Choisir l'image correspondant au type de réparation
    switch (item.reparationType) {
      case "Contrôle technique":
        imageSource = maintenance;
        break;
      case "Entretien":
        imageSource = oil_change;
        break;
      case "Réparation":
        imageSource = reparation;
        break;
      default:
        imageSource = null; // Si aucun type ne correspond
    }

    // Conversion des dates de réservation en objet Date pour formatage
    const bookingDate = new Date(item.bookingDate.toDate()); // Convertit la date en format JavaScript Date
    const formattedTime = bookingDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Affichage 24 heures
    });

    return (
      <View
        style={tw`w-93 h-55 p-2 bg-white border border-gray-200 rounded-2xl m-1 mr-4 shadow-md mt-3`}
      >
        {/* Création d'un bouton cliquable pour chaque réservation */}
        <TouchableOpacity
          style={tw`flex-row justify-between`} // Organiser le contenu en deux colonnes
          onPress={() => navigateToDetail(item.id)} // Naviguer vers les détails de la réservation
        >
          <View style={tw`flex-1`}>
            {/* Afficher le détail de la réparation ou son type */}
            <Text
              style={tw`text-gray-700 font-black text-2xl m-2`}
              numberOfLines={2} // Limiter le texte à 2 lignes
              ellipsizeMode="tail" // Afficher "..." si le texte dépasse
            >
              {item.reparationDetail || item.reparationType} {/* Détail ou type de réparation */}
            </Text>
            <Text style={tw`text-gray-700 text-base font-light mt--2 ml-2`}>
              {item.reparationType} {/* Type de réparation */}
            </Text>

            {/* Affichage de la date et de l'heure de réservation */}
            <View style={tw`flex-row mt-2 ml-2`}>
              <Ionicons name="calendar-outline" size={24} color="gray" /> {/* Icône de calendrier */}
              <Text style={tw`text-base ml-1`}>
                {bookingDate.toLocaleDateString("fr-FR")} - {formattedTime} {/* Date et heure formatées */}
              </Text>
            </View>

            {/* Affichage du lieu de la réparation */}
            <View style={tw`flex-row mt-2 ml-2`}>
              <Ionicons name="location-outline" size={24} color="gray" /> {/* Icône de localisation */}
              <Text
                numberOfLines={1} // Limiter à une seule ligne
                ellipsizeMode="tail"
                style={tw`text-base ml-1`}
              >
                {item.location} {/* Lieu de la réparation */}
              </Text>
            </View>

            {/* Affichage du prix de la réparation */}
            <View
              style={tw`bg-[#34469C] px-4 py-1.5 rounded-full self-start flex-row mt-2`} // Bouton pour afficher le prix
            >
              <Text style={tw`text-white text-sm font-bold`}>{item.price} €</Text> {/* Prix de la réparation */}
            </View>
          </View>
          {/* Affichage de l'image correspondant au type de réparation */}
          <View style={tw`w-35 h-35 mt-7`}>
            <Image
              source={imageSource} // Image correspondant au type de réparation
              resizeMode="contain"
              style={tw`w-full h-full`} // Ajuster l'image à l'espace disponible
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      {/* Si aucune réservation n'est trouvée, afficher le composant NoHistory */}
      {reservations.length == 0 ? (
        <NoHistory />
      ) : (
        // Afficher la liste des réservations
        <FlatList
          data={reservations} // Les données de la liste
          renderItem={renderItem} // Rendre chaque élément
          keyExtractor={(item) => item.id} // Utiliser l'ID de la réservation comme clé unique
          showsHorizontalScrollIndicator={false} // Masquer l'indicateur de défilement horizontal
          contentContainerStyle={tw`p-2 ml-2`} // Style pour le conteneur de la liste
        />
      )}
    </SafeAreaView>
  );
};

export default RepairIncomingReservation; // Exporter le composant
