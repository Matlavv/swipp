// Importation des dépendances nécessaires
import { Ionicons } from "@expo/vector-icons"; // Icônes Ionicons
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Hooks de navigation
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"; // Fonctions Firestore pour récupérer des documents et des collections
import React, { useCallback, useEffect, useState } from "react"; // Hooks React pour gérer les états et les effets
import {
  Image, // Composant pour afficher des images
  SafeAreaView, // Composant pour gérer les zones sûres sur les appareils
  ScrollView, // Composant pour gérer les défilements
  Text, // Composant texte
  TouchableOpacity, // Composant pour les boutons cliquables
  View, // Conteneur de vues
} from "react-native"; // Composants React Native
import tw from "twrnc"; // Utilisation de Tailwind CSS pour le style
import { swippLogo } from "../../../assets"; // Logo de l'application
import { auth, db } from "../../../firebaseConfig"; // Configuration Firestore

// Composant RefuelAdmin pour afficher les réservations de ravitaillement d'un chauffeur
const RefuelAdmin = () => {
  const [date, setDate] = useState(new Date()); // État pour la gestion de la date sélectionnée
  const [firstName, setFirstName] = useState(""); // État pour le prénom de l'utilisateur (chauffeur)
  const [lastName, setLastName] = useState(""); // État pour le nom de famille de l'utilisateur (chauffeur)
  const [bookings, setBookings] = useState([]); // État pour les réservations récupérées
  const [users, setUsers] = useState({}); // État pour stocker les informations des utilisateurs liés aux réservations
  const user = auth.currentUser; // Utilisateur actuellement connecté (chauffeur)
  const navigation = useNavigation(); // Hook pour la navigation

  // Fonction pour extraire le type de carburant à partir de l'ID du véhicule
  const getFuelTypeFromVehicleId = (vehicleId) => {
    const parts = vehicleId.split(" - ");
    return parts[parts.length - 1]; // Retourne la dernière partie de l'ID (type de carburant)
  };

  // Fonction pour extraire la plaque d'immatriculation à partir de l'ID du véhicule
  const getPlateFromVehicleId = (vehicleId) => {
    const parts = vehicleId.split(" - ");
    return parts[parts.length - 2]; // Retourne l'avant-dernière partie de l'ID (plaque d'immatriculation)
  };

  // Fonction pour récupérer les données d'un utilisateur à partir de son ID
  const fetchUserData = async (userId) => {
    const userDoc = doc(db, "users", userId); // Référence au document utilisateur dans Firestore
    const userSnap = await getDoc(userDoc); // Récupération du document utilisateur
    if (userSnap.exists()) {
      const userData = userSnap.data(); // Extraction des données utilisateur
      return userData; // Retour des données
    }
    return null;
  };

  // Fonction pour récupérer les données de plusieurs utilisateurs liés aux réservations
  const fetchUsersData = async (bookings) => {
    const usersData = {}; // Objet pour stocker les données utilisateurs
    for (const booking of bookings) {
      if (!usersData[booking.userId]) {
        usersData[booking.userId] = await fetchUserData(booking.userId); // Récupération des données utilisateur si elles ne sont pas déjà dans l'objet
      }
    }
    setUsers(usersData); // Mise à jour de l'état des utilisateurs
  };

  // Fonction pour récupérer les réservations liées au chauffeur connecté
  const fetchBookings = async () => {
    if (user) {
      const q = query(
        collection(db, "RefuelBookings"),
        where("refuelerId", "==", user.uid) // Filtrer les réservations par l'ID du chauffeur
      );
      const querySnapshot = await getDocs(q); // Récupération des réservations correspondant à la requête
      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData); // Mise à jour de l'état des réservations
      fetchUsersData(bookingsData); // Récupération des données utilisateurs liées aux réservations
    }
  };

  // Effet pour charger les informations utilisateur et les réservations à l'ouverture de l'écran
  useEffect(() => {
    if (user) {
      const userDoc = doc(db, "users", user.uid); // Référence au document utilisateur dans Firestore
      getDoc(userDoc).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data(); // Extraction des données utilisateur
          setFirstName(userData.firstName); // Mise à jour de l'état pour le prénom
          setLastName(userData.lastName); // Mise à jour de l'état pour le nom
        }
      });

      fetchBookings(); // Appel de la fonction pour récupérer les réservations
    }
  }, [user]); // Exécution de l'effet à chaque changement de l'utilisateur connecté

  // Utilisation de useFocusEffect pour recharger les données à chaque fois que l'écran est affiché
  useFocusEffect(
    useCallback(() => {
      fetchBookings(); // Recharger les réservations
    }, [user])
  );

  // Fonction pour formater une date en format YYYY-MM-DD
  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("fr-CA", options); // Formatage de la date
  };

  // Fonction pour changer la date affichée (incrémenter ou décrémenter)
  const changeDate = (increment) => {
    const newDate = new Date(date.setDate(date.getDate() + increment)); // Modification de la date
    setDate(newDate); // Mise à jour de l'état avec la nouvelle date
  };

  // Fonction pour extraire l'heure de début à partir du format d'heure de la réservation
  const parseBookingHour = (bookingHour) => {
    const parts = bookingHour.split("h - ");
    const startHour = parseInt(parts[0], 10); // Conversion en entier de l'heure de début
    return startHour;
  };

  // Filtrer les réservations pour celles correspondant à la date sélectionnée
  const filteredBookings = bookings
    .filter((booking) => {
      const bookingDate = booking.bookingDate || booking.date;
      const formattedDate = formatDate(date);
      return bookingDate === formattedDate;
    })
    .sort(
      (a, b) =>
        parseBookingHour(a.bookingHour) - parseBookingHour(b.bookingHour) // Trier les réservations par heure de début
    );

  // Séparer les réservations à venir et les réservations passées
  const upcomingBookings = filteredBookings.filter(
    (booking) => booking.isActive
  );
  const pastBookings = filteredBookings.filter((booking) => !booking.isActive);

  // Navigation vers l'écran de détails d'une réservation
  const navigateToDetail = (reservationId) => {
    navigation.navigate("AdminRefuelReservationDetailled", { reservationId }); // Naviguer vers l'écran de détails avec l'ID de la réservation
  };

  // Rendu du composant
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} /> {/* Logo de l'application */}
          <View style={tw`flex items-end ml-4`}>
            <Text style={tw`text-lg font-semibold`}>
              Chauffeur : {firstName} {lastName} {/* Informations du chauffeur */}
            </Text>
            <Text style={tw`text-lg font-semibold`}>
              Date : {formatDate(new Date())} {/* Date actuelle */}
            </Text>
          </View>
        </View>
        <View style={tw`flex-row items-center justify-center`}>
          <TouchableOpacity onPress={() => changeDate(-1)}> {/* Bouton pour décrémenter la date */}
            <Ionicons name="chevron-back-circle" size={30} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-semibold mx-2`}>
            Réservations du {formatDate(date)} {/* Affichage de la date sélectionnée */}
          </Text>
          <TouchableOpacity onPress={() => changeDate(1)}> {/* Bouton pour incrémenter la date */}
            <Ionicons name="chevron-forward-circle" size={30} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={tw`p-3 border-b-2 border-gray-400`}></View>

        {/* Affichage des réservations à venir */}
        <Text style={tw`text-2xl font-bold p-3 mt-4`}>
          Réservations à venir
        </Text>
        <View style={tw`mt-5`}>
          {upcomingBookings.length > 0 ? ( // Si des réservations à venir existent
            upcomingBookings.map((booking) => (
              <View key={booking.id}>
                <View style={tw`flex items-center justify-center`}>
                  <Text style={tw`text-lg font-semibold text-[#34469C]`}>
                    {booking.bookingHour} {/* Affichage de l'heure de la réservation */}
                  </Text>
                </View>
                <TouchableOpacity
                  style={tw`flex flex-row justify-between items-center p-5 border-b-2 border-gray-200`}
                  onPress={() => navigateToDetail(booking.id)} // Navigation vers le détail de la réservation
                >
                  {/* Première colonne : nom, téléphone, adresse */}
                  <View style={tw`flex w-50`}>
                    <Text style={tw`font-semibold text-lg`}>
                      {users[booking.userId]?.firstName}{" "}
                      {users[booking.userId]?.lastName} {/* Nom de l'utilisateur */}
                    </Text>
                    <Text style={tw`text-gray-600 font-semibold text-base`}>
                      {users[booking.userId]?.phoneNumber} {/* Numéro de téléphone */}
                    </Text>
                    <Text style={tw`font-semibold text-base`}>
                      {booking.address} {/* Adresse */}
                    </Text>
                  </View>
                  <View style={tw`border-r h-full`}></View>
                  {/* Informations sur le véhicule */}
                  <View style={tw`ml-5`}>
                    <Text style={tw`text-lg font-semibold`}>
                      {getFuelTypeFromVehicleId(booking.vehicleId)} {/* Type de carburant */}
                    </Text>
                    <Text style={tw`text-lg font-semibold`}>
                      {getPlateFromVehicleId(booking.vehicleId)} {/* Plaque d'immatriculation */}
                    </Text>
                    <Text style={tw`text-lg font-semibold`}>
                      {booking.volume} Litres {/* Volume de carburant */}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={tw`text-center text-lg p-5`}>
              Aucune réservation à venir pour cette date.
            </Text>
          )}
        </View>

        {/* Affichage des réservations passées */}
        <Text style={tw`text-2xl font-bold p-3 mt-5`}>
          Réservations passées
        </Text>
        <View>
          {pastBookings.length > 0 ? ( // Si des réservations passées existent
            pastBookings.map((booking) => (
              <View key={booking.id}>
                <View style={tw`flex items-center justify-center`}>
                  <Text style={tw`text-lg font-semibold text-[#34469C]`}>
                    {booking.bookingHour} {/* Affichage de l'heure de la réservation */}
                  </Text>
                </View>
                <TouchableOpacity
                  style={tw`flex flex-row justify-between items-center p-5 border-b-2 border-gray-200`}
                  onPress={() => navigateToDetail(booking.id)} // Navigation vers le détail de la réservation
                >
                  {/* Première colonne : nom, téléphone, adresse */}
                  <View style={tw`flex w-50`}>
                    <Text style={tw`font-semibold text-lg`}>
                      {users[booking.userId]?.firstName}{" "}
                      {users[booking.userId]?.lastName} {/* Nom de l'utilisateur */}
                    </Text>
                    <Text style={tw`text-gray-600 font-semibold text-base`}>
                      {users[booking.userId]?.phoneNumber} {/* Numéro de téléphone */}
                    </Text>
                    <Text style={tw`font-semibold text-base`}>
                      {booking.address} {/* Adresse */}
                    </Text>
                  </View>
                  <View style={tw`border-r h-full`}></View>
                  {/* Informations sur le véhicule */}
                  <View style={tw`ml-5`}>
                    <Text style={tw`text-lg font-semibold`}>
                      {getFuelTypeFromVehicleId(booking.vehicleId)} {/* Type de carburant */}
                    </Text>
                    <Text style={tw`text-lg font-semibold`}>
                      {getPlateFromVehicleId(booking.vehicleId)} {/* Plaque d'immatriculation */}
                    </Text>
                    <Text style={tw`text-lg font-semibold`}>
                      {booking.volume} Litres {/* Volume de carburant */}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={tw`text-center text-lg p-5`}>
              Aucune réservation passée pour cette date.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RefuelAdmin;
