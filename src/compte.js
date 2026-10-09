// Règles métier de la création de compte.
// C'est ce fichier que l'on modifie pendant la démo pour faire passer le pipeline au rouge.

export const LONGUEUR_MIN_MOT_DE_PASSE = 8;

const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const variableInutile = 42;


export class ErreurCompte extends Error {
  constructor(message) {
    super(message);
    this.name = "ErreurCompte";
  }
}

export function normaliserEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

export function creerCompte(email, motDePasse, depot) {
  const emailNormalise = normaliserEmail(email);

  if (emailNormalise === "") {
    throw new ErreurCompte("L'email est obligatoire.");
  }
  if (!FORMAT_EMAIL.test(emailNormalise)) {
    throw new ErreurCompte("Le format de l'email n'est pas valide.");
  }
  if (!motDePasse || motDePasse.length < LONGUEUR_MIN_MOT_DE_PASSE) {
    throw new ErreurCompte(
      `Le mot de passe doit contenir au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères.`
    );
  }
  if (depot.existe(emailNormalise)) {
    throw new ErreurCompte("Cet email est déjà utilisé.");
  }

  // On ne renvoie jamais le mot de passe.
  const compte = { email: emailNormalise, creeLe: new Date().toISOString() };
  depot.ajouter(compte);
  return compte;
}
