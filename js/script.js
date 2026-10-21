

// Laboratoire 3 (formulaire,mémoire et theme)
// Chargé avec defer sur toutes les pages.

const DEMANDES =  "demandes"; 

// ===== Memoire(localStorage) ===== //

function lireDemandes() {
  try {
     const liste = JSON.parse(localStorage.getItem(DEMANDES));
     return Array.isArray(liste) ? liste : [];
  } catch (erreur) {
     return [];
  }
}

// Ajouter une demande au tableau et le sauvegarder

function enregistrerDemande(demande) { 
    const liste = lireDemandes();
    liste.push(demande);
    localStorage.setItem(DEMANDES, JSON.stringify(liste));

}

// Efface les demandes apres confirmation(removeItem)

function effacerDemandes() {
    if (confirm("Effacer toutes vos demandes ?")) {
        localStorage.removeItem(DEMANDES);
        afficherDemandes();
    }
}

// ========= 2. THEME CLAIR /SOMBRE ==========

function majBoutonTheme(bouton) {
    const estSombre = document.documentElement.getAttribute("data-theme") === "sombre";
    bouton.textContent = estSombre ? "Activer le mode clair" : "Activer le mode sombre";
    
}   

// Brancher les boutons de la navbar

function initialiserBoutonTheme() {
    const bouton = document.getElementById("btn-theme");
    if (!bouton) return;

    majBoutonTheme(bouton);
    bouton.addEventListener("click", function (){
        const actuel = document.documentElement.getAttribute("data-theme");
        const nouveau = actuel === "sombre" ? "clair" : "sombre";
        appliquerTheme(nouveau);
        localStorage.setItem(THEME, nouveau);
        majBoutonTheme(bouton);

    });
}

// ======= 3. FORMULAIRE =======

//retourner un message d'erreur

function validerNom(champ) {
    const valeur = champ.value.trim();
    if (valeur === "") return "Entrez votre nom complet";
    if (valeur.length < 2) return "Le nom doit contenir au moins 2 caracteres";
    return "";
}
function validerCourriel(champ) {
  const valeur = champ.value.trim();
  if (valeur === "") return "Entrez votre courriel";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur)) {
        return "Courriel invalide, Exemple : prenom@domaine.com";
  }
    return "";
}
function valideEquipe(champ) {
   const valeur = champ.value.trim();
   if (valeur === "")
    return "";
   const nombre = Number(valeur);
   if(!Number.isInteger(nombre) || nombre < 3 || nombre >50) {
    return"La taille de l'équipe doit être un nombre entier entre 3 et 50";
   }
    return "";
}
function validerSujet(champ) {
    if (champ.value === "") return "Choisissez un sujet";
    return "";
}

function validerMessage(champ) {
   const valeur = champ.value.trim();
    if (valeur === "") return "Écrivez votre message.";
    if (valeur.length < 10) {
        return "Le message doit contenir au moins 10 caractere";
    }
    return "";
}
function validerConsentement(champ) {
    if (!champ.checked) return "Vous devez accepter d'être contacté pour envoyer le formulaire";
    return "";
}

const REGLES = {
    nom: validerNom,
    courriel: validerCourriel,
    equipe: valideEquipe,
    sujet :validerSujet,
    message: validerMessage,
    consentement: validerConsentement
};

//Affiche lerreur

function afficherErreur(champ, message) {
    const zone = document.getElementById("erreur-" + champ.id);
    if(zone) zone.textContent = message;
    champ.classList.toggle("is-invalid", message !== "");
    champ.setAttribute("aria-invalid", message !== "" ? "true" : "false");
}

//valider un  champs
function validerChamp(champ) {
    const message = REGLES[champ.id](champ);
    afficherErreur(champ, message);
    return message === "";
}

// valider tout les champs - retourne true
function validerFormulaire() {
    let premierFautif = null;
    for(const id in REGLES) {
    const champ = document.getElementById(id);
    if(champ && !validerChamp(champ) && premierFautif === null) {
        premierFautif = champ;
      }  
    }
    if (premierFautif !== null) premierFautif.focus();
    return premierFautif === null;
}

