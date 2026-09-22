// Repair only the touching/overlapping custom road pieces, never tile artwork.
// Foothold re-chaining is a MapBuilder coverage gap; serialized fields were
// verified against Maker's saved data and are patched through MapBuilder.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const {MapBuilder} = require(path.join(root,'.agents/skills/msw-general/scripts/map/msw_map_builder.cjs'));
const T='MOD.Core.TransformComponent', S='MOD.Core.SpriteRendererComponent';
const C='MOD.Core.CustomFootholdComponent', F='MOD.Core.FootholdComponent';
const copy=x=>structuredClone(x), rounded=n=>Math.round(n*1000000)/1000000;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const base=MapBuilder.read(path.join(root,'map/101020200.map'));
const roadRuids=new Set(base.listEntities().filter(e=>e.componentNames.includes(C)).map(e=>base.component(e.name,S).SpriteRUID));
const write=process.argv.includes('--write');
const selected=process.argv.find(x=>/^\d{9}$/.test(x));
const reports=[];
for(const file of fs.readdirSync(path.join(root,'map')).filter(n=>/^\d+\.map$/.test(n))) {
  if(selected && file!==selected+'.map') continue;
  const mb=MapBuilder.read(path.join(root,'map',file)), mapName=file.slice(0,-4);
  if(mb.getTileMapMode()!==0) continue;
  const original=copy(mb.component(mapName,F));
  if(!original) continue;
  const all=Object.values(original.FootholdsByLayer||{}).flat();
  const pieces=[];
  for(const e of mb.listEntities().filter(e=>e.componentNames.includes(C))) {
    const sr=mb.component(e.name,S), tf=mb.component(e.name,T), cf=mb.component(e.name,C);
    if(!sr || !roadRuids.has(sr.SpriteRUID) || cf.IsDynamicFoothold || cf.Enable===false) continue;
    if(e.path.split('/').length!==4 || Math.abs(tf.ZRotation||0)>1e-6) continue;
    const sx=tf.Scale.x*(sr.FlipX?-1:1), sy=tf.Scale.y*(sr.FlipY?-1:1);
    if(!sx || !sy) continue;
    for(let edge=0;edge<(cf.edgeLists||[]).length;edge++) {
      let points=cf.edgeLists[edge].map(p=>({x:rounded(tf.Position.x+p.x*sx),y:rounded(tf.Position.y+p.y*sy)}));
      if(points.length<2) continue;
      if(points[0].x>points.at(-1).x) points.reverse();
      if(points.some((p,i)=>i && p.x<=points[i-1].x)) continue;
      const old=all.filter(f=>f.OwnerId===e.id && points.some((p,i)=>i<points.length-1 && distance(p,f.StartPoint)<.0001 && distance(points[i+1],f.EndPoint)<.0001));
      if(old.length!==points.length-1) continue;
      old.sort((a,b)=>a.StartPoint.x-b.StartPoint.x);
      pieces.push({e,tf,sr,cf,edge,sx,sy,points,old,layer:old[0].layer,prev:null,next:null,changed:false});
    }
  }
  function yAt(p,x) {
    if(x<=p[0].x) return p[0].y;
    if(x>=p.at(-1).x) return p.at(-1).y;
    for(let i=1;i<p.length;i++) if(x<=p[i].x) return p[i-1].y+(p[i].y-p[i-1].y)*(x-p[i-1].x)/(p[i].x-p[i-1].x);
  }
  const candidates=[];
  for(const a of pieces) for(const b of pieces) {
    if(a===b || a.layer!==b.layer || a.e.id===b.e.id) continue;
    if(b.points[0].x<=a.points[0].x || b.points.at(-1).x<=a.points.at(-1).x) continue;
    const gap=b.points[0].x-a.points.at(-1).x;
    // Only visible road seams: <=12px gap or <=85px of overlapping artwork.
    if(gap>.12 || gap<-.85) continue;
    const x=(b.points[0].x+a.points.at(-1).x)/2;
    const ay=yAt(a.points,x), by=yAt(b.points,x);
    if(Math.abs(ay-by)>.16) continue;
    candidates.push({a,b,x:rounded(x),y:rounded((ay+by)/2),score:Math.abs(ay-by)*10+Math.abs(gap)});
  }
  candidates.sort((a,b)=>a.score-b.score);
  const seams=[];
  for(const c of candidates) {
    if(c.a.next || c.b.prev) continue;
    const join={x:c.x,y:c.y};
    const ap=c.a.points.filter(p=>p.x<c.x-1e-6).concat([join]);
    const bp=[join].concat(c.b.points.filter(p=>p.x>c.x+1e-6));
    if(ap.length<2 || bp.length<2) continue;
    const needsRepair=distance(c.a.points.at(-1),join)>.00001 || distance(c.b.points[0],join)>.00001
      || c.a.old.at(-1).NextFootholdId!==c.b.old[0].Id || c.b.old[0].PreviousFootholdId!==c.a.old.at(-1).Id;
    c.a.points=ap;c.b.points=bp;c.a.next=c.b;c.b.prev=c.a;
    if(needsRepair) c.a.changed=c.b.changed=true;
    seams.push({left:c.a.e.name,right:c.b.e.name,at:join});
  }
  // Keep the complete connected route consistent, including already-welded ends.
  for(const p of pieces.filter(p=>p.changed)) {
    for(let q=p.prev;q;q=q.prev) q.changed=true;
    for(let q=p.next;q;q=q.next) q.changed=true;
  }
  const changed=pieces.filter(p=>p.changed);
  if(!changed.length) continue;
  const replacedIds=new Set(changed.flatMap(p=>p.old.map(f=>f.Id)));
  let nextId=Math.max(...all.map(f=>f.Id))+1;
  const generated=[];
  for(const p of changed) {
    p.generated=[];
    for(let i=1;i<p.points.length;i++) {
      const f=copy(p.old[Math.min(i-1,p.old.length-1)]);
      f.Id=i<=p.old.length?p.old[i-1].Id:nextId++;
      f.StartPoint=copy(p.points[i-1]);f.EndPoint=copy(p.points[i]);
      f.Length=distance(f.StartPoint,f.EndPoint);
      assert.ok(f.Length>.00001);
      f.Variance={x:(f.EndPoint.x-f.StartPoint.x)/f.Length,y:(f.EndPoint.y-f.StartPoint.y)/f.Length};
      f.PreviousFootholdId=0;f.NextFootholdId=0;
      p.generated.push(f);generated.push(f);
    }
    const edgeLists=copy(mb.component(p.e.name,C).edgeLists);
    let local=p.points.map(v=>({x:rounded((v.x-p.tf.Position.x)/p.sx),y:rounded((v.y-p.tf.Position.y)/p.sy)}));
    if(p.sx<0) local.reverse();
    edgeLists[p.edge]=local;
    mb.patchComponent(p.e.name,C,{edgeLists});
  }
  for(const p of changed) {
    for(let i=0;i<p.generated.length;i++) {
      const f=p.generated[i];
      f.PreviousFootholdId=i?p.generated[i-1].Id:(p.prev?.generated?.at(-1)?.Id||0);
      f.NextFootholdId=i+1<p.generated.length?p.generated[i+1].Id:(p.next?.generated?.[0]?.Id||0);
    }
  }
  const result=all.filter(f=>!replacedIds.has(f.Id)).concat(generated);
  const ids=new Map(result.map(f=>[f.Id,f]));
  // Remove stale connections into replaced pieces; preserve unrelated geometry.
  for(const f of result) {
    if(!generated.includes(f)) {
      if(replacedIds.has(f.NextFootholdId)) f.NextFootholdId=0;
      if(replacedIds.has(f.PreviousFootholdId)) f.PreviousFootholdId=0;
    }
  }
  // Join exact exposed endpoints to retained paths (including tile-built roads).
  for(const f of generated) {
    if(!f.PreviousFootholdId) {
      const prev=result.find(g=>g.Id!==f.Id && g.layer===f.layer && !g.NextFootholdId && distance(g.EndPoint,f.StartPoint)<.00001);
      if(prev) {prev.NextFootholdId=f.Id;f.PreviousFootholdId=prev.Id;}
    }
    if(!f.NextFootholdId) {
      const next=result.find(g=>g.Id!==f.Id && g.layer===f.layer && !g.PreviousFootholdId && distance(g.StartPoint,f.EndPoint)<.00001);
      if(next) {next.PreviousFootholdId=f.Id;f.NextFootholdId=next.Id;}
    }
  }
  const seen=new Set();let group=Math.max(...all.map(f=>f.groupID||0))+1;
  for(const f of generated) {
    if(seen.has(f.Id))continue;
    const queue=[f];
    while(queue.length) {
      const v=queue.pop();if(seen.has(v.Id))continue;seen.add(v.Id);v.groupID=group;
      for(const id of [v.PreviousFootholdId,v.NextFootholdId]) if(ids.has(id)&&!seen.has(id))queue.push(ids.get(id));
    }
    group++;
  }
  assert.equal(ids.size,result.length,'duplicate foothold id');
  for(const f of generated) for(const [key,other] of [['NextFootholdId','PreviousFootholdId'],['PreviousFootholdId','NextFootholdId']]) {
    if(!f[key])continue;
    assert.ok(ids.has(f[key]));assert.equal(ids.get(f[key])[other],f.Id);
  }
  const byLayer={};for(const f of result.sort((a,b)=>a.Id-b.Id)) (byLayer[f.layer]||=[]).push(f);
  mb.patchComponent(mapName,F,{FootholdsByLayer:byLayer});
  const report={map:mapName,seams:seams.length,pieces:changed.length,oldFootholds:all.length,newFootholds:result.length};
  if(selected)report.connections=seams;
  if(write) mb.write(path.join(root,'map',file));
  reports.push(report);
}
console.log(JSON.stringify({mode:write?'write':'dry-run',reports},null,2));
