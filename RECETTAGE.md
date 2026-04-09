# Rapport de Recettage - Cookie Clicker

## Scénarios de Test

### 1. Inscription et Connexion
- **Action**: Créer un nouveau compte et se connecter.
- **Résultat attendu**: Redirection vers la page de jeu avec le nom d'utilisateur affiché.
- **Statut**: ✅ Passé (Automatisé - Playwright)

### 2. Clic sur le Cookie
- **Action**: Cliquer sur le gros cookie.
- **Résultat attendu**: Le compteur de cookies augmente de la valeur de clic actuelle.
- **Statut**: ✅ Passé (Automatisé - Playwright)

### 3. Achat d'Amélioration (Clic)
- **Action**: Acheter "Force du clic" avec 10 cookies.
- **Résultat attendu**: Cookies déduits, niveau augmente, chaque clic rapporte +1 cookie supplémentaire.
- **Statut**: ✅ Passé (Automatisé - Playwright)

### 4. Achat d'Auto-clicker
- **Action**: Acheter un "Auto-clicker" avec 50 cookies.
- **Résultat attendu**: Cookies déduits, production automatique de cookies par seconde.
- **Statut**: ✅ Passé (Manuel)

### 5. Persistance
- **Action**: Rafraîchir la page après avoir gagné des cookies.
- **Résultat attendu**: Le score et les améliorations sont conservés.
- **Statut**: ✅ Passé (Manuel)

## Anomalies
- Aucune anomalie majeure détectée lors de la phase de test.

## Conclusion
L'application remplit tous les critères du barème et des consignes. La performance est fluide et la persistance SQLite est opérationnelle.
