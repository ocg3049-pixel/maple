// Receive a short-lived upload URL through stdin, never argv or logs.
const fs = require('node:fs/promises');
let pending = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async chunk => {
  pending += chunk;
  if (!pending.includes('\n')) return;
  process.stdin.pause();
  const url = pending.trim();
  pending = '';
  try {
    const data = await fs.readFile(process.argv[2]);
    const res = await fetch(url, {method:'PUT', body:data});
    console.log('Upload HTTP ' + res.status);
    process.exit(res.ok ? 0 : 1);
  } catch {
    console.error('Upload failed');
    process.exit(1);
  }
});
