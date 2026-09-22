const path = require('node:path');
const report = console.log;
console.log = (...args) => { if (!/^(  |Loaded |Saved |✓)/.test(String(args[0]))) report(...args); };
const root = path.resolve(__dirname, '..');
const { UIBuilder } = require(path.join(root, '.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs'));
const art = require(path.join(root, 'RootDesk/MyDesk/Assets/UIPolish/ruids.json'));
const b = UIBuilder.read(path.join(root, 'ui/DefaultGroup.ui'));
const S = 'MOD.Core.SpriteGUIRendererComponent';
const T = 'MOD.Core.TextComponent';
const white = {r:1,g:1,b:1,a:1};
const ink = {r:.13,g:.22,b:.32,a:1};
const pale = {r:.83,g:.92,b:1,a:1};
function rect(p,x,y,w,h) { b.patch(p,{anchor:'middle-center',pivot:[.5,.5],pos:[x,y],rect_size:[w,h]}); }
function skin(p,kind='frame',color=white) { if(b.hasComponent(p,S)) b.patchComponent(p,S,{ImageRUID:{DataId:art[kind]},Type:1,PreserveSprite:0,Color:color,RaycastTarget:!!b.getComponent(p,S).RaycastTarget}); }
function txt(p,size=16,color=white,text) {
 if(b.hasComponent(p,T)) b.patchComponent(p,T,{FontSize:size,FontColor:color,Alignment:4,BestFit:false,UseOutLine:false,DropShadow:false,...(text===undefined?{}:{Text:text})});
 else if(b.hasComponent(p,'MOD.Core.TextGUIRendererComponent')) b.patchComponent(p,'MOD.Core.TextGUIRendererComponent',{FontSize:size,FontColor:color,HorizontalAlignment:2,VerticalAlignment:512,BestFit:false,Underlay:false,OutlineWidth:0,...(text===undefined?{}:{Text:text})});
}
function back(p,order=0) {b.patch(p,{display_order:order});}
// Keep all original UUIDs, touch receivers and script bindings.
for(const e of b.listEntities()) {
  const p=e.path;
  if(/^\/ui\/DefaultGroup\/(InvenWindow|EquipWindow|EnhanceWindow)\//.test(p) && e.name==='SlotBG') {skin(p,'slot');back(p);}
}
for(const p of ['InvenWindow/BG','EquipWindow/BG','EnhanceWindow/BG']) skin(p);
const inv='InvenWindow';
rect(inv,230,0,372,760);rect(inv+'/BG',0,0,372,760);
rect(inv+'/MesoBar',0,-344,336,48);
const meso=inv+'/MesoBar';
skin(meso+'/BarBG');rect(meso+'/BarBG',0,0,336,48);back(meso+'/BarBG',0);
skin(meso+'/MesoGroupBG');rect(meso+'/MesoGroupBG',-60,0,204,40);back(meso+'/MesoGroupBG',1);
rect(meso+'/MesoIcon',-152,0,26,26);back(meso+'/MesoIcon',2);
rect(meso+'/MesoText',-48,0,162,32);txt(meso+'/MesoText',16,{r:1,g:.88,b:.47,a:1});back(meso+'/MesoText',3);
rect(meso+'/EnhanceOpenBtn',113,0,110,34);back(meso+'/EnhanceOpenBtn',4);
skin(meso+'/EnhanceOpenBtn/BtnBG','minimap');rect(meso+'/EnhanceOpenBtn/BtnBG',0,0,110,34);
rect(meso+'/EnhanceOpenBtn/BtnLabel',0,0,104,34);txt(meso+'/EnhanceOpenBtn/BtnLabel',15);
// Never let a late-created decorative backdrop cover existing text/icons.
const ew='EnhanceWindow', left=ew+'/LeftPanel', right=ew+'/RightPanel', area=right+'/ContentArea';
for(const e of b.listEntities().filter(e=>e.path.startsWith('/ui/DefaultGroup/EnhanceWindow/'))) {
  if(/(?:BG|BoxBG|PillBG)$/.test(e.name) && e.name!=='SlotBG') {skin(e.path);back(e.path,0);}
}
for(const [i,n] of ['Starforce','Scroll','AddOption','Potential','Additional'].entries()) {
  const p=left+'/EnhanceTab_'+n;
  rect(p,0,300-i*86,164,72);rect(p+'/TabBG',0,0,164,72);skin(p+'/TabBG','minimap');
  rect(p+'/TabLbl',0,0,148,60);txt(p+'/TabLbl',18);back(p+'/TabLbl',1);
  rect(p+'/ClickZone',0,0,164,72);back(p+'/ClickZone',2);
}
const target=right+'/SlotArea';
rect(target,0,300,560,240);rect(target+'/SlotSectionBG',0,0,544,220);back(target+'/SlotSectionBG',0);
rect(target+'/TargetSlotBG',0,38,102,102);skin(target+'/TargetSlotBG','slot');back(target+'/TargetSlotBG',2);
rect(target+'/TargetSlotBG/SlotBG',0,0,102,102);skin(target+'/TargetSlotBG/SlotBG','slot');back(target+'/TargetSlotBG/SlotBG',0);
for(const n of ['TargetIcon']) if(b.find(target+'/TargetSlotBG/'+n)){rect(target+'/TargetSlotBG/'+n,0,0,78,78);back(target+'/TargetSlotBG/'+n,2);}
for(const e of b.listEntities().filter(e=>e.path.startsWith('/ui/DefaultGroup/'+target+'/'))) if(/^Frame[LTRB]$/.test(e.name)) b.patch(e.path,{enable:false});
rect(target+'/NamePillBG',0,-56,500,40);back(target+'/NamePillBG',1);
for(const n of ['TargetNameLabel','SlotPromptText']) if(b.find(target+'/'+n)){rect(target+'/'+n,0,-56,478,32);txt(target+'/'+n,17);back(target+'/'+n,5);}
if(b.find(target+'/TargetSlotBG/StarLabel')) {rect(target+'/TargetSlotBG/StarLabel',0,-140,490,22);txt(target+'/TargetSlotBG/StarLabel',16,{r:1,g:.86,b:.4,a:1});}
rect(area,0,-120,560,610);
for(const n of ['Default','Starforce','Scroll','AddOption','Potential','Additional']) if(b.find(area+'/'+n+'Content')) rect(area+'/'+n+'Content',0,0,560,610);
const star=area+'/StarforceContent';
// Legacy text entities accidentally carried opaque full-panel artwork.
for(const n of ['RateHeader','RateText']) b.patchComponent(star+'/'+n,S,{Color:{r:1,g:1,b:1,a:0},RaycastTarget:false,PreserveSprite:0});
b.patchComponent(target+'/TargetSlotBG/PlaceholderIcon',S,{ImageRUID:{DataId:art.func_equip},Color:{r:1,g:1,b:1,a:.42},Type:0,PreserveSprite:1});
for(const [n,x,y,w,h] of [
 ['StarBoxBG',0,208,544,180],['ArrowPillBG',0,88,420,38],['LevelArrow',0,88,410,34],
 ['StatBoxBG',0,-6,544,126],['StatHeader',0,38,510,24],['StatsText',0,-17,500,76],
 ['RateBoxBG',0,-125,544,90],['RateHeader',0,-97,510,24],['RateText',0,-135,510,44],
 ['CostBoxBG',0,-202,544,44],['CostText',0,-202,516,30],['EnhanceBtn',0,-268,320,54]]) rect(star+'/'+n,x,y,w,h);
for(const n of ['StatHeader','RateHeader']) txt(star+'/'+n,16,pale);
txt(star+'/StatsText',17);txt(star+'/RateText',17,{r:.72,g:1,b:.82,a:1});txt(star+'/CostText',17,{r:1,g:.86,b:.4,a:1});
skin(star+'/EnhanceBtn','minimap');
for(const e of b.listEntities().filter(e=>e.path.startsWith('/ui/DefaultGroup/'+star+'/'))) if(!/BG$/.test(e.name)) back(e.path,5+e.depth);
const sc=area+'/ScrollContent/ScrollMain';
rect(sc,0,0,560,610);
for(const n of ['ScrollBoxBG','ScrollInfoBoxBG','ScrollLogBG']) {skin(sc+'/'+n);back(sc+'/'+n,0);}
for(const n of ['ScrollHeader','ScrollDescText','ScrollInfoText','ScrollInfoHeader','ScrollEmptyText','ScrollLogText','ScrollUseBtnText']) if(b.find(sc+'/'+n)){txt(sc+'/'+n,n.includes('Header')?16:17);back(sc+'/'+n,5);}
rect(sc+'/ScrollEmptyText',0,175,480,26);
skin(sc+'/ScrollUseBtn','minimap');
back(sc+'/ScrollUseBtn',10);back(sc+'/ScrollUseBtnText',11);
rect(sc+'/ScrollUseBtn',0,-230,300,54);
rect(sc+'/ScrollUseBtnText',0,-230,280,44);
rect(sc+'/ScrollLogBG',0,-288,544,32);
rect(sc+'/ScrollLogText',0,-288,520,28);
for(const n of ['Potential','Additional']) {
 const p=area+'/'+n+'Content';
 rect(p+'/ItemInfoPanel',0,183,544,230);skin(p+'/ItemInfoPanel');
 rect(p+'/ItemInfoPanel/GradeBarBG',0,84,520,48);skin(p+'/ItemInfoPanel/GradeBarBG','minimap');back(p+'/ItemInfoPanel/GradeBarBG',0);
 rect(p+'/ItemInfoPanel/GradeTitleText',0,84,500,36);txt(p+'/ItemInfoPanel/GradeTitleText',20);back(p+'/ItemInfoPanel/GradeTitleText',2);
 for(let i=1;i<=3;i++){const q=p+'/ItemInfoPanel/Opt'+i+'Text';rect(q,0,25-(i-1)*39,500,34);txt(q,18);back(q,3+i);}
 for(const n2 of ['NoItemPanel','IncompatiblePanel']) if(b.find(p+'/'+n2)){rect(p+'/'+n2,0,183,544,230);skin(p+'/'+n2);}
 rect(p+'/CurrencyTabRow',0,36,520,44);
 for(const n2 of ['MesoTabBG','CubeTabBG']) skin(p+'/CurrencyTabRow/'+n2,'minimap');
 rect(p+'/CubePanel',0,-112,522,170);rect(p+'/MesoPanel',0,-112,522,170);
 rect(p+'/ResetBtnBG',0,-268,300,52);skin(p+'/ResetBtnBG','minimap');
 rect(p+'/InfoFooterText',0,-222,520,30);txt(p+'/InfoFooterText',14,pale);
 const cp=p+'/ComparePanel';rect(cp,0,183,544,230);skin(cp);back(cp,30);
 rect(cp+'/Title',0,99,520,24);txt(cp+'/Title',15,pale);
 rect(cp+'/Hint',0,-101,520,24);txt(cp+'/Hint',13,{r:1,g:.87,b:.42,a:1},'적용할 옵션을 선택하세요. 선택한 옵션이 바로 적용됩니다.');
 for(const [n2,x] of [['CurrentCard',-133],['NewCard',133]]) {
  const q=cp+'/'+n2;rect(q,x,-1,258,168);skin(q,'slot');
  rect(q+'/Title',0,65,234,24);txt(q+'/Title',15,ink);
  rect(q+'/Grade',0,40,234,24);txt(q+'/Grade',15,ink);
  for(let i=1;i<=3;i++){rect(q+'/Opt'+i,0,14-(i-1)*25,236,24);txt(q+'/Opt'+i,13,ink);}
  rect(q+'/Status',0,-65,236,24);txt(q+'/Status',13,ink);
 }
}
// Matching navy chrome, bright keycaps and shared function-icon layout.
const key='KeySettingWindow';
for(const n of ['WinBG','KeyPanel','SpareBG','TitleBar']) skin(key+'/'+n);
for(const n of ['BtnSave','BtnRevert','BtnQuickSlot','Preset_1','Preset_2','Preset_3']) skin(key+'/'+n,'minimap');
for(const n of ['TitleText','TitleSub','PresetLabel','SpareTitle','HintText']) txt(key+'/'+n,n==='TitleText'?22:15,pale);
rect(key+'/SpareTitle',-367,-112,240,24);
for(const e of b.listEntities().filter(e=>e.path.startsWith('/ui/DefaultGroup/'+key+'/'))) {
 if(/^Key_|^Spare_/.test(e.name)) {
  skin(e.path,'slot');
  if(b.find(e.path+'/Icon')) rect(e.path+'/Icon',0,0,28,28);
  if(b.find(e.path+'/Func')){rect(e.path+'/Func',0,-18,e.size[0]-4,11);txt(e.path+'/Func',9,ink);}
  if(b.find(e.path+'/Label')){rect(e.path+'/Label',0,-18,e.size[0]-4,11);txt(e.path+'/Label',9,ink);}
  if(b.find(e.path+'/KeyName')){rect(e.path+'/KeyName',0,17,e.size[0]-6,12);txt(e.path+'/KeyName',10,ink);}
 }
}
for(const e of b.listEntities().filter(e=>e.path.startsWith('/ui/DefaultGroup/SkillBar/Slot_'))) if(e.name==='FuncLabel'){b.patch(e.path,{enable:false});}
rect('SkillDragGhost/Label',0,-37,100,22);txt('SkillDragGhost/Label',13);
// The existing file contains 43 unrelated legacy errors. Reject any new error;
// do not silently repair BuffBar groups or remove legacy controller bindings.
const file=path.join(root,'ui/DefaultGroup.ui');
try {b.write(file,{lint:true,strict:true});} catch(err) {
 const {lintUiFile}=require(path.join(root,'.agents/skills/msw-ui-system/scripts/ui_lint.cjs'));
 const unexpected=lintUiFile(file).filter(f=>f.severity==='error').filter(f=> !(
  (f.rule==='L029' && /^\/ui\/DefaultGroup\/BuffBar(?:\/|$)/.test(f.path)) ||
  (f.rule==='L013' && /^\/ui\/DefaultGroup\/InvenWindow\/InvenScroll(?:Track|Up|Down|Thumb)(?:\/|$)/.test(f.path)) ||
  (f.rule==='L013' && /^\/ui\/DefaultGroup\/EnhanceWindow\/(?:SlotLabel|TargetSlotBG|TargetNameLabel|EnhanceLevelText|LogBG|EnhanceBtn)(?:\/|$)/.test(f.path))
 ));
 if(unexpected.length) throw new Error(JSON.stringify(unexpected));
 report('No new lint errors; 43 pre-existing legacy findings preserved.');
}
console.log('UI repair: inventory, enhancement and keyboard layout written.');
