# Test Upload Markdown

Ce fichier sert a tester le reader `.md` cote client.

## Introduction

Si tu vois cette section dans le TOC, l'extraction de headings fonctionne.

### Objectif

Verifier:
- upload local
- rendu markdown
- TOC dynamique

## Introduction

Ce titre est volontairement duplique pour tester le dedoublonnage des ancres.

### Checklist

- [x] Item complete
- [ ] Item pending

## Table GFM

| Feature | Status |
| --- | --- |
| Upload | OK |
| TOC | OK |
| Render | OK |

## Bloc de code

```md
## Ce heading ne doit PAS apparaitre dans le TOC
### Idem ici
```

## Liens

- [Next.js](https://nextjs.org/)
- [Markdown Guide](https://www.markdownguide.org/)

