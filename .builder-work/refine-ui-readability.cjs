const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const {UIBuilder} = require(path.join(root, '.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs'));
const {lintUiFile} = require(path.join(root, '.agents/skills/msw-ui-system/scripts/ui_lint.cjs'));
const report = console.log;
console.log = (...a) => { if (!/^(  |Loaded |Written |WARN ui_lint|OK ui_lint)/.test(String(a[0]))) report(...a); };
const S='MOD.Core.SpriteGUIRendererComponent', T='MOD.Core.TextGUIRendererComponent';
const L='MOD.Core.TextComponent', U='MOD.Core.UITransformComponent', B='MOD.Core.ButtonComponent', C='MOD.Core.CanvasGroupComponent';
const flat='4fea64a3307cda641809ad8be0d4890b';
const color=(r,g,b,a=1)=>({r,g,b,a}), white=color(1,1,1), sky=color(.43,.77,1), pale=color(.75,.91,1);
function edit(group, change) {
  const file=path.join(root,'ui',group+'.ui');
  const baseline=lintUiFile(file).filter(x=>x.severity==='error');
  const b=UIBuilder.read(file), ids=b.listEntities().map(e=>[e.path,b.getId(e.path)]);
  change(b);
  let failure; try { b.write(file); } catch(e) { failure=e; }
  const after=lintUiFile(file).filter(x=>x.severity==='error');
  const known=new Set(baseline.map(x=>x.rule+'|'+x.path));
  assert.deepEqual(after.filter(x=>!known.has(x.rule+'|'+x.path)),[],group+' introduced layout errors');
  if(failure&&!after.length) throw failure;
  const check=UIBuilder.read(file);
  for(const [p,id] of ids) assert.equal(check.getId(p),id,'binding changed: '+p);
  report(group+': bindings preserved; '+after.length+' existing lint errors; none added');
}
function tint(b,p,c) { b.patchComponent(p,S,{ImageRUID:{DataId:flat},Color:c,Type:0,Outline:false,DropShadow:false}); }
function textColor(b,p,c) { b.patchComponent(p,b.hasComponent(p,T)?T:L,{FontColor:c}); }
function buttonColors(b,p,normal=color(.25,.28,.32)) {
  b.patchComponent(p,B,{Transition:1,Colors:{NormalColor:normal,HighlightedColor:color(.38,.42,.47),PressedColor:color(.18,.21,.25),SelectedColor:normal,DisabledColor:color(.15,.16,.18,.55),ColorMultiplier:1,FadeDuration:.08}});
}
edit('DefaultGroup',b=>{
  // Visible window surfaces stop native mouse events as well as the script arbiter.
  for(const name of ['InvenWindow','EquipWindow','DecoWindow','EnhanceWindow','SkillWindow','CharInfoWindow','KeySettingWindow']) {
    if(b.hasComponent(name,S)) b.patchComponent(name,S,{RaycastTarget:true});
    else b.addComponent(name,S,{ImageRUID:{DataId:flat},Color:color(1,1,1,0),Type:0,RaycastTarget:true,Enable:true});
    b.upsertComponent(name,C,{Enable:true,GroupAlpha:1,BlocksRaycasts:true,Interactable:true});
  }
  b.patchComponent('KeySettingWindow',U,{UIScale:{x:1.25,y:1.25,z:1}});
  // Lighter inset slots, without the old dark bitmap or a heavy drop shadow.
  for(const e of b.listEntities().filter(e=>/\/InvenWindow\/InvenSlot\d+\/SlotBG$/.test(e.path))) {
    tint(b,e.path,color(.43,.47,.52));
    b.patchComponent(e.path,S,{Outline:true,OutlineColor:color(.65,.70,.75,.8),OutlineWidth:1});
  }
  tint(b,'InvenWindow/InvenScrollThumb/ThumbBG',white);
  for(const side of ['Main','Cmp']) {
    const p='TooltipPanel/'+side;
    textColor(b,p+'/Title',white);
    for(const n of ['CPLabel','CPValue']) b.patchComponent(p+'/'+n,L,{Alignment:5});
    tint(b,p+'/Divider',color(.47,.49,.52,.8));
  }
  const sf='EnhanceWindow/RightPanel/ContentArea/StarforceContent';
  for(let i=1;i<=100;i++) b.patch(sf+'/Star_'+i,{enable:false});
  b.patch(sf+'/LevelArrow',{enable:false});
  b.patch('EnhanceWindow/RightPanel/SlotArea/TargetSlotBG/StarLabel',{enable:false});
  const stars=sf+'/ArrowPillBG';
  // Reuse the former star-grid area for one readable before/after comparison.
  b.patch(stars,{pos:[0,208],rect_size:[544,180]});
  b.upsertComponent(stars,S,{...b.getComponent(sf+'/StarBoxBG',S),RaycastTarget:false});
  b.patch(sf+'/StarBoxBG',{enable:false});
  for(const [n,x] of [['Before',-113],['After',69]]) {
    b.text(stars+'/'+n+'Label',n==='Before'?'강화 전':'강화 후',{pos:[x+20,42],rect_size:[132,36],size:20,color:color(.78,.83,.87)});
    b.sprite(stars+'/'+n+'Star',{pos:[x,-6],rect_size:[30,30],image_ruid:'58274544478d4475b6f33f1f2ecca764',color:color(1,.84,.24),sprite_type:0});
    b.text(stars+'/'+n+'Value','0',{pos:[x+42,-6],rect_size:[64,44],size:28,bold:true,color:white,alignment:3});
  }
  b.text(stars+'/Arrow','>',{pos:[0,-6],rect_size:[32,46],size:32,color:color(.78,.84,.89)});
  for(const n of ['StatHeader','RateHeader']) textColor(b,sf+'/'+n,sky);
  for(const n of ['StatsText','RateText','CostText']) textColor(b,sf+'/'+n,pale);
  textColor(b,'EnhanceWindow/LeftPanel/MesoTitleText',sky);
  textColor(b,'EnhanceWindow/LeftPanel/MesoValueText',pale);
  // Keep the single nameplate image on the parent, then draw both labels as GUI text children.
  const plate='MapleHUD/LevelPlate';
  b.upsertComponent(plate,S,{...b.getComponent(plate+'/Background',S),RaycastTarget:false});
  b.patch(plate+'/Background',{enable:false});
  b.text(plate+'/LevelText','Lv.1',{pos:[-110,0],rect_size:[86,38],size:27,bold:true,color:white,alignment:3});
  b.text(plate+'/NameText','',{pos:[36,0],rect_size:[190,36],size:23,color:white,alignment:3,overflow:2});
  const chat='MapleHUD/ChatBox';
  b.patch(chat+'/SimpleChatBG',{anchor:'middle-center',pivot:[.5,.5],pos:[0,0],rect_size:[650,230],display_order:-10});
  tint(b,chat+'/SimpleChatBG',color(.08,.09,.11,.64));
  for(const n of ['Input','Messages/Log']) b.patchComponent(chat+'/'+n,T,{Font:'Default',FontSize:20,FontColor:white,Underlay:false,OutlineWidth:0});
  tint(b,chat+'/Input',color(.17,.18,.20,.55));
  // Both depleted gauges expose exactly the same neutral translucent gray.
  b.patch('MapleHUD/VitalsFrame',{enable:false});
  for(const n of ['HpBar','MpBar']) tint(b,'MapleHUD/'+n+'/Bg',color(.42,.42,.42,.52));
  const menu=[
    ['BtnEquip','장비','70534ea0485f4cd6a6f3eab75be354f9'],
    ['BtnEnhance','강화','f92e414aa2f548cea9642e374fa43cb9'],
    ['BtnMap','맵','f902fcb93cbd4054b432345fca00eb31'],
    ['BtnInven','아이템','fdf2f7727d224882b6b5ddfc9140745f'],
    ['BtnSkill','스킬','2ca29d2381cb43e1a3daf959807b5fa8'],
    ['BtnCharInfo','정보','d35f1053bdda454e93c0b0efa0f6affd'],
    ['BtnKeySetting','키세팅','c436e8ca16aa42af8ab521a2593a6427'],
  ];
  menu.forEach(([name,label,ruid],i)=>{
    const p='MapleHUD/'+name;
    b.button(p,'',{anchor:'bottom-center',pivot:[.5,.5],pos:[-570+i*64,26],rect_size:[60,48],image_ruid:flat,sprite_type:0,bg_color:color(.25,.28,.32)});
    buttonColors(b,p);
    b.sprite(p+'/Icon',{pos:[0,9],rect_size:[23,23],image_ruid:ruid,sprite_type:0,color:white});
    b.text(p+'/Label',label,{pos:[0,-14],rect_size:[58,20],size:16,color:white});
  });
  for(const [name,dir] of [['BtnBarCollapse',1],['BtnBarExpand',-1]]) {
    const p='SkillBar/'+name;
    b.button(p,'',{pos:[-289,0],rect_size:[30,124],image_ruid:flat,sprite_type:0,bg_color:color(.25,.28,.32)});
    b.patchComponent(p,B,{Transition:0});
    b.upsertComponent(p,C,{Enable:true,GroupAlpha:0,Interactable:true,BlocksRaycasts:true});
    b.text(p+'/Chevron',dir===1?'>':'<',{pos:[0,0],rect_size:[26,46],size:30,color:white});
  }
  // The old unused hover rectangle must not cover the actual arrow button.
  b.patch('SkillBar/CollapseHoverZone',{enable:false});
});
edit('MiniMapUI',b=>{
  b.patchComponent('Controller','script.MiniMapUIManager',{ZoomMultiplier:.8});
  b.patch('Board/PLY',{rect_size:[33,33]});
  for(const e of b.listEntities().filter(e=>/\/Board\/(MOB|SUM)_\d+$/.test(e.path))) b.patch(e.path,{rect_size:[27,27]});
  b.patchComponent('Board',S,{Color:color(.12,.13,.15,.22)});
  b.patchComponent('Board/MapFrame',S,{Color:color(.13,.15,.18,.16)});
  b.patchComponent('Board/MapViewport',S,{Color:color(.08,.09,.10,.12)});
  // RawImage has no Color field. CanvasGroup applies alpha to the captured black backdrop too.
  for(const e of b.listEntities().filter(e=>/\/MapViewport\/Tile_\d+$/.test(e.path))) b.upsertComponent(e.path,C,{Enable:true,GroupAlpha:.58,Interactable:false,BlocksRaycasts:false});
});
edit('ItemDiscardGroup',b=>{
  const p='Modal/Dialog';
  tint(b,p,color(.16,.18,.21));
  tint(b,p+'/Header',color(.24,.27,.31));
  tint(b,p+'/Quantity',color(.30,.34,.39));
  for(const n of ['Header/Title','ItemName','Prompt','Quantity']) textColor(b,p+'/'+n,white);
  b.patchComponent(p+'/Header/Title',T,{FontSize:25,FontStyle:1});
  b.patchComponent(p+'/Prompt',T,{FontSize:20});
  b.patchComponent(p+'/ItemName',T,{BestFit:true,MinSize:16,MaxSize:22});
  b.patchComponent(p+'/Quantity','MOD.Core.TextGUIRendererInputComponent',{PlaceHolderColor:color(.78,.82,.87)});
  for(const n of ['Confirm','Cancel']) {tint(b,p+'/'+n,color(.30,.34,.39));buttonColors(b,p+'/'+n,color(.30,.34,.39));textColor(b,p+'/'+n,white);}
  b.patchComponent(p+'/Confirm',T,{Text:'버리기'});
});
