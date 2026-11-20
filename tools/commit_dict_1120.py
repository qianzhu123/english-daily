# -*- coding: utf-8 -*-
import subprocess, io
repo = io.open("D:/english_repo.txt", encoding="utf8").read().strip()

def git(*args):
    r = subprocess.run(["git"] + list(args), cwd=repo, capture_output=True)
    return ((r.stdout or b"") + (r.stderr or b"")).decode("utf8", "replace")

print(git("add", "index.html", "review/index.html"))
msg = """Expand MANUAL dictionary to 1780/1702 entries covering all content words

Pre-written in-article translations for every content word across all 46
articles, eliminating online-translate fallbacks. Bump TVER to v16 to
invalidate users cached bad translations. Fix review MANUAL seam comma.

Co-Authored-By: Claude Code <noreply@anthropic.com>"""
r = subprocess.run(["git", "commit", "-m", msg], cwd=repo, capture_output=True)
print((r.stdout or b"").decode("utf8", "replace"))
print((r.stderr or b"").decode("utf8", "replace"))
print(git("push"))
