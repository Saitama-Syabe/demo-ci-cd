// Tests unitaires des règles de création de compte.
// Organisation reprise de la présentation « Tests automatisés » : nominal, erreur, limite.

import { describe, it, expect, beforeEach } from "vitest";
import { creerCompte, ErreurCompte, LONGUEUR_MIN_MOT_DE_PASSE } from "../src/compte.js";
import { creerDepotEnMemoire } from "../src/depot.js";

const MOT_DE_PASSE_VALIDE = "motdepasse8";

let depot;
beforeEach(() => {
  depot = creerDepotEnMemoire();
});

describe("Cas nominal", () => {
  it("crée un compte à partir d'un email", () => {
    // Arrange : je prépare un email valide
    const email = "ada@test.com";

    // Act : je demande la création du compte
    const compte = creerCompte(email, MOT_DE_PASSE_VALIDE, depot);

    // Assert : je vérifie le résultat attendu
    expect(compte.email).toBe(email);
  });

  it("enregistre le compte dans le dépôt", () => {
    creerCompte("grace@test.com", MOT_DE_PASSE_VALIDE, depot);

    expect(depot.existe("grace@test.com")).toBe(true);
    expect(depot.nombre()).toBe(1);
  });

  it("ne renvoie jamais le mot de passe", () => {
    const compte = creerCompte("alan@test.com", MOT_DE_PASSE_VALIDE, depot);

    expect(compte).not.toHaveProperty("motDePasse");
  });
});

describe("Cas d'erreur", () => {
  it("refuse un email déjà utilisé", () => {
    const depotAvecAda = creerDepotEnMemoire(["ada@test.com"]);

    expect(() => creerCompte("ada@test.com", MOT_DE_PASSE_VALIDE, depotAvecAda)).toThrow(
      "Cet email est déjà utilisé."
    );
  });

  it("refuse un email au mauvais format", () => {
    expect(() => creerCompte("ada.test.com", MOT_DE_PASSE_VALIDE, depot)).toThrow(ErreurCompte);
  });

  it("refuse un mot de passe absent", () => {
    expect(() => creerCompte("ada@test.com", undefined, depot)).toThrow(/au moins/);
  });

  it("n'enregistre rien quand la création échoue", () => {
    expect(() => creerCompte("ada.test.com", MOT_DE_PASSE_VALIDE, depot)).toThrow();

    expect(depot.nombre()).toBe(0);
  });
});

describe("Cas limites", () => {
  it("refuse un email vide", () => {
    expect(() => creerCompte("   ", MOT_DE_PASSE_VALIDE, depot)).toThrow("L'email est obligatoire.");
  });

  it("exige au moins 8 caractères pour le mot de passe", () => {
    expect(LONGUEUR_MIN_MOT_DE_PASSE).toBe(8);
  });

  it("refuse un mot de passe de 7 caractères", () => {
    expect(() => creerCompte("ada@test.com", "1234567", depot)).toThrow(/au moins 8 caractères/);
  });

  it("accepte un mot de passe d'exactement 8 caractères", () => {
    const compte = creerCompte("ada@test.com", "12345678", depot);

    expect(compte.email).toBe("ada@test.com");
  });

  it("traite un email en majuscules comme le même email", () => {
    creerCompte("ada@test.com", MOT_DE_PASSE_VALIDE, depot);

    expect(() => creerCompte("  ADA@Test.COM ", MOT_DE_PASSE_VALIDE, depot)).toThrow(
      "Cet email est déjà utilisé."
    );
  });
});
