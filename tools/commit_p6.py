import io, subprocess, os
repo = io.open('D:/english_repo.txt', encoding='utf8').read().strip()

def git(*args):
    r = subprocess.run(['git'] + list(args), cwd=repo, capture_output=True,
                       env={**os.environ, 'HTTPS_PROXY': 'http://127.0.0.1:7897'})
    return ((r.stdout or b'') + (r.stderr or b'')).decode('utf8', 'replace')

print(git('add', 'review/index.html', 'tools/'))
msg = """Review page: regroup by article with publish dates, full article with original marks

- Day grouping is now keyed to each article's publish date, not the day the
  word was clicked (user 11-20: reading the 19th's articles on the 20th must
  show the 19th)
- Day view order per article: 单词 → 词组 → 重点片段 → 语法点 → 完整文章,
  then the next article; phrase keys (multi-word) are listed separately from
  single words
- 完整文章 reproduces the reading page's original marks: vocabulary
  highlights and fragment highlights are re-applied on the review text
- Word rows show the article's publish date tag

Co-Authored-By: Claude Code <noreply@anthropic.com>"""
r = subprocess.run(['git', 'commit', '-m', msg], cwd=repo, capture_output=True)
print((r.stdout or b'').decode('utf8', 'replace'))
print((r.stderr or b'').decode('utf8', 'replace'))
print(git('push'))