//  4. FORMULAIRE =====

// Remplir avec la derniere demande enregistrer
function prerempliFormulaire() {
    const liste = lireDemandes();
    if (liste.length === 0) return;
    const derniere = liste[liste.length - 1];
    const nom = document.getElementById("nom");
    const courriel = document.getElementById("courriel");
    if (nom && derniere.nom) nom.value = derniere.nom;
    if (courriel && derniere.courriel) courriel.value = derniere.courriel;
}
 // Si le champ est deja en ereur et c'est corrigé ,enlever l'erreur

function corrigerEnDirect(champ) {
    if (champ.classList.contains("is-invalid")) validerChamp(champ);
}

function construireDemande() {
    return{
    nom: document.getElementById("nom").value.trim(),
    courriel:  document.getElementById("courriel").value.trim(),
    equipe:  document.getElementById("equipe").value.trim(),
    sujet : document.getElementById("sujet").value.trim(),
    message: document.getElementById("message").value.trim(),
    date: new Date().toLocaleString("fr-CA")
    };
}
function initialiserFormulaire() {
    const formulaire = document.querySelector("form")
    if(!formulaire) return; 
   
prerempliFormulaire();

    for(const id in REGLES) {
        const champ = document.getElementById(id);
        if (champ) {
            champ.addEventListener("input", function () {corrigerEnDirect(champ); });
            champ.addEventListener("change", function () {corrigerEnDirect(champ); });
        }
    }

    formulaire.addEventListener("submit", function (evenement){
        if (!validerFormulaire()) {
            evenement.preventDefault(); //Bloque s'il y a une erreur
            return;
        }
        enregistrerDemande(construireDemande());
    });
}

// === 5. AFFICHAGE ===

function afficherDemandes() {
    const conteneur = document.getElementById("liste-demandes");
    if(!conteneur) return;
     conteneur.replaceChildren();
     const liste = lireDemandes();
    if (liste.length === 0) {
        const vide = document.createElement("p");
        vide.textContent = "Aucune demande pour le moment.";
        conteneur.replaceChildren(vide);
        return;   
}

const ul = document.createElement("ul")
ul.className = "list-unstyled";
liste.forEach(function (demande) {
    const li = document.createElement("li");
    li.className = "mb-3";

    const titre = document.createElement("strong");
    titre.textContent = demande.sujet;

    const detail = document.createElement("div");
    detail.textContent = demande.nom + "(" + demande.courriel + ") : " + demande.date;
    
    
    const message = document.createElement("div");
    message.textContent = demande.message;

    // texteContent partout : jamais innerHTML avec du texte saisi par l'utilisateur
    li.append(titre, detail, message);
    ul.appendChild(li);    
  });
  conteneur.appendChild(ul);
}

function initialiserBoutonEffacer() {
    const bouton = document.getElementById("btn-effacer");
    if(!bouton) return;
    bouton.addEventListener("click", effacerDemandes);
}


//====6. RECAPITULATIF =====


function afficherRecapitulatif() {
    const zone = document.getElementById("recapitulatif");
    const liste = document.getElementById("recap-liste");
    if (!zone || !liste) return;

    const demandes = lireDemandes();
    if(demandes.length === 0) return; // rien s'enregistre , ca reste cacher.
    const derniere = demandes[demandes.length - 1];

    const lignes = [
         ["Nom", derniere.nom],
         ["Courriel", derniere.courriel],
         ["Taille de l'équipe", derniere.equipe || "Non précisée"],
         ["Sujet", derniere.sujet],
         ["Message",derniere.message]
    ];
    lignes.forEach(function (ligne) {
        const dt = document.createElement("dt");
        dt.textContent = ligne[0];
        const dd = document.createElement("dd");
        dd.textContent = ligne[1];
        liste.append(dt, dd);
    });
    zone.hidden = false;
}
//===DEMARRAGE====
// avec defer 
initialiserBoutonTheme();
initialiserFormulaire();
afficherDemandes();
initialiserBoutonEffacer();
afficherRecapitulatif();