import io, subprocess, os
repo = io.open('D:/english_repo.txt', encoding='utf8').read().strip()

def git(*args):
    r = subprocess.run(['git'] + list(args), cwd=repo, capture_output=True,
                       env={**os.environ, 'HTTPS_PROXY': 'http://127.0.0.1:7897'})
    return ((r.stdout or b'') + (r.stderr or b'')).decode('utf8', 'replace')

print(git('add', 'index.html', 'tools/'))
msg = """Reading page: apply header cleanup that failed to persist in d0909c3

The d0909c3 commit carried the JS logic but the header/meta HTML replacement
was lost to a mid-script exit. Reapply: header keeps only 复习/训练 (+ hidden
看往期), #pubbar container present, article-meta and vpanel phrase buttons
already removed earlier.

Co-Authored-By: Claude Code <noreply@anthropic.com>"""
r = subprocess.run(['git', 'commit', '-m', msg], cwd=repo, capture_output=True)
print((r.stdout or b'').decode('utf8', 'replace'))
print((r.stderr or b'').decode('utf8', 'replace'))
print(git('push'))
