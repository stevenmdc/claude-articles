# PLAN - Upload Markdown Cote Client (Sans Persistance)

## Objectif
Permettre a l'utilisateur d'uploader un fichier `.md` depuis le navigateur, de lire son contenu uniquement en memoire (state React), puis de:
- afficher le markdown en live,
- generer une table des matieres dynamique (H1/H2/H3),
- ne rien ecrire en base, cookie, localStorage, ni serveur.

## Recommandations clefs
1. Conserver le mode actuel (articles depuis `content/articles`) comme fallback.
2. Ajouter un mode "uploaded article" en client-side via un contexte React global.
3. Ne pas persister les donnees uploadees entre sessions.
4. Deriver le TOC depuis le markdown upload (source unique), pas depuis une liste statique.
5. Utiliser `react-markdown` + `remark-gfm` pour le rendu cote client.

## Pourquoi cette approche est la bonne ici
- UX simple: upload > rendu immediat > TOC a jour.
- Zero complexite backend: aucun endpoint d'upload, aucune securite stockage a gerer.
- Conforme a ton besoin: session ephemere, pas de retention des contenus.
- Evolution facile: drag & drop natif ou `react-dropzone` ensuite, sans changer l'architecture.

## Architecture cible (adaptee a ton code actuel)

```text
app/
  layout.tsx                 # garde Navbar globale
  providers.tsx              # client provider (ArticleProvider)
  article/[slug]/page.tsx    # conserve rendu serveur existant
  reader/page.tsx            # nouvelle page lecteur markdown upload
context/
  ArticleContext.tsx         # state en memoire: { fileName, content, headings }
components/
  Navbar.tsx                 # input file (ou bouton qui ouvre un file input)
  UploadedMarkdown.tsx       # react-markdown + styles prose
  TableOfContents.tsx        # accepte chapters dynamiques
lib/
  parseMarkdown.ts           # extraction headings + slug d'ancre
```

## Etat global recommande

```ts
// shape conseillee
interface UploadedArticleState {
  fileName: string | null;
  content: string;
  headings: Array<{ id: string; depth: 1 | 2 | 3; title: string }>;
  source: "default" | "uploaded";
}
```

Notes:
- `source` permet de savoir si on rend un article fichier (`default`) ou un markdown upload (`uploaded`).
- Le state vit dans un provider client, monte dans `app/layout.tsx` via un composant `Providers`.

## Flux fonctionnel
1. L'utilisateur choisit un fichier `.md` dans la navbar.
2. Validation rapide: extension/type + taille max (ex: 1-2 MB).
3. Lecture via `File.text()` (plus simple que `FileReader` moderne).
4. Parsing headings (H1/H2/H3) via `parseMarkdown.ts`.
5. `setState({ fileName, content, headings, source: "uploaded" })`.
6. La page reader affiche le markdown et alimente `TableOfContents` avec les headings.

## Parsing du TOC (dynamique)
La regex brute est acceptable pour un MVP:

```ts
/^#{1,3}\s+(.+)$/gm
```

Mais recommande pour robustesse:
- ignorer les headings dans les blocs de code fences,
- nettoyer les marqueurs inline (backticks, emphasis) au minimum,
- generer un `id` stable type slug (`mon-titre`),
- dedoublonner les ids (`mon-titre-2`, `mon-titre-3`).

## Rendu Markdown
Installer:
- `react-markdown`
- `remark-gfm`

Rendu:
- composant client `UploadedMarkdown` recevant `content`.
- classes Tailwind `prose` (deja coherent avec ton projet).
- mapping optionnel des titres pour garantir les `id` d'ancre (via composants `h1/h2/h3`).

## Integration avec ton existant
1. `app/article/[slug]/page.tsx` reste intact pour les articles fichiers actuels.
2. Ajouter `app/reader/page.tsx` pour le mode upload en memoire.
3. `Navbar.tsx` ajoute un bouton `Upload .md` + input cache.
4. `TableOfContents.tsx` reutilise le format `chapters`, en mappant `headings -> chapters`.
5. Eviter d'afficher 2 TOC en meme temps: garder le TOC global vide par defaut, et injecter le TOC uniquement dans les pages qui ont du contenu navigable.

## UX minimum recommandee
- Etat vide: "Upload a markdown file to start reading".
- Etat charge: nom du fichier visible dans navbar ou sous-titre.
- Erreurs claires:
  - format invalide,
  - taille depassee,
  - fichier vide.
- Bouton `Clear` pour revenir a l'etat vide sans refresh.

## Securite et hygiene
- Pas de `dangerouslySetInnerHTML` pour le markdown upload.
- `react-markdown` limite deja les risques XSS compares a HTML brut.
- Ne pas evaluer de script, ne pas stocker le contenu.

## Performance
- Lire tout le fichier en texte suffit pour des docs classiques.
- Ajouter un plafond de taille (1-2 MB) pour eviter un freeze UI.
- `useMemo` pour recalcul headings uniquement quand `content` change.

## Plan d'implementation (ordre conseille)
1. Creer `context/ArticleContext.tsx` + provider client.
2. Ajouter `app/providers.tsx` et wrapper dans `app/layout.tsx`.
3. Creer `lib/parseMarkdown.ts` (headings + slug dedupe).
4. Ajouter upload dans `components/Navbar.tsx`.
5. Creer `app/reader/page.tsx` + `UploadedMarkdown.tsx`.
6. Brancher `TableOfContents` sur les headings dynamiques.
7. Ajouter messages d'etat/erreur + bouton clear.
8. Tester manuellement:
   - fichier valide,
   - fichier vide,
   - headings dupliques,
   - gros fichier,
   - navigation ancres + highlight TOC.

## Critere d'acceptation
- Upload `.md` fonctionne sans appel reseau.
- Le contenu est visible immediatement apres upload.
- TOC reflète exactement les H1/H2/H3 du fichier courant.
- Aucun stockage persistant du contenu.
- Refresh navigateur remet l'etat a vide (comportement attendu).

## Option bonus (non bloquante)
- Drag & drop natif sur la page reader.
- Ensuite seulement: `react-dropzone` si besoin d'une UX plus riche.
