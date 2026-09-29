# The Artist Salon (theartistsalon)

Source of truth lives OUTSIDE this repo, in `CLIPPING/pod_store/ig/` (research, photos, the
renderer `pod_store/tools/render_ig.py`, validator `pod_store/tools/validate_ig.cjs`).
This folder only mirrors what the app needs: `posts/<mes>.json` (copy + captions) and the renders
in `out/` (gitignored, served from the bucket). To update: edit + render in pod_store, then copy
`pod_store/ig/posts/<mes>.json` here and `pod_store/ig/out/<mes>` to `out/`, then the usual
publish pipeline (build-index → upload-media → MEDIA_BASE build-index → commit).

English, US audience. Brand book: `pod_store/BRAND.md`.
