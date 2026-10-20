

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