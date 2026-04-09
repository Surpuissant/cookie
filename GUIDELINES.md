# Coding Guidelines

## Naming Conventions
- **Files**: Lowercase with hyphens (e.g., `user-controller.js`).
- **Variables/Functions**: CamelCase (e.g., `scoreCount`).
- **Classes**: PascalCase (e.g., `DatabaseManager`).
- **CSS Classes**: Kebab-case (e.g., `cookie-container`).

## Project Organization
- `src/server/`: Backend logic (Express, database).
- `src/client/`: Frontend logic (JS).
- `public/`: Static assets (CSS, images).
- `views/`: EJS templates.
- `tests/`: All tests.

## Style Rules
- Use ES Modules (`import`/`export`).
- Use `const` and `let`, avoid `var`.
- Use template literals for string concatenation.
- Use arrow functions for callbacks.

## Best Practices
- Keep components small and focused.
- All business logic should be unit tested.
- Use descriptive commit messages.
- Always use a feature branch for new developments.
