# Strategy — why these two lanes

Decided 2026-08-16. Everything here was re-verified against live sources on that
date; the ones that pin a decision are linked at the bottom.

## The constraints that actually decide this

| Constraint | Verified state | What it kills |
|---|---|---|
| No US SSN / ITIN / EIN, no US bank | TikTok Shop's affiliate side requires a **US-based creator** with US ID and US bank. The "LLC + EIN" workaround circulating online is for **sellers**, not creators. | TikTok Shop affiliate — the single best-paying organic play on TikTok. Gone. Plan around it. |
| No tax registration in any country | Systeme.io, Hostinger, Fiverr, Temu pay an **individual via PayPal** with no W-9/W-8 and no company. Amazon requires a tax interview. | Nothing, if the offers are chosen from the PayPal set. |
| Peru ↔ US: **no income tax treaty** | Amazon withholds **up to 30%** from non-US associates unless a treaty applies. Peru has none, so W-8BEN buys no reduction. | Amazon's economics. 3% commission × 0.70 = ~2.1% net. |
| Amazon image rules | Listing photos may **not** be downloaded and re-uploaded; images must come through Amazon's own tools/API. | An "Amazon finds" carousel account you can mass-produce. You'd have to buy and shoot every product. |
| TikTok personal accounts | Clickable bio link at **1,000 followers**. Business accounts now need business-doc verification (May 2026) → not an option. | Direct TikTok→offer conversion in month 1. Everything routes through Instagram, which has a link from day one. |
| Format | Photo carousels: ~81% higher engagement and 82% more likes than comparable video across a 698k-post sample; video still wins raw plays (~+7%). Saves are weighted heavily in distribution. | The excuse not to use carousels. They're fine — they just monetize through saves and profile visits, not through link clicks in-feed. |

## Why lane A is Temu-first and not Amazon-first

Amazon looks like the obvious "finds" program and is the wrong one here:

- **Images.** Temu's affiliate dashboard ships an Asset Center of creatives
  meant to be posted; Amazon's agreement forbids the equivalent. With no US
  address after Raleigh, "buy it and shoot it" is not a system that survives the
  flight home.
- **Money.** Amazon: 3–4.5%, minus 30% withholding, on a $15 item ≈ **$0.32**.
  Temu: 5–30% depending on category and referral bonuses, PayPal, no withholding
  ≈ **$1–4** on the same basket, plus new-user referral bonuses.
- **Paperwork.** Amazon: tax interview + Payoneer USD account + 3 qualifying
  sales in 180 days or the account closes. Temu: an email and a PayPal.

Amazon stays in `PROGRAMS.md` as a **phase-2 option**, because its *trust* with a
US audience is unmatched and a mature account converts better on it. Add it once
the account is real (D30+), not at launch.

## Why lane B exists at all, given it will get less reach

Because reach is not revenue. Rough per-1,000-views yields for cold US organic:

| Lane | Clicks per 1k views | $ per conversion | $ per 1k views |
|---|---|---|---|
| A · finds (Temu) | 1–5 (via profile → IG → link) | $1–4 | **$0.05–0.60** |
| B · stack (Systeme.io / Hostinger / Fiverr) | 0.5–3 | $15–80 **+ recurring** | **$0.30–4.00** |

Lane B needs 5–10× fewer views for the same money, and its Systeme.io
commissions are **lifetime recurring** — the only line item here that compounds
while you sleep. Lane A is the lottery ticket with the bigger top end; lane B is
the one that pays rent if it works at all.

They also fail differently, which is the real reason to run both: lane A dies of
low commissions, lane B dies of low reach. One diagnosis does not condemn both.

## The funnel, honestly

```
TikTok views
  → 1–3% visit the profile
    → (no clickable link under 1k followers)
      → some fraction goes to the IG in the bio text  ← the leak, 70–90% lost
        → 5–15% of IG profile visits tap the link
          → 1–3% convert on a free/cheap offer, <1% on anything with a card
```

Consequences, and they drive every step in `SETUP.md`:

1. **Instagram is the cash register, TikTok is the crowd.** Post everything to
   both. The IG bio link is live from day one.
2. **Get to 1,000 TikTok followers as the primary month-1 goal**, not views.
   A follow is what survives the leak.
