// PARTIE 1 : Affichage des offres sur l'accueil
let offres = JSON.parse(localStorage.getItem("offres"));

if (offres === null) {
  offres = [];
}

const sauvegarder = function () {
  localStorage.setItem("offres", JSON.stringify(offres));
};

// PARTIE 2 : Affichage sur l'accueil (index.html)
const zoneListe = document.querySelector("#offres-container");
if (zoneListe) {
  const monCompteur = document.querySelector("#compteur-offres");
  if (monCompteur) {
    // On affiche 3 (tes cartes HTML) + le nombre d'offres ajoutées
    monCompteur.textContent = 3 + offres.length;
  }

  // ATTENTION : On ne vide plus zoneListe.innerHTML = ""; 
  // On va ajouter les nouvelles offres à la suite des 3 cartes existantes

  for (let i = 0; i < offres.length; i++) {
    const o = offres[i];
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
            </div>
        `;
  }
}

// PARTIE 3 : Validation et Publication
const formPublier = document.querySelector("#form-publier");

if (formPublier) {
  formPublier.addEventListener("submit", function (evenement) {
    evenement.preventDefault();

    const donnees = new FormData(formPublier);
    const inputTitre = document.querySelector("#titre");
    const inputPrix = document.querySelector("#prix");
    const inputDetails = document.querySelector("#details");
    
    let estValide = true;
    const verifierChamp = function (input) {
      if (input.value.trim() === "") {
        input.classList.add("border-red-500", "border-2");
        estValide = false;
      } else {
        input.classList.remove("border-red-500", "border-2");
      }
    };

    verifierChamp(inputTitre);
    verifierChamp(inputPrix);
    verifierChamp(inputDetails);

    if (estValide === false) {
      alert("Veuillez remplir les champs indiqués en rouge !");
      return;
    }

    if (Number(inputPrix.value) <= 0) {
      inputPrix.classList.add("border-red-500", "border-2");
      alert("Le prix doit être supérieur à 0 !");
      return;
    }

    const nouvelleOffre = {
      id: Date.now(),
      type: donnees.get("type_bien"),
      titre: inputTitre.value,
      details: inputDetails.value,
      photo: donnees.get("photo"),
      prix: parseInt(inputPrix.value),
      commune: donnees.get("commune"),
      emplacement: donnees.get("emplacement"),
    };

    offres.push(nouvelleOffre);
    sauvegarder();

    alert("✅ Offre publiée !");
    window.location.reload(); 
  });
}

// PARTIE 4 : Modification
const formModifier = document.querySelector("#form-modifier");
if (formModifier) {
  const parametres = new URLSearchParams(window.location.search);
  const idCherche = parseInt(parametres.get("id"));

  let offreAModifier = null;
  for (let i = 0; i < offres.length; i++) {
    if (offres[i].id === idCherche) {
      offreAModifier = offres[i];
      break;
    }
  }

  if (offreAModifier) {
    document.querySelector("#type_bien").value = offreAModifier.type;
    document.querySelector("#titre").value = offreAModifier.titre;
    document.querySelector("#details").value = offreAModifier.details;
    document.querySelector("#photo").value = offreAModifier.photo;
    document.querySelector("#prix").value = offreAModifier.prix;
    document.querySelector("#commune").value = offreAModifier.commune;
    document.querySelector("#emplacement").value = offreAModifier.emplacement;
  }

  formModifier.addEventListener("submit", function (e) {
    e.preventDefault();
    const donneesModifiees = new FormData(formModifier);

    for (let i = 0; i < offres.length; i++) {
      if (offres[i].id === idCherche) {
        offres[i].type = donneesModifiees.get("type_bien");
        offres[i].titre = donneesModifiees.get("titre");
        offres[i].details = donneesModifiees.get("details");
        offres[i].photo = donneesModifiees.get("photo");
        offres[i].prix = parseInt(donneesModifiees.get("prix"));
        offres[i].commune = donneesModifiees.get("commune");
        offres[i].emplacement = donneesModifiees.get("emplacement");
        break;
      }
    }

    sauvegarder();
    alert("Offre modifiée !");
    window.location.href = "index.html";
  });
}

// TA PARTIE : LISTE DE GESTION (PUBLIER.HTML)
const gestion = document.querySelector("#liste-gestion");
if (gestion) {
    const monCompteur = document.querySelector("#compteur-offres");
    if (monCompteur) {
        monCompteur.textContent = 3 + offres.length;
    }

    offres.forEach((o, index) => {
        const divOffre = document.createElement("div");
        divOffre.className = "bg-white rounded-lg shadow p-4"; // Ton design exact
        divOffre.innerHTML = `
            <h3 class="font-semibold">${o.titre}</h3>
            <p class="text-sm text-gray-500">${o.details.substring(0, 40)}...</p>
            <p class="font-medium mt-2">Prix: ${o.prix.toLocaleString()} FCFA</p>
            <div class="flex gap-2 mt-3">
                <button type="button" class="btn-supprimer bg-red-500 text-white px-3 py-1 rounded text-sm">Supprimer</button>
                <a href="modifier.html?id=${o.id}" class="bg-blue-500 text-white px-3 py-1 rounded text-sm text-center">Modifier</a>
            </div>
        `;

        const btnSuppr = divOffre.querySelector(".btn-supprimer");
        btnSuppr.addEventListener("click", function() {
            if (confirm("Supprimer cette offre ?")) {
                offres.splice(index, 1);
                sauvegarder();
                window.location.reload();
            }
        });

        gestion.appendChild(divOffre);
    });
}