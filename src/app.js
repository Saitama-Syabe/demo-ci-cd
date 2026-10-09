// Relie le formulaire HTML aux règles métier.

import { creerCompte, ErreurCompte } from "./compte.js";
import { creerDepotEnMemoire } from "./depot.js";

export function brancherFormulaire(doc, depot) {
  const formulaire = doc.getElementById("form-compte");
  const message = doc.getElementById("message");
  const compteur = doc.getElementById("compteur");

  const afficherCompteur = () => {
    compteur.textContent = String(depot.nombre());
  };

  formulaire.addEventListener("submit", (evenement) => {
    evenement.preventDefault();
    const email = formulaire.elements.email.value;
    const motDePasse = formulaire.elements.motDePasse.value;

    try {
      const compte = creerCompte(email, motDePasse, depot);
      message.textContent = `Compte créé pour ${compte.email}.`;
      message.className = "message succes";
      formulaire.reset();
    } catch (erreur) {
      if (!(erreur instanceof ErreurCompte)) throw erreur;
      message.textContent = erreur.message;
      message.className = "message erreur";
    }
    afficherCompteur();
  });

  afficherCompteur();
}

// Au chargement de la page, on démarre avec un compte déjà existant
// pour pouvoir montrer le cas « email déjà utilisé ».
if (typeof document !== "undefined" && document.getElementById("form-compte")) {
  brancherFormulaire(document, creerDepotEnMemoire(["ada@test.com"]));
}
