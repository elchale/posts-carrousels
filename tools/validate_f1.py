"""Validate an F1 series JSON against the ronda-6 budgets (SKILL.md).

Usage: python tools/validate_f1.py <brand> <series>
Exit 1 if any hard rule fails. Warnings don't fail.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ACC = re.compile(r"\*([^*]+)\*")


def clen(s: str) -> int:
    return len(ACC.sub(r"\1", s or ""))


def main() -> int:
    brand, series = sys.argv[1], sys.argv[2]
    p = ROOT / "brands" / brand / "posts" / f"{series}.json"
    data = json.loads(p.read_text(encoding="utf-8"))
    errs, warns = [], []
    if data.get("format") != "f1":
        errs.append("series is not format:f1")
    for post in data.get("posts", []):
        slug = post.get("slug", "?")
        slides = post.get("slides", [])
        roles = [s.get("role") for s in slides]
        if roles.count("cover") != 1 or roles[0] != "cover":
            errs.append(f"{slug}: first slide must be the single cover")
        if roles.count("closer") != 1 or roles[-1] != "closer":
            errs.append(f"{slug}: last slide must be the single closer")
        if not 4 <= len(slides) <= 7:
            warns.append(f"{slug}: {len(slides)} slides (target 6)")
        for i, s in enumerate(slides):
            h, b, lab = s.get("h", ""), s.get("b", ""), s.get("label", "")
            nacc = len(ACC.findall(h)) + len(ACC.findall(b)) + len(ACC.findall(lab))
            if nacc > 1:
                errs.append(f"{slug}#{i+1}: {nacc} accent spans (max 1)")
            if s.get("role") == "cover":
                if not s.get("photo"):
                    errs.append(f"{slug}#1: cover needs a photo")
                if not 20 <= clen(h) <= 70:
                    errs.append(f"{slug}#1: cover h {clen(h)} chars (26-66)")
            elif s.get("role") == "value":
                tot = clen(lab) + clen(h) + clen(b)
                if tot > 90:
                    errs.append(f"{slug}#{i+1}: {tot} chars (interior cap 90, target 75)")
                elif tot > 75:
                    warns.append(f"{slug}#{i+1}: {tot} chars (target 75)")
            if s.get("emoji"):
                errs.append(f"{slug}#{i+1}: emoji field is dead in F1")
            for field in (h, b):
                if re.search(r"[—–]| - ", field or ""):
                    errs.append(f"{slug}#{i+1}: dash in slide text")
        cap = post.get("caption", {})
        for k in ("ig", "tt"):
            c = cap.get(k, "")
            tags = re.findall(r"#\w+", c)
            limit = 3 if k == "ig" else 2
            if len(tags) > limit:
                errs.append(f"{slug}: {len(tags)} hashtags in {k} (max {limit})")
            if re.search(r"dale like|un like|likea", c, re.I):
                errs.append(f"{slug}: caption {k} asks for likes")
            ctas = sum(bool(re.search(pat, c, re.I)) for pat in
                       (r"gu[aá]rda", r"m[aá]ndaselo|env[ií]aselo|comp[aá]rte", r"\?"))
            if ctas > 1:
                warns.append(f"{slug}: caption {k} has {ctas} CTAs (want 1)")
        if not cap.get("ig") or not cap.get("tt"):
            errs.append(f"{slug}: missing ig/tt caption")
    for w in warns:
        print("WARN", w)
    for e in errs:
        print("ERR ", e)
    print(f"{brand}/{series}: {len(data.get('posts', []))} posts, {len(errs)} errors, {len(warns)} warnings")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
