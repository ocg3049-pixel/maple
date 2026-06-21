const fs = require('fs');
const src = '/tmp/DefaultGroup_backup.ui';
const dst = '/Users/florence/Desktop/ui/DefaultGroup.ui';

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dst);
  const stat = fs.statSync(dst);
  console.log('Restored! Size:', stat.size, 'bytes');
} else {
  console.log('Backup not found at', src);
}
