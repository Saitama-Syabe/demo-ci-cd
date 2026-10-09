// Dépôt de comptes en mémoire.
// C'est le « Fake » de la présentation sur les tests : une version simplifiée d'une vraie base de données.

export function creerDepotEnMemoire(emailsExistants = []) {
  const comptes = new Map(emailsExistants.map((email) => [email, { email }]));

  return {
    existe(email) {
      return comptes.has(email);
    },
    ajouter(compte) {
      comptes.set(compte.email, compte);
    },
    nombre() {
      return comptes.size;
    },
  };
}