3. **Capture email.** The bio page's first job is a free download in exchange
   for an address. Email is the only asset that isn't rented from an algorithm.
4. **Pinned comment on every TikTok post** carrying the IG handle in text, since
   the bio link isn't available.

## Realistic expectations

Posting 3 carousels/day per account, starting from zero, no ads:

| | Month 1 | Month 2 | Month 3 |
|---|---|---|---|
| Views/account | 3k–50k (one breakout can make it 300k) | 20k–200k | 50k–500k |
| Followers | 100–1,200 | 500–5,000 | 1k–15k |
| Revenue, both accounts | **$0–50** | $30–250 | $100–700 |

Odds that either account clears **$500/month by mid-November**: about **1 in 4**.
Odds both do: under 1 in 10. Odds of $0 after three months of real work: roughly
1 in 3. Those are the honest numbers for organic affiliate from a standing
start; anyone quoting better is selling a course.

The upside case is not the affiliate commission — it's that a 20k-follower US
account in either niche becomes an asset (brand deals, your own $19 product at
100% margin, a list you own).

**Per-account numbers, and the ceiling above these, live in
[`ACCOUNTS.md`](ACCOUNTS.md).** Short version: affiliate is the floor. The
highest-paying line these accounts can carry is selling *services* to the
audience — UGC on lane A, automation builds on lane B — which pays 6–10× per
conversion and, being foreign-source income, carries no US withholding at all.
Add it at D30, never at launch.

## Kill / scale gates

Check on D14, D30, D45. Do not "wait a bit more" past a gate.

- **D14 · nothing above 1,000 views on any post, either account** → the hook is
  the problem, not the niche. Rewrite hooks with the `copy-carruseles` filters,
  keep the niche 2 more weeks.
- **D30 · under 300 followers** → change format, not niche: A goes photo-first
  with a face/hands in frame, B goes single-topic deep instead of listicles.
- **D30 · one account at 3× the other's views** → shift the daily budget 4:2
  posts toward the winner. Do not abandon the loser; it costs 20 minutes.
- **Bio-link CTR under 0.1% at 50k+ weekly views** → the CTA slide is broken,
  not the offer.
- **Conversion under 0.5% on a free-tier offer** → swap the offer, keep the
  content.
- **First $500 of recurring MRR from one program** → drop everything one-time
  and rebuild both accounts around that program's audience.
- **Either account throttled (views collapse >80% for 5+ days with no policy
  strike)** → stop posting there for 3 days, then resume at 1/day with fresh
  templates. Do not open a third account to escape it.

## Sources

- [TikTok Shop creator eligibility (US-based requirement)](https://seller-us.tiktok.com/university/essay?knowledge_id=6939143037667118&lang=en) · [non-US workaround is seller-side](https://hooc.ai/blog/en/how-non-us-residents-start-tiktok-shop-affiliate)
- [Amazon Associates Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) · [image sourcing rules](https://getlasso.co/can-i-use-amazon-product-images-on-my-affiliate-website/)
- [Amazon withholding for non-US associates](https://affiliate-program.amazon.com/help/node/topic/GPFZ6W6CF4E5BD9V) · [W-8BEN treaty benefits](https://www.irs.gov/instructions/iw8ben)
- [Payoneer USD account as Amazon direct deposit](https://www.latestonnet.com/receive-amazon-affiliates-earnings-via-payoneer/)
- [Temu affiliate FAQ — who can join, 80+ countries, Asset Center](https://www.temu.com/affiliate_question.html) · [rates/payouts](https://www.admitad.com/blog/temu-affiliate-program/)
- [Systeme.io affiliate — 60% lifetime, PayPal, instant](https://systeme.io/affiliate-program) · [terms review](https://thehonestaffiliate.com/blog/systeme-io-affiliate-program)
- [Fiverr commission plans](https://help-partnerships.fiverr.com/hc/en-us/articles/12994521796113-Commission-plans)
- [TikTok bio link requirements 2026](https://stan.store/blog/tiktok-link-bio-requirements-2026-guide/)
- [Carousel vs video engagement data](https://reelbase.io/blog/tiktok-photo-mode-algorithm-explained) · [TikTok slideshow specs](https://wavegen.ai/tiktok-slideshow-size)
