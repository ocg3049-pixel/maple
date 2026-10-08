const {UIBuilder}=require('../.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const fs=require('node:fs');
const backup='/private/tmp/msw-reward-tutorial-before';
const T='MOD.Core.UITransformComponent',S='MOD.Core.SpriteGUIRendererComponent',TXT='MOD.Core.TextGUIRendererComponent';
const load=(name)=>{const b=UIBuilder.read('ui/'+name+'.ui');if(!fs.existsSync(backup+'/'+name+'.ui'))b.write(backup+'/'+name+'.ui',{lint:false});return b;};
const b=load('DefaultGroup');
for(const [name,x] of [['BtnMap',-66],['BtnInven',-198],['BtnEnhance',-330],['BtnSkill',-462],['BtnAutoHunt',-594]])b.patch('MapleHUD/'+name,{anchor:'top-right',pivot:[.5,.5],pos:[x,-184],rect_size:[120,96]});
b.patch('MapleHUD/BtnInven/Icon',{pos:[0,18],rect_size:[46,46]});
b.patch('MapleHUD/BtnInven/Label',{pos:[0,-28],rect_size:[116,40]});
b.patchComponent('MapleHUD/BtnInven/Label',TXT,{FontSize:18});
// Close the former inventory gap in the lower shortcut row.
for(const [name,x] of [['BtnEquip',-570],['BtnCharInfo',-506],['BtnKeySetting',-442],['BtnCashShop',-378],['BtnShop',-314],['BtnCodex',-250]])b.patch('MapleHUD/'+name,{pos:[x,26]});
const addReward=(ui,path,pos,size,iconSize,labelSize)=>{
 ui.button(path,'',{anchor:'top-right',pivot:[.5,.5],pos,rect_size:size,bg_color:{r:1,g:.953,b:.847,a:.95}});
 ui.sprite(path+'/Glow',{rect_size:[size[0]+10,size[1]+10],color:'#FFC74D',alpha:.45,raycast:false,enable:false});
 ui.sprite(path+'/Icon',{pos:[0,size[1]*.18],rect_size:[iconSize,iconSize],image_ruid:'1ba8494660c64b0a94a4c6bd0d67294c',sprite_type:0,color:'#FFFFFF',alpha:1});
 ui.text(path+'/Label','보상',{pos:[0,-size[1]*.29],rect_size:[size[0]-4,size[1]*.4],size:labelSize,color:'#49392C'});
};
addReward(b,'MapleHUD/BtnReward',[-726,-184],[120,96],46,18);
b.write('ui/DefaultGroup.ui',{strict:false});
const mobile=load('MobileBase');addReward(mobile,'HUD/Reward',[-870,-258],[208,176],68,32);mobile.write('ui/MobileBase.ui',{strict:false});
for(const name of ['LevelRewardGroup','OfflineRestGroup']){const old=load(name);if(old.find('Bulb'))old.remove('Bulb');old.write('ui/'+name+'.ui',{strict:false});}
const tut=load('MapleTutorial');tut.patch('Guide/Body',{rect_size:[390,168]});tut.patchComponent('Guide/Body',TXT,{FontSize:20});tut.write('ui/MapleTutorial.ui');
const ui=new UIBuilder('RewardCenter',91,true);
ui.sprite('Modal',{rect_size:[1920,1080],color:'#000000',alpha:.62,raycast:true,enable:false});
ui.panel('Modal/Panel',{rect_size:[1100,860],color:'#F6EFDF',alpha:1,raycast:true});
ui.panel('Modal/Panel/Header',{pos:[0,372],rect_size:[1080,96],color:'#59422D',alpha:1});
ui.text('Modal/Panel/Title','모아 받는 보상',{pos:[-80,372],rect_size:[820,70],size:38,bold:true,color:'#FFF5DE',alignment:3});
ui.button('Modal/Panel/Close','닫기',{pos:[466,372],rect_size:[112,88],font_size:24,bg_color:'#76583B',color:'#FFFFFF'});
ui.text('Modal/Panel/Subtitle','휴식 · 출석 · 이벤트 목표 · 레벨업 · 튜토리얼',{pos:[0,294],rect_size:[1000,42],size:23,color:'#725A42'});
for(let i=1;i<=5;i++){
 const p='Modal/Panel/Row'+i;
 ui.panel(p,{pos:[0,216-(i-1)*105],rect_size:[1010,97],color:i%2?'#FFFFFF':'#EDE3D0',alpha:1});
 ui.text(p+'/Title','',{pos:[-5,29],rect_size:[960,28],size:23,bold:true,color:'#705127',alignment:3});
 ui.text(p+'/Reason','',{pos:[-5,0],rect_size:[960,27],size:20,color:'#796C5F',alignment:3});
 ui.text(p+'/Reward','',{pos:[-5,-29],rect_size:[960,31],size:25,color:'#225A50',alignment:3});
}
ui.text('Modal/Panel/Empty','',{rect_size:[960,340],size:28,color:'#796C5F'});
ui.button('Modal/Panel/Prev','이전',{pos:[-430,-300],rect_size:[130,88],font_size:24,bg_color:'#D6C5A5',color:'#49392C'});
ui.text('Modal/Panel/Pages','1 / 1',{pos:[-295,-300],rect_size:[120,60],size:24,color:'#49392C'});
ui.button('Modal/Panel/Next','다음',{pos:[-160,-300],rect_size:[130,88],font_size:24,bg_color:'#D6C5A5',color:'#49392C'});
ui.button('Modal/Panel/Claim','모두 받기',{pos:[278,-300],rect_size:[450,88],font_size:30,bg_color:'#387A67',color:'#FFFFFF'});
ui.text('Modal/Panel/Status','',{pos:[0,-386],rect_size:[1000,58],size:21,color:'#725A42'});
ui.write('ui/RewardCenter.ui');
console.log('Reward UI built');
