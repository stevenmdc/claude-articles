# 📋 Codex CLI — Prompt Guide

Comparaison des prompts pour la génération de pages Next.js avec Codex CLI.

---

## Table de comparaison : Prompt Basique vs Prompt Optimisé

| Critère | ❌ Prompt Basique | ✅ Prompt Optimisé |
|---|---|---|
| **Contexte du projet** | Implicite / absent | Explicite (`/app/table`, Next.js, stack) |
| **Cohérence UI** | Mentionnée vaguement | Référencée avec page cible (`pricing`) + token système |
| **Contrainte layout** | `max-w-5xl` mentionné | `max-w-5xl` + espacements + typographie existante |
| **Liste des composants** | Absente | Fichiers nommés + arborescence définie |
| **Fonctionnalités** | Listées en vrac | Numérotées, priorisées, détaillées |
| **Gestion des colonnes** | "modifier / supprimer columns" | Rename, reorder, show/hide, delete + typed props |
| **Gestion des lignes** | "modifier / supprimer rows" | Inline edit, duplicate, delete + confirmation modal |
| **Bulk actions** | Non mentionné | Select all, delete selected, export |
| **TypeScript** | Non précisé | Strict mode + types explicites |
| **UI Library** | Non précisé | Auto-détection (shadcn/ui, Radix, etc.) |
| **Données** | Non précisé | Mock data + prop `data` exposée pour intégration future |
| **Accessibilité** | Absente | ARIA labels + navigation clavier |
| **Résultat attendu** | Ambigu | Fichiers générés définis à l'avance |

---

## Structure de composants générée

| Fichier | Rôle |
|---|---|
| `app/table/page.tsx` | Page principale, orchestration |
| `components/table/TableView.tsx` | Rendu principal du table |
| `components/table/TableSettings.tsx` | Panneau / modal de paramètres |
| `components/table/ColumnManager.tsx` | CRUD des colonnes |
| `components/table/RowActions.tsx` | Menu d'actions par ligne |
| `components/table/BulkActionBar.tsx` | Barre d'actions groupées |

---

## Checklist avant d'envoyer un prompt à Codex CLI

| # | Vérification | OK ? |
|---|---|---|
| 1 | Le répertoire cible est précisé | ☐ |
| 2 | Le framework / stack est mentionné | ☐ |
| 3 | Une page existante sert de référence UI | ☐ |
| 4 | Les composants à créer sont listés | ☐ |
| 5 | Les fonctionnalités sont numérotées | ☐ |
| 6 | Le mode TypeScript est précisé | ☐ |
| 7 | La gestion des données est clarifiée (mock / prop / API) | ☐ |
| 8 | Les contraintes de layout sont explicites | ☐ |
| 9 | L'accessibilité est demandée | ☐ |
| 10 | Aucune dépendance externe non installée n'est supposée | ☐ |

---

*Généré avec Claude — Mars 2026*
