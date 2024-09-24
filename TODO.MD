Faits :
1. **Ecran blanc si ont clique sur profil en étant non connecter**
2. **Historique de résa ('uid' null)**
3. **La mise à jour du profil ne marche pas**
4. **Lorsqu'il n'y à pas d'historique de réa afficher un message (différent si l'utilisateur est connectez ou non)**
5. **La mise à jour du mot de passe ne marche pas**
6. **Tous les champs ne sont pas obligatoire dans enregistrer une adresse (ne devrais pas être possible)**


Bugs :
- Vérifier véhicule et rajouter le bouton dans les formulaire
- Ajouter une entreprise, faire le formulaire ainsi que dans les formulaire ajouter le fait de choisir si la note c'est au nom de l'entreprise ou du particulier
- Problème dans les changements de page (stack ?)
- Connexion possible sans avoir valider l'email (ne devrais pas être possible)
- Problème sur la gestion d'état des réservations (bouton encore afficher ou résa encore affiché alors que annuler)
- Affichage du prix (NaN)
- Il n'y à que la résa de carbu qui marche

Parcours Utilisateurs :
- Modifier l'UI pour être plus fidèle au Figma
- Rendre les bouton entier cliquable pas que le texte
- Ajouter un se connectez au header
- Enlever le texte en anglais
- Changement d'huile ne renvoie pas vers un formulaire pour le changement d'huile
- Mot de passe oublié à transformer en pop up
- Lorsque "Point de rdv" remplie ne pas afficher "mes adresse et géolocaliser"
- Pouvoir supprimer sa photo



Inspiration Gaston service
Récupérer prix du carburant via une API

TO DO :
- Passer toutes les dates au format Date et non plus en String
- Ajouter agenda dans dashboard Admin
- ajouter numéro de tél détails de la réservation admin refueler
- Annuler commande coté garagiste et notifier le client
- Page d'urgence
- Afficher le num de tél du livreur afin de pouvoir l'appeler et lui laisser la main sur que faire de la réservation

V2
- QR code avec un lien redirigeant vers son refuel de son véhicule
