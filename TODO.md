# TP fil rouge

## Consignes

Vous devez développer un jeu complet en JavaScript.

Le projet doit inclure :

- des tests unitaires avec Vitest
- des tests d’interface avec Playwright
- des tests E2E automatisés
- un linter pour vérifier la qualité du code
- une intégration continue avec GitHub Actions

Les fonctionnalités implémentées doivent être testées autant que possible.

Le taux de couverture minimum attendu pour les tests unitaires est de **90 %**.

Une fonctionnalité non testée ne sera pas évaluée.

Les tests doivent inclure :

- des cas normaux
- des cas d’erreur
- des cas limites

Les tests doivent contenir des assertions claires vérifiant le comportement attendu.

---

## Organisation du projet

- Travail en groupe de 2 maximum (3 si nombre impair)
- Vous devez me fournir un lien de votre repository

---

## Workflow Git 

Vous devez travailler comme dans un contexte professionnel.

### Branches

Vous devez avoir :

- `main`
- `dev`

Interdictions :

- ❌ pas de push direct sur `main`
- ❌ pas de push direct sur `dev`

Vous devez uniquement travailler avec des branches :

```bash
feature/nom-de-la-feature
```

---

### Règles de merge

* une branche `feature/*` → merge uniquement dans `dev`
* `dev` → merge ensuite dans `main`
* une Pull Request est obligatoire pour chaque merge
* vous ne pouvez pas merger votre propre Pull Request
* une Pull Request doit être validée par un autre membre du groupe

---

### Protection des branches

Les branches `main` et `dev` doivent être protégées :

* pas de push direct
* merge uniquement via Pull Request
* merge uniquement si la CI est valide

---

## GitHub Issues

Vous ne devez jamais commencer une feature sans issue.

Chaque fonctionnalité doit :

1. avoir une issue GitHub
2. être décrite clairement
3. contenir des critères d’acceptation
4. avoir des labels !

Chaque bug doit être déclaré dans une issue.

---

## Pull Requests

Chaque Pull Request doit :

* être liée à une issue
* contenir une description claire
* expliquer ce qui a été fait
* expliquer ce qui a été testé

Vous devez créer :

* un modèle de Pull Request ⚠️
* un modèle d’issue ⚠️

---

## Intégration Continue 

Vous devez mettre en place une CI avec GitHub Actions.

À chaque push et Pull Request, les étapes suivantes doivent être exécutées :

```text
install → lint → tests unitaires → build → tests E2E
```

Une Pull Request ne doit pas pouvoir être mergée si :

* le lint échoue
* les tests unitaires échouent
* les tests E2E échouent

---

## Déploiement

Si possible :

La branche `main` doit être automatiquement déployée sur le VPS fourni par l’école.

Le déploiement doit se faire uniquement si la CI est valide.

---

## Conventions de code

Vous devez définir un document de conventions :

```bash
GUIDELINES.md
```

Ce document doit contenir :

* conventions de nommage
* organisation du code
* règles de style
* bonnes pratiques

Tout autre élément pertinent pour assurer la qualité du code peut être ajouté.

---

## Étapes du projet

### 1. Conception du projet

Créer un fichier `PROJECT.md` contenant :

* le but du projet
* les fonctionnalités principales
* l’architecture
* les outils utilisés (Vitest, Playwright, linter…)

Le fichier `README.md` doit être clair et contenir :

* une description courte du projet
* les instructions d’installation
* les instructions d’utilisation
* les instructions de test

---

### 2. Scénarios de test (TDD)

Créer un fichier `TDD.md` avec des scénarios en Given / When / Then.

Format :

* Given : contexte
* When : action
* Then : résultat attendu

Ces scénarios doivent servir de base à vos tests.

---

## Tests attendus

### Tests unitaires (Vitest)

* fonctions métier
* logique de score
* règles du jeu

### Tests E2E (Playwright)

* parcours utilisateur complet
* démarrage d’une partie
* victoire / défaite
* affichage du score

---

## Recettage

Vous devez produire un fichier :

```bash
RECETTAGE.md
```

Ce document doit contenir :

* scénarios de test
* résultats
* anomalies
* conclusion

Les scénarios doivent inclure :

* cas normaux
* cas d’erreur
* cas limites

---

## Livrables

Le repository doit contenir :

* code source
* PROJECT.md
* TDD.md
* RECETTAGE.md
* GUIDELINES.md
* configuration CI
* tests unitaires
* tests E2E

---

## Commandes attendues

```bash
npm install
npm run start
npm run lint
npm test
npm run test:e2e
```

---

## Évaluation

Le projet sera évalué sur :

* fonctionnalités
* qualité du code
* qualité des tests
* couverture
* respect du workflow Git
* qualité des Pull Requests
* utilisation des issues
* CI fonctionnelle
* recettage
* organisation du projet

Pour le reste on verra cela ensemble :)



