# Fonts — drop them here

This folder needs the self-hosted brand font files. The CSS in `src/index.css`
expects these exact filenames:

```
ibm-plex-arabic-400.woff2
ibm-plex-arabic-600.woff2
ibm-plex-arabic-700.woff2
cormorant-garamond-500.woff2
cormorant-garamond-600.woff2
inter-400.woff2
inter-500.woff2
inter-600.woff2
inter-700.woff2
```

## Where to get them (all free, open source)

### IBM Plex Arabic
1. Visit <https://github.com/IBM/plex/tree/master/IBM-Plex-Sans-Arabic>
2. Download the WOFF2 files for weights 400, 600, 700
3. Rename them to match the filenames above

OR use Fontsource (easier):
```bash
npm install @fontsource/ibm-plex-sans-arabic
```
Then copy the WOFF2 files from `node_modules/@fontsource/ibm-plex-sans-arabic/files/` into this folder.

### Cormorant Garamond
1. Visit <https://github.com/CatharsisFonts/Cormorant>
2. Download Cormorant Garamond weights 500 and 600 (or use Fontsource)

OR:
```bash
npm install @fontsource/cormorant-garamond
```

### Inter
1. Visit <https://github.com/rsms/inter/releases>
2. Download weights 400, 500, 600, 700

OR:
```bash
npm install @fontsource/inter
```

## Why self-host?

- **Speed:** No third-party DNS lookup → faster Saudi load times
- **Privacy:** No Google Fonts tracking → GDPR / Saudi PDPL compliant
- **Reliability:** No external CDN outage can break your site
- **Consistency:** Exact same fonts in dev + prod

## After adding fonts

1. Restart `npm run dev`
2. Inspect Network tab — should see `200 OK` on `/fonts/*.woff2`
3. Inspect any page — text should render in the proper brand font
