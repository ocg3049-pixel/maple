const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const {UIBuilder} = require(path.join(root, '.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs'));
const {lintUiFile} = require(path.join(root, '.agents/skills/msw-ui-system/scripts/ui_lint.cjs'));
const S='MOD.Core.SpriteGUIRendererComponent', U='MOD.Core.UITransformComponent';
const L='MOD.Core.TextComponent', C='MOD.Core.CanvasGroupComponent';
const flat='4fea64a3307cda641809ad8be0d4890b';
const pearl='e255ef6d1ea34250b022e60dc55985b0';
// Generated with the built-in imagegen tool; final prompt:
// Use case: ui-mockup. Asset type: production bitmap sprite for one empty inventory item slot in a MapleStory Worlds 2D RPG. Generate a single perfectly square slot background, front-on orthographic, no perspective. The slot fills the entire square image edge to edge, with a very slightly rounded corner radius (about 3 percent of width). Center is a clean, empty, bright pearl silver-gray inset surface: smooth soft natural vertical gradient from light cool gray #CED5DD at the top to #ADB8C6 at bottom, approximately halfway between medium gray and white. A very thin crisp pale silver rim, subtle inner bevel and extremely restrained soft inset shading provide a polished tactile RPG UI appearance. The center 80 percent must remain clean and quiet behind item icons. No text, no item, no icons, no symbols, no glow, no sparkle, no ornamental decoration, no heavy shadow, no broad outer margin, no checkerboard. Transparent outside the tiny rounded corners only; the interior must be opaque. Make it look like a refined high-quality compact inventory slot that will be displayed at 56 by 56 pixels; balanced contrast, not dark, not pure white. Produce the single square asset, not a mockup of an inventory window.
const color=(r,g,b,a=1)=>({r,g,b,a});
function edit(group, update) {
  const file=path.join(root,'ui',group+'.ui');
  const known=new Set(lintUiFile(file).filter(x=>x.severity==='error').map(x=>x.rule+'|'+x.path));
  const b=UIBuilder.read(file);
  const ids=b.listEntities().map(e=>[e.path,b.getId(e.path)]);
  update(b);
  let failure; try { b.write(file); } catch(e) { failure=e; }
  const errors=lintUiFile(file).filter(x=>x.severity==='error');
  assert.deepEqual(errors.filter(x=>!known.has(x.rule+'|'+x.path)),[],group+' new layout errors');
  if(failure&&!errors.length) throw failure;
  const reread=UIBuilder.read(file);
  for(const [p,id] of ids) assert.equal(reread.getId(p),id,'binding changed: '+p);
  console.log('[Followup] '+group+': UUIDs preserved; no new lint errors');
}
edit('DefaultGroup',b=>{
  const slots=b.listEntities().filter(e=>/\/InvenWindow\/InvenSlot\d+\/SlotBG$/.test(e.path));
  assert.equal(slots.length,128);
  for(const e of slots) b.patchComponent(e.path,S,{ImageRUID:{DataId:pearl},Color:color(1,1,1),Type:0,Outline:false,DropShadow:false});
  for(const win of ['EquipWindow','DecoWindow']) {
    b.patch(win+'/TitleText',{anchor:'top-center',pivot:[.5,1],pos:[0,-10],rect_size:[500,40]});
    const label=win==='EquipWindow'?win+'/TitleText/Label':win+'/TitleLabel';
    b.patch(label,{anchor:'middle-center',pivot:[.5,.5],pos:win==='EquipWindow'?[0,0]:[0,310],rect_size:[440,36]});
    b.patchComponent(label,L,{Text:'장비 인벤토리',FontSize:20,Bold:true,Alignment:3,FontColor:color(.87,.91,.96)});
    b.patch(win+'/HeaderLabel',{pos:[-136,212],rect_size:[180,28]});
    b.patchComponent(win+'/HeaderLabel',L,{FontSize:22,Alignment:3,Bold:true,FontColor:color(.9,.93,.97)});
    const swap=win+'/'+(win==='EquipWindow'?'BtnDeco':'BtnEquipSwitch');
    b.patch(swap,{pos:[170,212],rect_size:[112,38]});
    for(const n of ['BG','Touch']) if(b.find(swap+'/'+n)) b.patch(swap+'/'+n,{pos:[0,0],rect_size:[112,38]});
    b.patch(swap+'/Label',{pos:[0,0],rect_size:[104,38]});
    b.patchComponent(swap+'/Label',L,{FontSize:20,Alignment:4});
    const close=win+'/'+(win==='EquipWindow'?'CloseEquip':'CloseDeco');
    b.patch(close,{anchor:'top-right',pivot:[1,1],pos:[-10,-10],rect_size:[40,40]});
    for(const n of ['BG','Label','Touch']) if(b.find(close+'/'+n)) b.patch(close+'/'+n,{pos:[0,0],rect_size:[40,40]});
  }
  b.patch('EquipWindow/TitleText/TitleBG',{pos:[0,0],rect_size:[500,40]});
  const sf='EnhanceWindow/RightPanel/ContentArea/StarforceContent';
  b.patch(sf+'/ArrowPillBG',{enable:false});
  b.patch(sf+'/LevelArrow',{enable:false});
  b.patch(sf+'/StarBoxBG',{enable:true});
  for(let i=1;i<=100;i++) b.patch(sf+'/Star_'+i,{enable:true});
  b.patch('MapleHUD/HpBar',{pos:[0,93]});
  b.patch('MapleHUD/MpBar',{pos:[0,71]});
  b.patch('MapleHUD/VitalsFrame',{enable:true,pos:[0,55],rect_size:[318,54],display_order:0});
  b.patchComponent('MapleHUD/VitalsFrame',S,{Color:color(.18,.20,.24,.96),Outline:true,OutlineColor:color(.55,.61,.68,1),OutlineWidth:1});
  for(const e of b.listEntities().filter(e=>/\/SkillBar\/Slot_[^/]+$/.test(e.path))) b.patch(e.path,{pos:[e.pos[0],e.pos[1]>0?32:-32]});
  b.patch('SkillBar',{rect_size:[528,136]});
  const bg=b.listEntities().find(e=>e.path==='/ui/DefaultGroup/SkillBar/BG');
  assert.ok(bg,'quickslot BG');
  b.patch(bg.path,{rect_size:[bg.size[0],136]});
});
edit('MiniMapUI',b=>{
  b.patchComponent('Controller','script.MiniMapUIManager',{ZoomMultiplier:1.6});
  b.patch('Board/PLY',{rect_size:[16.5,16.5]});
  for(const e of b.listEntities().filter(e=>/\/Board\/(MOB|SUM)_\d+$/.test(e.path))) b.patch(e.path,{rect_size:[13.5,13.5]});
  // The frame has a transparent hole; only the terrain backdrop is translucent.
  b.patchComponent('Board',S,{Color:color(.17,.19,.23,0),Outline:true,OutlineColor:color(.54,.62,.70,1)});
  b.patchComponent('Board/MapFrame',S,{Color:color(1,1,1,0),Outline:true,OutlineColor:color(.49,.57,.64,1),OutlineWidth:1});
  b.patchComponent('Board/MapViewport',S,{Color:color(.04,.05,.07,.45)});
  const chrome=color(.17,.19,.23,1);
  for(const [name,anchor,pos,size,pivot] of [
    ['HeaderChrome','top-left',[0,0],[450,115],[0,1]],
    ['LeftChrome','bottom-left',[0,17],[18,178],[0,0]],
    ['RightChrome','bottom-right',[0,17],[18,178],[1,0]],
    ['BottomChrome','bottom-left',[0,0],[450,17],[0,0]],
  ]) {
    b.sprite('Board/'+name,{anchor,pos,rect_size:size,pivot,image_ruid:flat,color:chrome,sprite_type:0});
    b.patch('Board/'+name,{display_order:-100});
  }
  for(const e of b.listEntities().filter(e=>/\/MapViewport\/Tile_\d+$/.test(e.path))) b.patchComponent(e.path,C,{GroupAlpha:1});
});
