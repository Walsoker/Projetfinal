// On récupère les offres enregistrées dans le navigateur
// Si aucune offre n'existe, on crée un tableau vide
let offres = JSON.parse(localStorage.getItem("offres")) || [];

// Petite fonction pour enregistrer le tableau dans le localStorage
const sauvegarder = () => {
  localStorage.setItem("offres", JSON.stringify(offres));
};

// AFFICHAGE SUR LA PAGE D'ACCUEIL
const zoneListe = document.querySelector("#offres-container");
if (zoneListe) {
  const monCompteur = document.querySelector("#compteur-offres");
  if (monCompteur) {
    // On additionne les 3 offres déjà présentes dans le HTML avec les nouvelles
    monCompteur.textContent = 3 + offres.length;
  }

  // On boucle sur le tableau pour créer les cartes des nouvelles offres
  offres.forEach(o => {
    zoneListe.innerHTML += `
      <div class="card bg-white w-80 p-5 rounded-md shadow">
        <div class="content">
          <h3 class="font-semibold text-xl">${o.titre}</h3>
          <p class="text-sm">${o.details}</p>
          <div class="img mt-3">
            <img src="${o.photo}" width="250" alt="${o.titre}">
          </div>
          <div class="prix mt-1 font-medium">
            prix : ${o.prix.toLocaleString()} CFA
          </div>
        </div>
      </div>`;
  });
}

//  GESTION DU FORMULAIRE DE PUBLICATION 
const formPublier = document.querySelector("#form-publier");
if (formPublier) {
  formPublier.addEventListener("submit", function (e) {
    e.preventDefault(); // On empêche la page de se recharger tout de suite

    // On récupère les infos saisies
    const donnees = new FormData(formPublier);
    const titre = document.querySelector("#titre");
    const prix = document.querySelector("#prix");
    const details = document.querySelector("#details");
    
    // Test simple : est-ce que les champs obligatoires sont remplis ?
    let valide = true;
    [titre, prix, details].forEach(input => {
      if (input.value.trim() === "") {
        input.classList.add("border-red-500", "border-2");
        valide = false;
      } else {
        input.classList.remove("border-red-500", "border-2");
      }
    });

    if (!valide) {
      alert("Attention, il manque des informations !");
      return;
    }

    // On crée l'objet de la nouvelle offre
    const nouvelleOffre = {
      id: Date.now(), // Utilisation du timestamp pour avoir un ID unique on l'a vue en js avancé
      type: donnees.get("type_bien"),
      titre: titre.value,
      details: details.value,
      photo: donnees.get("photo"),
      prix: parseInt(prix.value),
      commune: donnees.get("commune"),
      emplacement: donnees.get("emplacement"),
    };

    // On l'ajoute au tableau et on sauvegarde
    offres.push(nouvelleOffre);
    sauvegarder();

    alert("Super ! L'offre est publiée.");
    window.location.reload(); 
  });
}

//  GESTION DE LA MODIFICATION 
const formModifier = document.querySelector("#form-modifier");
if (formModifier) {
  // On regarde quel ID est passé dans l'URL
  const params = new URLSearchParams(window.location.search);
  const idCherche = parseInt(params.get("id"));

  // On cherche l'offre correspondante dans notre tableau
  let offre = offres.find(item => item.id === idCherche);

  // Si on la trouve, on pré-remplit le formulaire
  if (offre) {
    document.querySelector("#type_bien").value = offre.type;
    document.querySelector("#titre").value = offre.titre;
    document.querySelector("#details").value = offre.details;
    document.querySelector("#photo").value = offre.photo;
    document.querySelector("#prix").value = offre.prix;
    document.querySelector("#commune").value = offre.commune;
    document.querySelector("#emplacement").value = offre.emplacement;
  }

  // Quand on valide les modifications
  formModifier.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(formModifier);

    // On met à jour les données dans le tableau
    const index = offres.findIndex(item => item.id === idCherche);
    if (index !== -1) {
      offres[index] = { ...offres[index], 
        type: data.get("type_bien"),
        titre: data.get("titre"),
        details: data.get("details"),
        photo: data.get("photo"),
        prix: parseInt(data.get("prix")),
        commune: data.get("commune"),
        emplacement: data.get("emplacement")
      };
      sauvegarder();
      alert("Modifications enregistrées !");
      window.location.href = "index.html";
    }
  });
}

//  LISTE DE GESTION (POUR SUPPRIMER OU MODIFIER) 
const gestion = document.querySelector("#liste-gestion");
if (gestion) {
    // on va utilise la boucle foreach sur nos offres pour afficher la petite liste de droite
    offres.forEach((o, index) => {
        const div = document.createElement("div");
        div.className = "bg-white rounded-lg shadow p-4";
        div.innerHTML = `
            <h3 class="font-semibold">${o.titre}</h3>
            <p class="text-sm text-gray-500">${o.details.substring(0, 40)}...</p>
            <p class="font-medium mt-2">Prix: ${o.prix.toLocaleString()} FCFA</p>
            <div class="flex gap-2 mt-3">
                <button type="button" class="btn-suppr bg-red-500 text-white px-3 py-1 rounded text-sm">Supprimer</button>
                <a href="modifier.html?id=${o.id}" class="bg-blue-500 text-white px-3 py-1 rounded text-sm text-center">Modifier</a>
            </div>`;

        // Action du bouton supprimer
        div.querySelector(".btn-suppr").onclick = () => {
            if (confirm("Voulez-vous vraiment retirer cette offre ?")) {
                offres.splice(index, 1);
                sauvegarder();
                window.location.reload();
            }
        };
        gestion.appendChild(div);
    });
}