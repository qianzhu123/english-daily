const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
// cleanup: remove scratch _blk files from tools
['tools/_blk0.js', 'tools/_trblk.js', 'tools/_rvblk.js'].forEach(f => {
  try { fs.unlinkSync(dir + '/' + f); console.log('rm', f); } catch (e) {}
});
