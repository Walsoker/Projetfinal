// On cible la zone où tu veux afficher TA liste de gestion (barre latérale)
const maZoneGestion = document.querySelector("#liste-gestion");

if (maZoneGestion) {
    // ÉTAPE 5 : AFFICHAGE DES OFFRES 
    // On vide la zone avant de commencer
    maZoneGestion.innerHTML = "";

    offres.forEach((o, index) => {
        
        // 1. Création du conteneur de l'offre
        const divLigne = document.createElement("div");
        divLigne.classList.add("border-b", "pb-3", "mb-3", "flex", "flex-col", "gap-1");

        // 2. Création du texte Titre et Prix
        const infos = document.createElement("p");
        infos.classList.add("text-sm", "font-medium");
        infos.textContent = o.titre + " - " + o.prix.toLocaleString() + " CFA";

        // 3. Création du groupe de boutons
        const groupeBtn = document.createElement("div");
        groupeBtn.classList.add("flex", "gap-2");

        // --- ÉTAPE 7 : SUPPRESSION ---
        const btnSuppr = document.createElement("button");
        btnSuppr.textContent = "Supprimer";
        btnSuppr.classList.add("bg-red-500", "text-white", "text-xs", "px-2", "py-1", "rounded");
        
        btnSuppr.addEventListener("click", function() {
            if (confirm("Supprimer cette offre ?")) {
                // On utilise splice sur le tableau global
                offres.splice(index, 1);
                // On utilise la fonction de ta partenaire pour mettre à jour le localStorage
                sauvegarder();
                // On recharge pour actualiser l'affichage
                window.location.reload();
            }
        });

        // --- ÉTAPE 8 : MODIFICATION (BOUTON VERS FORMULAIRE) ---
        const btnModif = document.createElement("a");
        btnModif.textContent = "Modifier";
        btnModif.href = "modifier.html?id=" + o.id; // On passe l'ID dans l'URL
        btnModif.classList.add("bg-blue-600", "text-white", "text-xs", "px-2", "py-1", "rounded", "text-center");

        // --- ASSEMBLAGE ---
        groupeBtn.appendChild(btnSuppr);
        groupeBtn.appendChild(btnModif);
        
        divLigne.appendChild(infos);
        divLigne.appendChild(groupeBtn);

        // On ajoute la ligne terminée dans ta zone de gestion
        maZoneGestion.appendChild(divLigne);
    });
}

// ÉTAPE 6 : COMPTEUR DYNAMIQUE
// Le code de ta partenaire met déjà à jour "#compteur-offres"
// Mais au cas où tu as un deuxième compteur spécifique :
const monDeuxiemeCompteur = document.querySelector("#mon-compteur-perso");
if (monDeuxiemeCompteur) {
    monDeuxiemeCompteur.textContent = offres.length;
}