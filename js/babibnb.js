// PARTIE 1 : Affichage des offres sur l'accueil
// On récupère le tableau des offres
let offres = JSON.parse(localStorage.getItem("offres"));

if (offres === null) {
  offres = [];
}

const sauvegarder = function () {
  localStorage.setItem("offres", JSON.stringify(offres));
};

// PARTIE 2 : Affichage des offres dans la page publier.html et index.html

const zoneListe = document.querySelector("#offres-container");
if (zoneListe) {
  const monCompteur = document.querySelector("#compteur-offres");
  if (monCompteur) {
    monCompteur.textContent = offres.length;
  }

  zoneListe.innerHTML = "";

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
//PARTIE 3 : Validation des champs obligatoires
const formPublier = document.querySelector("#form-publier");

if (formPublier) {
  formPublier.addEventListener("submit", function (evenement) {
    evenement.preventDefault();

    const donnees = new FormData(formPublier);

    //On récupère les éléments HTML pour pouvoir changer leur style
    const inputTitre = document.querySelector("#titre");
    const inputPrix = document.querySelector("#prix");
    const inputDetails = document.querySelector("#details");
    let estValide = true;
    // Fonction de vérification d'un champ
    const verifierChamp = function (input) {
      if (input.value.trim() === "") {
        input.classList.add("border-red-500", "border-2");
        estValide = false;
      } else {
        input.classList.remove("border-red-500", "border-2");
      }
    };

    // On lance la vérification sur les champs obligatoires
    verifierChamp(inputTitre);
    verifierChamp(inputPrix);
    verifierChamp(inputDetails);

    // Si un champ est vide, on arrête
    if (estValide === false) {
      alert("Veuillez remplir les champs indiqués en rouge !");
      return;
    }

    // Validation du prix (doit être > 0)
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
    window.location.href = "index.html";
  });
}
//PARTIE 4 : Modification des offres existantes

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
