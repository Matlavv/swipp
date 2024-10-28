import { createSlice } from "@reduxjs/toolkit";

// Initialisation de l'état initial pour la navigation
const initialState = {
    origin: null, // Point d'origine (coordonnées ou autre donnée)
    destination: null, // Point de destination
    travelTimeInformation: null, // Informations de temps de trajet (durée, distance, etc.)
}

// Création d'un slice Redux pour gérer l'état de navigation
export const navSlice = createSlice({
    name: 'nav', // Nom du slice (sera utilisé pour identifier ce slice dans le store Redux)
    initialState, // Définit l'état initial
    reducer: { // Définit les réducteurs (reducers), c'est-à-dire les fonctions qui modifient l'état
        setOrigin: (state, action) => {
            // Réducteur pour définir le point d'origine
            state.origin = action.payload; // Met à jour 'origin' avec la valeur envoyée dans action.payload
        },
        setDestination: (state, action) => {
            // Réducteur pour définir la destination
            state.destination = action.payload; // Met à jour 'destination' avec la valeur envoyée dans action.payload
        },
        setTravelTimeInformation: (state, action) => {
            // Réducteur pour définir les informations de temps de trajet
            state.travelTimeInformation = action.payload; // Met à jour 'travelTimeInformation' avec la valeur envoyée dans action.payload
        },
    },
});

// Exportation des actions pour les utiliser dans d'autres parties de l'application
export const { setOrigin, setDestination, setTravelTimeInformation } = navSlice.actions;

// Sélecteurs pour extraire des parties spécifiques de l'état dans le store Redux
export const selectOrigin = (state) => state.nav.origin; // Sélecteur pour récupérer l'origine
export const selectDestination = (state) => state.nav.destination; // Sélecteur pour récupérer la destination
export const selectTravelTimeInformation = (state) => state.nav.travelTimeInformation; // Sélecteur pour récupérer les infos de temps de trajet

// Exportation du réducteur pour l'ajouter au store Redux
export default navSlice.reducer;
