import io, subprocess, os
repo = io.open('D:/english_repo.txt', encoding='utf8').read().strip()

def git(*args):
    r = subprocess.run(['git'] + list(args), cwd=repo, capture_output=True,
                       env={**os.environ, 'HTTPS_PROXY': 'http://127.0.0.1:7897'})
    return ((r.stdout or b'') + (r.stderr or b'')).decode('utf8', 'replace')

print(git('add', 'training.html', 'tools/'))
msg = """Training: quiz shows its own passage once, never reading articles

Misread the 11-20 request as "show the day's reading articles in full" -
user meant each quiz's own passage text. Remove the reading-article block
entirely (training content stays independent of reading batches, user 11-21),
group quiz items by their shared passage, and render that passage once per
group with its questions beneath. articles.js include dropped from the
training page.

Co-Authored-By: Claude Code <noreply@anthropic.com>"""
r = subprocess.run(['git', 'commit', '-m', msg], cwd=repo, capture_output=True)
print((r.stdout or b'').decode('utf8', 'replace'))
print((r.stderr or b'').decode('utf8', 'replace'))
print(git('push'))
