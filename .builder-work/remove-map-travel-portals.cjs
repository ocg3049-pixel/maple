const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const { MapBuilder } = require(path.join(root, '.agents/skills/msw-general/scripts/map/msw_map_builder.cjs'));
const portalType = 'MOD.Core.PortalComponent';
const targets = [];
const files = fs.readdirSync(path.join(root, 'map')).filter(f => f.endsWith('.map'));
for (const name of files) {
  const file = path.join(root, 'map', name);
  const b = MapBuilder.read(file);
  assert.equal(b.getTileMapMode(), 0, 'unexpected map mode: ' + name);
  const all = b.listEntities();
  const portals = all.filter(e => b.component(e.path, portalType));
  if (!portals.length) continue;
  // All existing portals are top-level travel gateways, with no destination-ref
  // links for same-map transport and no children (verified against the live census).
  for (const e of portals) {
    assert.equal(e.path.split('/').length, 4, 'nested portal needs manual review');
    assert.ok(!b.component(e.path, portalType).PortalEntityRef, 'linked portal needs manual review');
    assert.ok(!all.some(x => x.path.startsWith(e.path + '/')), 'portal has children');
  }
  targets.push({name, file, b, portals});
}
const count = targets.reduce((sum, x) => sum + x.portals.length, 0);
if (!count) {
  console.log('[PortalRemoval] All ' + files.length + ' maps already have no travel portals.');
  process.exit(0);
}
assert.equal(count, 285, 'portal census changed; inspect before removal');
const backup = fs.mkdtempSync(path.join(root, '.builder-work', 'portal-backup-'));
// Finish every backup before deleting the first entity. Copies preserve all
// pre-existing terrain/user edits and permit whole-map recovery if requested.
for (const item of targets) fs.copyFileSync(item.file, path.join(backup, item.name));
for (const item of targets) {
  const removed = new Set(item.portals.map(e => e.path));
  const keep = item.b.listEntities().filter(e => !removed.has(e.path)).map(e => [e.path, item.b.find(e.path)]);
  for (const e of item.portals) item.b.remove(e.path);
  item.b.write(item.file);
  const check = MapBuilder.read(item.file);
  assert.equal(check.getTileMapMode(), 0);
  assert.equal(check.listEntities().length, keep.length);
  for (const [p, record] of keep) assert.deepEqual(check.find(p), record, 'non-portal changed: ' + p);
  assert.ok(check.listEntities().every(e => !check.component(e.path, portalType)));
}
console.log('[PortalRemoval] Removed ' + count + ' portals in ' + targets.length + '/' + files.length + ' maps. All other entities unchanged.');
console.log('[PortalRemoval] Recoverable backup: ' + backup);
