# Fiche de démo : du rouge au vert

Cette fiche couvre deux moments : la mise en place, à faire une seule fois avant vendredi, puis la démo elle-même, à répéter au moins une fois.

---

## Partie 1 : la mise en place (une seule fois)

### 1. Copier le projet hors de OneDrive

Le dossier `node_modules` contient des milliers de petits fichiers et OneDrive va essayer de tous les synchroniser.
Copiez le dossier `demo-ci-cd` vers un dossier local, par exemple `C:\dev\demo-ci-cd`, et travaillez depuis cette copie.

### 2. Vérifier que tout marche en local

Dans un terminal ouvert dans `C:\dev\demo-ci-cd` :

```bash
node -v          # doit afficher v22.12 ou plus
npm install
npm run lint
npm test         # 15 tests verts attendus
npm start        # puis ouvrir http://localhost:3000
```

### 3. Publier le projet sur votre GitHub

**Avec GitHub Desktop**

1. Menu *File > Add local repository*, choisir `C:\dev\demo-ci-cd`.
2. GitHub Desktop indique que ce n'est pas encore un dépôt : cliquer sur *create a repository*, garder la branche `main`, valider.
3. Faire le premier commit : résumé « Premier commit », puis *Commit to main*.
4. Cliquer sur *Publish repository*, nommer le dépôt `demo-ci-cd` et **décocher** *Keep this code private*.

Le dépôt doit être public : sur un compte GitHub gratuit, c'est la condition pour avoir la validation manuelle avant le déploiement et la protection de branche.

**Ou en ligne de commande**

Créer d'abord un dépôt vide et public nommé `demo-ci-cd` sur github.com, sans README, puis :

```bash
git init -b main
git add .
git commit -m "Premier commit"
git remote add origin https://github.com/VOTRE_COMPTE/demo-ci-cd.git
git push -u origin main
```

### 4. Activer GitHub Pages

Dans le dépôt sur github.com : *Settings > Pages*, puis dans *Build and deployment > Source*, choisir **GitHub Actions**.

### 5. Ajouter la validation avant la mise en ligne

*Settings > Environments > github-pages* (l'environnement apparaît après le premier lancement du pipeline ; sinon, le créer avec ce nom exact).

1. Cocher **Required reviewers** et s'ajouter soi-même.
2. Enregistrer avec *Save protection rules*.

### 6. Lancer le premier déploiement

Onglet *Actions > CI/CD > Run workflow* sur la branche `main`.
Les jobs `lint` et `test` passent au vert, puis `deploy` attend votre approbation : cliquer sur *Review deployments*, cocher `github-pages`, puis *Approve and deploy*.
L'adresse de l'application s'affiche dans le job `deploy`, sous la forme `https://VOTRE_COMPTE.github.io/demo-ci-cd/`.

### 7. Protéger la branche main

*Settings > Rules > Rulesets > New ruleset > New branch ruleset* :

1. Nom : `Protection main`, *Enforcement status* : **Active**.
2. *Target branches* : *Add target > Include default branch*.
3. Cocher **Require a pull request before merging** (mettre le nombre d'approbations à 0, puisque vous êtes seul).
4. Cocher **Require status checks to pass**, puis ajouter `lint` et `test`.
5. Laisser la liste *Bypass list* vide : même vous, administrateur, ne pourrez pas contourner la règle. C'est tout l'intérêt pour la démo.
6. *Create*.

La mise en place est terminée.

---

## Partie 2 : la démo devant la salle (environ 5 minutes)

À préparer avant : l'application en ligne ouverte dans un onglet, le dépôt GitHub dans un autre, GitHub Desktop et VS Code ouverts sur le projet.

### Étape 1 : montrer l'application (30 s)

Créer un compte avec un nouvel email : succès.
Réessayer avec `ada@test.com` : « Cet email est déjà utilisé. »
Phrase clé : « Cette règle est protégée par un test, celui de la dernière fois. »

### Étape 2 : casser (1 min)

1. GitHub Desktop : *Current branch > New branch*, nommer `feature/regle-mot-de-passe`.
2. Dans `src/compte.js`, remplacer `8` par `6` :

   ```js
   export const LONGUEUR_MIN_MOT_DE_PASSE = 6;
   ```

3. Commit « Assouplir la règle du mot de passe », puis *Publish branch*, puis *Create Pull Request*.

Sur GitHub, la pull request lance le pipeline. Le lint passe, mais trois tests échouent :
`refuse un mot de passe de 7 caractères`, `exige au moins 8 caractères pour le mot de passe`
et, côté formulaire, `affiche l'erreur quand le mot de passe est trop court`.
Le bouton de fusion est bloqué.

Phrase clé : « Quelqu'un a changé une règle métier sans le savoir. Le pipeline l'a vu avant que ça arrive en production. »

### Étape 3 : corriger (1 min)

Remettre `8` dans `src/compte.js`, commit « Rétablir la règle des 8 caractères », puis *Push origin*.
Le pipeline repart et passe au vert. Le bouton de fusion se débloque.

### Étape 4 : livrer (1 à 2 min)

1. *Merge pull request*.
2. Onglet *Actions* : le push sur `main` relance lint et tests, puis `deploy` attend l'approbation.
3. *Review deployments > Approve and deploy*.
4. Rafraîchir l'application en ligne.

Phrase clé : « Personne n'a copié de fichier sur un serveur. Le chemin est toujours le même, et il est vérifié à chaque fois. »

### Variante : faire échouer le lint

Pour montrer que le lint bloque avant même les tests, ajouter dans `src/compte.js` une variable qui ne sert à rien :

```js
const variableInutile = 42;
```

Le job `lint` passe au rouge et le job `test` ne démarre même pas, grâce à `needs: lint`.

---

## Plan B si le réseau ne suit pas

- Faire la démo en local : `npm test` au vert, modifier la règle, `npm test` au rouge, corriger, `npm test` au vert.
- Garder des captures d'écran de la pull request rouge puis verte, prises pendant la répétition.

## Après la démo

Fermer la pull request si elle n'a pas été fusionnée et supprimer la branche, pour repartir propre la prochaine fois.
