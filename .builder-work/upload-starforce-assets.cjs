// Signed upload URLs arrive through stdin and are never logged or persisted.
const fs = require('node:fs/promises');
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async chunk => {
  input += chunk;
  if (!input.includes('\n')) return;
  process.stdin.pause();
  const jobs = JSON.parse(input);
  let cursor = 0;
  let failed = false;
  await Promise.all(Array.from({length: 3}, async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      try {
        const data = await fs.readFile(job.path);
        const response = await fetch(job.url, {method: 'PUT', body: data});
        console.log(JSON.stringify({name: job.name, status: response.status}));
        if (!response.ok) failed = true;
      } catch {
        failed = true;
        console.log(JSON.stringify({name: job.name, status: 'network-error'}));
      }
    }
  }));
  process.exit(failed ? 1 : 0);
});
