// Reuse the existing character-info artwork; preserve entity UUIDs and input bindings.
const path = require('node:path');
const assert = require('node:assert/strict');
const report = console.log;
console.log = (...args) => { if (!/^(  |Loaded |Written |WARN ui_lint|OK ui_lint)/.test(String(args[0]))) report(...args); };
const root = path.resolve(__dirname, '..');
const { UIBuilder } = require(path.join(root, '.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs'));
const { lintUiFile } = require(path.join(root, '.agents/skills/msw-ui-system/scripts/ui_lint.cjs'));
const S = 'MOD.Core.SpriteGUIRendererComponent';
const T = 'MOD.Core.TextComponent';
const G = 'MOD.Core.TextGUIRendererComponent';
const white = {r:1,g:1,b:1,a:1};
const text = {r:.91,g:.918,b:.933,a:1};
const muted = {r:.64,g:.66,b:.69,a:1};
const lime = {r:.82,g:.96,b:.31,a:1};
const button = {r:.19,g:.20,b:.22,a:1};
const art = {
  window:'94f5a064b40741b6947b644ebecaa28e',
  panel:'44dd232205ac4b70a51c83ec7a3bc9ea',
  header:'208a76f9d5854bd2a8c0230f28f3c2f0',
  slot:'9e8f2d33d640491484ba6d1941f45c3e',
  flat:'4fea64a3307cda641809ad8be0d4890b',
};
function skin(b,p,kind='panel',color=white) {
  if(b.hasComponent(p,S)) b.patchComponent(p,S,{ImageRUID:{DataId:art[kind]},Type:kind==='flat'?1:0,PreserveSprite:0,Color:color});
}
function font(b,p,color,extra={}) {
  for(const type of [T,G]) if(b.hasComponent(p,type)) b.patchComponent(p,type,{FontColor:color,...extra});
}
function chrome(b,scope) {
  for(const e of b.listEntities().filter(scope)) {
    const p=e.path, n=e.name;
    const sp=b.getComponent(p,S);
    if(sp && sp.Color?.a > .05) {
      if(/^(SlotBG|GS_\d+|Key_.+|Spare_.+)$/.test(n)) skin(b,p,'slot');
      else if(/^(BG|WinBG|WindowBG)$/.test(n)) skin(b,p,'window');
      else if(/Tab.*BG$|TabBG$|Preset_\d+$|^(PlusBG|MinusBG)$/.test(n)) skin(b,p,'flat',button);
      else if(/^(TitleBar|TitleBarBG|GradeBarBG)$/.test(n)) skin(b,p,'header');
      else if(/BG$|^(KeyPanel|ItemInfoPanel|NoItemPanel|IncompatiblePanel|ComparePanel|CurrentCard|NewCard|Dialog|ConfirmDialog|Stats|Board|Window|ShopPopup|InvPanel|PopupPanel|NamePill|IconBox|SkillCard\d+)$/.test(n)) skin(b,p);
      else if(b.hasComponent(p,'MOD.Core.ButtonComponent') && !/close|arrow|icon|touch|slot|pick|glow/i.test(n)) skin(b,p,'flat',button);
    }
    // Keep grade, rate, currency and danger colors meaningful. Only neutral/blue labels change.
    for(const type of [T,G]) {
      const tc=b.getComponent(p,type);
      if(!tc) continue;
      if(/Title|Header|SkillBookTitle/.test(n) && !/Grade/.test(n)) font(b,p,lime);
      else if(!/Grade|Opt\d|Star|Rate|Cost|Meso|Price|HP|MP|Damage|Status|Error/i.test(n)) {
        const c=tc.FontColor;
        if(c && (Math.max(c.r,c.g,c.b)<.5 || Math.max(c.r,c.g,c.b)-Math.min(c.r,c.g,c.b)<.20 || c.b>c.r+.08)) font(b,p,text);
      }
    }
  }
}
function save(b,file,before,ids) {
  let failure;
  try {b.write(file);} catch(err) {failure=err;}
  const after=lintUiFile(file).filter(f=>f.severity==='error');
  const key=f=>f.rule+'|'+f.path;
  const known=new Set(before.map(key));
  const added=after.filter(f=>!known.has(key(f)));
  assert.equal(added.length,0,JSON.stringify(added));
  if(failure && after.length===0) throw failure;
  const check=UIBuilder.read(file);
  for(const [p,id] of ids) assert.equal(check.getId(p),id,'Binding changed: '+p);
  console.log(path.basename(file)+': no new lint errors ('+after.length+' existing), UUIDs preserved');
}
function edit(group,fn) {
  const file=path.join(root,'ui',group+'.ui');
  const before=lintUiFile(file).filter(f=>f.severity==='error');
  const b=UIBuilder.read(file), ids=b.listEntities().map(e=>[e.path,b.getId(e.path)]);
  fn(b);save(b,file,before,ids);
}
edit('DefaultGroup',b=>{
  const scopes=/^\/ui\/DefaultGroup\/(?:InvenWindow|EquipWindow|DecoWindow|EnhanceWindow|KeySettingWindow|QuickSlotDialog|SkillWindow|BattleStatsWindow|CommandInputBar|TooltipPanel|SkillTooltipPanel|MapSelectWindow|BoxQuantityPopup|ItemTypeSelectPopup)(?:\/|$)/;
  chrome(b,e=>scopes.test(e.path));
  for(const e of b.listEntities().filter(e=>/^\/ui\/DefaultGroup\/SkillBar\/Slot_[^/]+\//.test(e.path))) {
    if(e.name==='SlotBG') skin(b,e.path,'slot');
    if(e.name==='KeyLabel') { skin(b,e.path,'flat',{r:.14,g:.15,b:.16,a:1});font(b,e.path,text); }
  }
  for(const e of b.listEntities().filter(e=>/^\/ui\/DefaultGroup\/MapleHUD\/Btn[^/]+$/.test(e.path))) {
    skin(b,e.path,'flat',button);font(b,e.path,text);
  }
  for(const p of ['BattleStatsWindow','CommandInputBar','TooltipPanel/Main','TooltipPanel/Cmp']) skin(b,p,'window');
  skin(b,'CommandInputBar/Input','flat',{r:.10,g:.11,b:.12,a:1});
  // All nine usable equipment slots now have the exact same background hierarchy and geometry.
  for(const name of ['Face','Hair','Top','Bottom','Shoes','Weapon','Cap','Cape','Glove']) {
    const p='EquipWindow/Slot'+name;
    b.patch(p,{rect_size:[64,64]});
    if(b.hasComponent(p,S)) b.patchComponent(p,S,{Color:{r:1,g:1,b:1,a:0}});
    if(!b.find(p+'/SlotBG')) b.sprite(p+'/SlotBG',{image_ruid:art.slot,color:white,sprite_type:0,rect_size:[64,64],pos:[0,0]});
    skin(b,p+'/SlotBG','slot');
    b.patch(p+'/SlotBG',{anchor:'middle-center',pivot:[.5,.5],pos:[0,0],rect_size:[64,64],display_order:0});
    for(const [n,w,h,y] of [['Icon',52,52,0],['Label',60,30,0],['StarLabel',60,14,26],['ItemName',60,16,-32],['ClickZone',64,64,0],['TouchArea',64,64,0],['Touch',64,64,0]]) {
      if(!b.find(p+'/'+n)) continue;
      b.patch(p+'/'+n,{anchor:'middle-center',pivot:[.5,.5],pos:[0,y],rect_size:[w,h],display_order:n==='Icon'?2:3});
      if(n==='Label') font(b,p+'/'+n,muted,{FontSize:12,BestFit:false});
      if(n==='Icon') b.patchComponent(p+'/'+n,S,{Color:{r:1,g:1,b:1,a:0},PreserveSprite:1});
    }
  }
  for(const e of b.listEntities().filter(e=>/^\/ui\/DefaultGroup\/EquipWindow\/GreySlots\/GS_\d+$/.test(e.path))) {
    skin(b,e.path,'slot');b.patch(e.path,{rect_size:[64,64]});
  }
  for(const n of ['BG','BtnBG','ClickZone','TouchArea','Label','BtnLabel']) {
    const p='EquipWindow/BtnDeco/'+n;
    if(b.find(p)) b.patch(p,{pos:[0,0],rect_size:[/Label/.test(n)?104:112,38]});
  }
  const target='EnhanceWindow/RightPanel/SlotArea/TargetSlotBG';
  skin(b,target+'/SlotBG','slot');
  b.setComponentEnabled(target+'/PlaceholderIcon',S,false);
  // Preserve this entity: EnhancementManager already toggles it when an item is registered/cleared.
  b.upsertComponent(target+'/PlaceholderIcon',G,{
    Text:'장비\n등록',Font:'Maple',FontSize:17,FontColor:muted,
    HorizontalAlignment:2,VerticalAlignment:512,Enable:true,IsRichText:false,BestFit:false,
  });
  b.patch(target+'/PlaceholderIcon',{pos:[0,0],rect_size:[78,78],display_order:2});
  for(const e of b.listEntities().filter(e=>/\/EnhanceWindow\/.*\/ComparePanel\/(CurrentCard|NewCard)\//.test(e.path))) {
    if(!/\/Grade$/.test(e.path)) font(b,e.path,text);
  }
  // The native chat owns input, moderation and delivery. Decorative log overlays must not cover it.
  const chat='MapleHUD/ChatBox';
  b.patchComponent(chat,'MOD.Core.ChatComponent',{Expand:true,HideWorldChatButton:false});
  for(const e of b.listEntities().filter(e=>e.path.startsWith('/ui/DefaultGroup/'+chat+'/') && /^(SimpleChatBG|SimpleLine\d+)$/.test(e.name))) b.patch(e.path,{enable:false});
});
for(const group of ['ShopGroup','InventoryGroup','PopupGroup','ItemDiscardGroup','BattleStatsDetailWindow','SummonPartyUI']) edit(group,b=>chrome(b,e=>e.depth>0));
edit('MiniMapUI',b=>{
  for(const p of ['Board','Board/BG','Board/MapFrame']) skin(b,p,'window');
  skin(b,'Board/MapViewport','flat',{r:.08,g:.09,b:.10,a:1});
  for(const p of ['Board/BtnSizeDown','Board/BtnSizeUp']) { skin(b,p,'flat',button);font(b,p,text); }
  for(const p of ['Board/Title','Board/RegionName']) font(b,p,lime);
  font(b,'Board/MapName',text);
});
