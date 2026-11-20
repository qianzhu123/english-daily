import io, subprocess, os
repo = io.open('D:/english_repo.txt', encoding='utf8').read().strip()

def git(*args):
    r = subprocess.run(['git'] + list(args), cwd=repo, capture_output=True,
                       env={**os.environ, 'HTTPS_PROXY': 'http://127.0.0.1:7897'})
    return ((r.stdout or b'') + (r.stderr or b'')).decode('utf8', 'replace')

print(git('add', 'training.html', 'tools/'))
msg = """Overhaul training page: submit-style quiz, separate vocab store, training calendar

- Quiz no longer reveals the answer on click: options select only, a 提交
  button grades each question (user 11-20)
- Remove TRAIN_KEYWORDS display entirely (wrong content, duplicated per question)
- Show full source articles (published on the training day) above the quiz —
  no more answer-only excerpts lowering difficulty
- Training vocab now uses its own store (vocab-train), separate from reading;
  the sidebar reads that store; sidebar element actually exists now
- Add 📅 看往期: a training-only calendar of past training days, click a date
  to open that day's training
- Delete 导出作答 button

Co-Authored-By: Claude Code <noreply@anthropic.com>"""
r = subprocess.run(['git', 'commit', '-m', msg], cwd=repo, capture_output=True)
print((r.stdout or b'').decode('utf8', 'replace'))
print((r.stderr or b'').decode('utf8', 'replace'))
print(git('push'))
