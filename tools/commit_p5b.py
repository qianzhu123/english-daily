import io, subprocess, os
repo = io.open('D:/english_repo.txt', encoding='utf8').read().strip()

def git(*args):
    r = subprocess.run(['git'] + list(args), cwd=repo, capture_output=True,
                       env={**os.environ, 'HTTPS_PROXY': 'http://127.0.0.1:7897'})
    return ((r.stdout or b'') + (r.stderr or b'')).decode('utf8', 'replace')

print(git('add', 'training.html'))
msg = """Training page: purge dead TRAIN_KEYWORDS object and exportAnswers function

Both lost their call sites in f42ceeb but the bodies survived; the 46KB
keyword object shipped to users for nothing. Sidebar functions restored after
an overzealous cut, verified by vm run.

Co-Authored-By: Claude Code <noreply@anthropic.com>"""
r = subprocess.run(['git', 'commit', '-m', msg], cwd=repo, capture_output=True)
print((r.stdout or b'').decode('utf8', 'replace'))
print((r.stderr or b'').decode('utf8', 'replace'))
print(git('push'))
