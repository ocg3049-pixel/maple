const { UIBuilder } = require('/Users/florence/Desktop/.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
UIBuilder.snapshot('ui/DefaultGroup.ui');

const SPR='MOD.Core.SpriteGUIRendererComponent', TXT='MOD.Core.TextComponent';
const flat='4fea64a3307cda641809ad8be0d4890b';
const tab='27f3fbc786584f619050bcb4fba9965c';
const white={r:1,g:1,b:1,a:1}, pale={r:.91,g:.93,b:.95,a:1};
const yellow={r:1,g:.82,b:.28,a:1}, cyan={r:.18,g:.64,b:.78,a:1};
const dark={r:.12,g:.15,b:.19,a:1}, inactive={r:.21,g:.24,b:.29,a:1};
const p=(path,v)=>b.find(path)&&b.patch(path,v);
const ps=(path,v)=>b.find(path)&&b.hasComponent(path,SPR)&&b.patchComponent(path,SPR,v);
const pt=(path,v)=>b.find(path)&&b.hasComponent(path,TXT)&&b.patchComponent(path,TXT,v);

// Equipment and decoration share one title baseline and a stronger two-way switch.
for(const path of ['EquipWindow/HeaderLabel','DecoWindow/HeaderLabel']){
  p(path,{pos:[-136,212]}); pt(path,{Text:'EQUIPMENT',FontSize:17,FontColor:yellow,Bold:true});
}
for(const [root,label] of [['EquipWindow/BtnDeco','EquipWindow/BtnDeco/Label'],['DecoWindow/BtnEquipSwitch','DecoWindow/BtnEquipSwitch/Label']]){
  p(root,{rect_size:[112,38]}); ps(root,{ImageRUID:{DataId:tab},PreserveSprite:1,Color:cyan,Type:1});
  pt(label,{FontSize:15,FontColor:white,Bold:true});
}

// Inventory category tabs use the same skin and typography as the decoration sub-tabs.
for(const key of ['equip','consume','etc','install','cash','decorate']){
  ps(`InvenWindow/InvenTab_${key}/TabBG`,{ImageRUID:{DataId:tab},PreserveSprite:1,Color:inactive,Type:1});
  pt(`InvenWindow/InvenTab_${key}/TabLbl`,{FontColor:pale,FontSize:16,Bold:false});
}

// A light-grey layered slot surface: base, soft lower shade, and a top highlight.
if(!b.find('InvenWindow/SlotAreaBG')) b.sprite('InvenWindow/SlotAreaBG',{pos:[0,-25],rect_size:[1136,568],image_ruid:flat,color:'#C9CDD2',alpha:.94,preserve:1,raycast:false});
if(!b.find('InvenWindow/SlotAreaShade')) b.sprite('InvenWindow/SlotAreaShade',{pos:[0,-190],rect_size:[1120,230],image_ruid:flat,color:'#8F969E',alpha:.20,preserve:1,raycast:false});
if(!b.find('InvenWindow/SlotAreaHighlight')) b.sprite('InvenWindow/SlotAreaHighlight',{pos:[0,245],rect_size:[1120,3],image_ruid:flat,color:'#FFFFFF',alpha:.72,preserve:1,raycast:false});
for(const n of ['SlotAreaBG','SlotAreaShade','SlotAreaHighlight']) if(b.find('InvenWindow/'+n)) b.remove('InvenWindow/'+n);
ps('InvenWindow/CompactContentBG',{ImageRUID:{DataId:flat},Color:{r:.09,g:.16,b:.24,a:.94},PreserveSprite:1,Type:1});
for(let i=1;i<=128;i++){
  const base=`InvenWindow/InvenSlot${i}`;
  if(b.find(base+'/LightOverlay')) b.remove(base+'/LightOverlay');
  if(b.find(base+'/LightSheen')) b.remove(base+'/LightSheen');
  ps(base+'/SlotBG',{ImageRUID:{DataId:flat},Color:{r:.60,g:.63,b:.67,a:.97},PreserveSprite:0,Type:0,
    Outline:true,OutlineColor:{r:.78,g:.81,b:.84,a:.72},OutlineWidth:1,
    DropShadow:true,DropShadowColor:{r:.05,g:.07,b:.09,a:.55},DropShadowDistance:2,DropShadowAngle:120});
}

// Meso is a distinct grouped card; the action stays visually separate on the far right.
if(!b.find('InvenWindow/MesoBar/MesoGroupBG')) b.sprite('InvenWindow/MesoBar/MesoGroupBG',{pos:[-360,0],rect_size:[370,40],image_ruid:tab,color:'#202934',alpha:1,preserve:1,raycast:false});
ps('InvenWindow/MesoBar/MesoGroupBG',{ImageRUID:{DataId:tab},Color:dark,PreserveSprite:1,Type:1});

// Starforce information cards no longer overlap; both values use high-contrast white text.
for(const [n,pos,size] of [['StatBoxBG',[0,-8],[544,126]],['RateBoxBG',[0,-122],[544,84]]]){
  p('EnhanceWindow/RightPanel/ContentArea/StarforceContent/'+n,{pos,rect_size:size});
  ps('EnhanceWindow/RightPanel/ContentArea/StarforceContent/'+n,{ImageRUID:{DataId:flat},Color:{r:.10,g:.14,b:.19,a:.96},PreserveSprite:1,Type:1});
}
p('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatHeader',{pos:[0,40]});
p('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatsText',{pos:[0,-18],rect_size:[500,80]});
p('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateHeader',{pos:[0,-94]});
p('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateText',{pos:[0,-130],rect_size:[510,42]});
pt('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatsText',{FontColor:white});
pt('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateText',{FontColor:white,FontSize:13});

// Scroll/Potential/Additional navigation uses the current dark/cyan tab language.
for(const n of ['EnhanceTab_Scroll','EnhanceTab_Potential','EnhanceTab_Additional']){
  ps(`EnhanceWindow/LeftPanel/${n}/TabBG`,{ImageRUID:{DataId:tab},Color:inactive,PreserveSprite:1,Type:1});
  pt(`EnhanceWindow/LeftPanel/${n}/TabLabel`,{FontColor:pale,FontSize:16});
}

// Current/new option comparison cards, hidden until a cube is consumed.
for(const [content,title] of [['PotentialContent','잠재능력 선택'],['AdditionalContent','에디셔널 선택']]){
  const root=`EnhanceWindow/RightPanel/ContentArea/${content}/ComparePanel`;
  if(!b.find(root)) b.panel(root,{pos:[0,0],rect_size:[544,650],color:'#111820',alpha:.985,raycast:true,enable:false});
  if(!b.find(root+'/Title')) b.text(root+'/Title',title,{pos:[0,280],rect_size:[520,36],size:21,color:'#FFFFFF',bold:true});
  if(!b.find(root+'/Hint')) b.text(root+'/Hint','적용할 옵션을 선택하세요. 선택 후 한 번 더 확인합니다.',{pos:[0,-278],rect_size:[520,30],size:13,color:'#C7D1DB'});
  for(const [side,x,t,c] of [['Current',-132,'현재 옵션','#303943'],['New',132,'새 옵션','#176F88']]){
    const card=root+'/'+side+'Card';
    if(!b.find(card)) b.sprite(card,{pos:[x,0],rect_size:[250,500],image_ruid:tab,color:c,alpha:1,preserve:1,raycast:true});
    if(!b.find(card+'/Title')) b.text(card+'/Title',t,{pos:[0,205],rect_size:[220,34],size:18,color:'#FFFFFF',bold:true});
    if(!b.find(card+'/Grade')) b.text(card+'/Grade','',{pos:[0,148],rect_size:[220,34],size:17,color:side==='New'?'#FFE26B':'#DCE3EA',bold:true});
    for(let i=1;i<=3;i++) if(!b.find(`${card}/Opt${i}`)) b.text(`${card}/Opt${i}`,'',{pos:[0,75-(i-1)*70],rect_size:[210,56],size:14,color:'#FFFFFF'});
    if(!b.find(card+'/Status')) b.text(card+'/Status',side==='Current'?'기존 옵션 유지':'새 옵션 적용',{pos:[0,-202],rect_size:[210,36],size:14,color:'#FFFFFF',bold:true});
  }
}

b.write('ui/DefaultGroup.ui',{lint:true,strict:false,lint_verbose:true});
console.log('inventory/enhancement refinement applied');
