# affiliate/ — the US accounts

> **2026-09-06 — account A (`@cheapfixdaily` / Cheap Fix Daily) is gone.** The
> brand folder, its 20 rendered posts, its bucket media, its profile pictures and
> its playbook (`ACCOUNT-A-FINDS.md`) were deleted. Everything below that talks
> about "the four accounts" or "lane A" is the plan as it was written — only
> **Service Stack** (lane B) is live. Recover A from git history if it ever
> comes back.

A **sixth content line** in this repo, and the only one that is not a brand of
Carlos's. Two US-market accounts (TikTok + Instagram each) whose only purpose is
**affiliate revenue from organic reach**. No ads, ever.

Written in English because every word that ships — hooks, captions, bios — is
English. The five brand docs stay in Spanish.

| Doc | What it answers |
|---|---|
| [`STRATEGY.md`](STRATEGY.md) | Why these two lanes and not the others. The verified constraints, the funnel math, the kill/scale gates. Read once. |
| [`ACCOUNTS.md`](ACCOUNTS.md) | **The four accounts, one job each** — what each sells, what each is expected to earn, and the income levers above affiliate. |
| [`LESSONS-FROM-YOUR-DATA.md`](LESSONS-FROM-YOUR-DATA.md) | **Read before writing anything.** The rules extracted from your own 5 accounts' real numbers: sends, the separation/revelation frames, and the CTA that got 0 results in 12 tries. |
| [`FORMATS.md`](FORMATS.md) | Why IG carousels get <100 views, the daily warm-up habit, the carousel/video ladder per account, the CapCut-template workflow — and the two content ideas that were rejected, with the arithmetic. |
| [`SETUP.md`](SETUP.md) | **The step-by-step.** D0 → D30, both accounts, in order. This is the doc you work from. |
| [`ACCOUNT-B-STACK.md`](ACCOUNT-B-STACK.md) | Lane B playbook: same, for the AI-stack account. |
| [`PROGRAMS.md`](PROGRAMS.md) | Every offer: rate, cookie, payout rail, what paperwork it wants, join URL, status. |
| [`COMPLIANCE.md`](COMPLIANCE.md) | The rules that can kill an account or a program: FTC, image rights, AI labels, multi-account hygiene. |

## The two lanes in one line each

- **A · finds** — one household annoyance per carousel → the cheap thing that
  ends it. Photo-led. Temu affiliate. High reach ceiling, cents per click.
- **B · stack** — the one-person business stack: AI + automation for US
  freelancers and solo owners. Text-plate-led (this repo's render pipeline).
  Systeme.io + Hostinger + Fiverr. Lower reach, dollars per click, recurring.

## How it plugs into the existing pipeline

Lane B is the same machine as the five brands: `brands/<id>/posts/<serie>.json`
→ `tools/render.py` → `brands/<id>/out/<serie>/<post>/{ig,tt}` → the app. When
the handle is chosen, create the brand folder like any other:

```bash
mkdir -p brands/<id>/{posts,plates,plates_graded}
cp brands/diplomy/brand.json brands/<id>/brand.json   # English brand, closest base
cp brands/diplomy/plates/*.png brands/<id>/plates/    # re-graded below, new palette
$EDITOR brands/<id>/brand.json                        # palette + fonts + lang:"en"
python tools/grade.py && python tools/render.py && npm run prepare-assets
```

Plates are the GPT-generated backgrounds in `brands/<b>/plates/` (28 per brand,
graded onto the palette by `grade.py`). Reusing Diplomy's plates under a new
palette is the fast path; generate fresh ones only if the two accounts start
looking alike.

Lane A is **photo-led**, so most of its slides are real product photos, not
plates. Only the cover, the transition and the CTA slides come from the
renderer. See `ACCOUNT-B-STACK.md` § Slide template.

## Rules from the five brands: which carry over

Carry over: **cero falacias** (no invented figures, no fake studies, no
"the algorithm says"), the [hook standard](../brands/) via the `copy-carruseles`
skill, cold-audience framing, no recap slide, bullets not paragraphs.

**Do NOT carry over:**
- *"No prices in posts."* That rule protects Carlos's own products. Here the
  price **is** the hook ("under $15") and the FTC expects it to be accurate.
- *"No humor / no pop culture."* That is Radar Estatal only.
- Brand-voice rules from `brands/*/BRAND.md` — these two accounts are personas,
  not brands, and each has its own voice section in its playbook.

## Git

Same repo as the carousels (`elchale/posts-carrousels`), separate from CLIPPING.
Never mix an `affiliate/` commit with an engine commit.
