# Démo CI/CD : création de compte

Petite application qui accompagne la présentation du vendredi « CI/CD avec GitHub Actions ».
Elle reprend l'exemple filé de la présentation « Tests automatisés » : créer un compte à partir d'un email.

## Ce que contient le projet

| Élément | Rôle |
|---|---|
| `src/index.html`, `src/style.css` | Le formulaire, aux couleurs Syabe |
| `src/compte.js` | Les règles métier : email valide, non utilisé, mot de passe de 8 caractères minimum |
| `src/depot.js` | Une fausse base de comptes en mémoire (le « Fake ») |
| `src/app.js` | Le lien entre le formulaire et les règles |
| `tests/compte.test.js` | Les tests unitaires, rangés en nominal, erreur et limite |
| `tests/formulaire.test.js` | Le test d'intégration du formulaire |
| `eslint.config.js` | Les règles du lint |
| `.github/workflows/ci.yml` | Le pipeline GitHub Actions : lint, tests, déploiement |
| `.gitlab-ci.yml` | Le même pipeline pour GitLab CI |
| `DEMO.md` | La fiche de démo, pas à pas |

## Prérequis

Node.js 22.12 ou plus récent (`node -v` pour vérifier) et Git.

## Commandes utiles

```bash
npm install      # installe les outils (une seule fois)
npm run lint     # lance le lint
npm test         # lance les tests
npm start        # ouvre l'application sur http://localhost:3000
```

## Les règles testées

| Cas | Exemple | Résultat attendu |
|---|---|---|
| Nominal | `ada@test.com` + mot de passe valide | Compte créé |
| Erreur | Email déjà utilisé | « Cet email est déjà utilisé. » |
| Erreur | `ada.test.com` | Format refusé |
| Limite | Email vide | « L'email est obligatoire. » |
| Limite | Mot de passe de 7 caractères | Refusé |
| Limite | Mot de passe de 8 caractères | Accepté |
| Limite | `ADA@Test.COM` après `ada@test.com` | Considéré comme le même email |

Dans l'application en ligne, le compte `ada@test.com` existe déjà au démarrage : c'est pratique pour montrer le cas d'erreur.
