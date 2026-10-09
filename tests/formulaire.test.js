// @vitest-environment jsdom
// Test d'intégration : le formulaire HTML et les règles métier fonctionnent-ils ensemble ?

import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { brancherFormulaire } from "../src/app.js";
import { creerDepotEnMemoire } from "../src/depot.js";

const html = readFileSync(resolve(process.cwd(), "src/index.html"), "utf-8");

function remplirEtEnvoyer(email, motDePasse) {
  const formulaire = document.getElementById("form-compte");
  formulaire.elements.email.value = email;
  formulaire.elements.motDePasse.value = motDePasse;
  formulaire.dispatchEvent(new Event("submit", { cancelable: true }));
}

const message = () => document.getElementById("message");
const compteur = () => document.getElementById("compteur").textContent;

beforeEach(() => {
  document.body.innerHTML = new DOMParser().parseFromString(html, "text/html").body.innerHTML;
  brancherFormulaire(document, creerDepotEnMemoire(["ada@test.com"]));
});

describe("Formulaire de création de compte", () => {
  it("affiche un message de succès et met à jour le compteur", () => {
    remplirEtEnvoyer("grace@test.com", "motdepasse8");

    expect(message().textContent).toBe("Compte créé pour grace@test.com.");
    expect(message().className).toContain("succes");
    expect(compteur()).toBe("2");
  });

  it("affiche l'erreur quand l'email est déjà utilisé", () => {
    remplirEtEnvoyer("ada@test.com", "motdepasse8");

    expect(message().textContent).toBe("Cet email est déjà utilisé.");
    expect(message().className).toContain("erreur");
    expect(compteur()).toBe("1");
  });

  it("affiche l'erreur quand le mot de passe est trop court", () => {
    remplirEtEnvoyer("alan@test.com", "court");

    expect(message().textContent).toMatch(/au moins 8 caractères/);
  });
});
