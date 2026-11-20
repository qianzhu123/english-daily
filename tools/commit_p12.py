import io, subprocess, os, sys
repo = io.open('D:/english_repo.txt', encoding='utf8').read().strip()

def git(*args):
    r = subprocess.run(['git'] + list(args), cwd=repo, capture_output=True,
                       env={**os.environ, 'HTTPS_PROXY': 'http://127.0.0.1:7897'})
    return ((r.stdout or b'') + (r.stderr or b'')).decode('utf8', 'replace')

print(git('add', 'index.html', 'tools/'))
msg = """Overhaul reading page: minimal header, click-based phrase/fragment, batch publish button

- Header keeps only 复习/训练 (+ hidden 看往期); delete +词组/同步/导出/场景/更新下一批/🔑 buttons
- Delete 今日任务 block (TASKS + renderTask)
- Delete per-article 画重点句/重点片段 buttons: word click flow now handles both —
  marking a word twice starts selection; consecutive words = phrase, non-consecutive = sentence fragment (not period-bounded, may cross sentences)
- 读完了 only marks; when all current-batch articles are marked, a global 更新文章
  button appears (publishes next batch via draft flip, same as before)
- markDone auto-syncs silently (no manual 同步 step)
- Add accented "résumé" MANUAL entries; fix missing comma; fix 'broken' entry; drop dead #rate deps

Co-Authored-By: Claude Code <noreply@anthropic.com>"""
r = subprocess.run(['git', 'commit', '-m', msg], cwd=repo, capture_output=True)
print((r.stdout or b'').decode('utf8', 'replace'))
print((r.stderr or b'').decode('utf8', 'replace'))
print(git('push'))
