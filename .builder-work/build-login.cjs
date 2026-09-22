const fs=require('fs');
const root='/Users/florence/Desktop';
const {UIBuilder}=require(root+'/.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const assets=JSON.parse(fs.readFileSync(root+'/.builder-work/login-assets.json','utf8'));
const old=UIBuilder.read(root+'/.builder-work/login-original.ui');
const b=fs.existsSync(root+'/ui/LoginScene.ui') ? UIBuilder.read(root+'/ui/LoginScene.ui') : new UIBuilder('LoginScene',9000,true);
if(b.find('Stage/Scenery/World'))b.rename('Stage/Scenery/World','WorldScene');
b.patchComponent('LoginScene','MOD.Core.UIGroupComponent',{GroupOrder:9000,GroupType:2});
const lookup=p=>{let a=assets.find(a=>a.path.normalize('NFC')===p.normalize('NFC'));if(!a)throw Error('Missing '+p);return a;};
function img(n,p,x,y,w,h){let a=lookup(p);w=w||a.w;h=h||a.h;b.sprite(n,{image_ruid:a.ruid,color:'#FFFFFF',alpha:1,sprite_type:0,pos:[x+w/2-400,300-y-h/2],rect_size:[w,h]});return n;}
function txt(n,t,x,y,w,h,size=12,color='#56301b'){b.text(n,t,{pos:[x+w/2-400,300-y-h/2],rect_size:[w,h],size,color});}
function empty(n){b.empty(n,{rect_size:[800,600]});}
function texturePatch(n,p,pos,size,region){
 const a=lookup(p),[rx,ry,rw,rh]=region,[w,h]=size,sx=w/rw,sy=h/rh;
 b.mask(n,{pos,rect_size:size});
 b.sprite(n+'/Texture',{image_ruid:a.ruid,color:'#FFFFFF',sprite_type:0,rect_size:[a.w*sx,a.h*sy],pos:[(a.w/2-rx-rw/2)*sx,(ry+rh/2-a.h/2)*sy]});
 b.patch(n+'/Texture',{display_order:0});
}
function button(n,p,x,y,action,w,h){let a=lookup(p);img(n,p,x,y,w,h);b.addComponent(n,'MOD.Core.ButtonComponent',{Transition:2,Selectable:false,ImageRUIDs:{HighlightedSprite:lookup(p.replace('normal','mouseOver')).ruid,PressedSprite:lookup(p.replace('normal','pressed')).ruid,DisabledSprite:assets.find(a=>a.path===p.replace('normal','disabled'))?.ruid||a.ruid}});if(action)b.addComponent(n,'script.LoginActionButton',{Action:action});}
function legacy(n,oldpath,comp){let c=old.getComponent(oldpath,comp);if(c)b.upsertComponent(n,comp,c);}
b.panel('Cover',{anchor:'stretch',color:'#000000',alpha:1,raycast:true});
empty('Stage');b.patchComponent('Stage','MOD.Core.UITransformComponent',{Scale:{x:1.8,y:1.8,z:1},UIScale:{x:1.8,y:1.8,z:1}});
b.mask('Stage/Scenery',{rect_size:[800,600]});
for(const [name,sky] of [['Login',0],['WorldScene',0],['Character',1],['Create',2]]){
 const base='Stage/Scenery/'+name;empty(base);
 if(b.find(base+'/Sky'))b.remove(base+'/Sky');
 empty(base+'/Sky');b.patch(base+'/Sky',{display_order:0});
 for(let i=0;i<40;i++)img(base+'/Sky/Tile'+i,`Background/back.${sky}.png`,i*20,0,20,600);
 for(let i=3;i<=10;i++){
  img(base+'/Cloud'+i,`Background/back.${i}.png`,(i%3)*230-70,70+(i%4)*110);
  b.patch(base+'/Cloud'+i,{enable:i===3||i===6});
 }
 b.patch(base,{enable:name==='Login'});
}
img('Stage/Scenery/Login/Forest','Background/back.11.png',0,0);
img('Stage/Scenery/WorldScene/DistantTree','Background/back.12.png',0,330);
img('Stage/Scenery/WorldScene/TreeHouse','Background/back.13.png',45,-5,438,510);
img('Stage/Scenery/Character/TreeHouse','Background/back.15.png',15,-90);
img('Stage/Scenery/Character/Bridge','Background/back.14.png',0,315,751,180);
if(b.find('Stage/Scenery/Create/Tree'))b.remove('Stage/Scenery/Create/Tree');
img('Stage/Scenery/Create/House','Background/back.17.png',0,173);
img('Stage/Scenery/Create/Stem','Background/back.18.png',0,13);
img('Stage/Scenery/Create/Platform','Background/back.16.png',0,340,500,155);

const lg='Stage/LoginGroup/LoginBackground';empty('Stage/LoginGroup');empty(lg);
img(lg+'/Logo','Login화면/Title.MSTitle.png',205,28);
img(lg+'/Signboard','Login화면/login.img.Title.signboard.0.0.png',327,210);
txt(lg+'/AccountText','메이플스토리 월드',439,238,140,22);
txt(lg+'/PasswordText','연결된 계정',439,272,140,22);
button(lg+'/StartButton','Login화면/login.png',585,235,'login');
// The supplied title art keeps the old email/password labels; opaque wood-coloured
// labels replace those words without adding external credentials or web actions.
texturePatch(lg+'/AccountLabel','Login화면/login.img.Title.signboard.0.0.png',[14,57],[48,17],[65,95,48,17]);
b.text(lg+'/AccountLabel/Text','계정',{size:11,color:'#fff3d0',bold:true,rect_size:[48,17]});b.patch(lg+'/AccountLabel/Text',{display_order:1});
texturePatch(lg+'/AuthLabel','Login화면/login.img.Title.signboard.0.0.png',[14,25],[48,17],[65,95,48,17]);
b.text(lg+'/AuthLabel/Text','접속',{size:11,color:'#fff3d0',bold:true,rect_size:[48,17]});b.patch(lg+'/AuthLabel/Text',{display_order:1});
txt(lg+'/Welcome','모험을 시작할 준비가 되셨나요?',410,314,260,25,12,'#fff3d0');
button(lg+'/Quit','Login화면/Title.BtQuit.normal.0.png',594,362,'quit');
img(lg+'/Shine','Login화면/shineeffect/Title.effect.4.0.png',370,28);
b.patch(lg+'/Shine',{display_order:0});b.patch(lg+'/Logo',{display_order:1});b.patch(lg+'/Signboard',{display_order:2});

const wg='Stage/WorldGroup';empty(wg);
img(wg+'/Hanger','World/login.img.WorldSelect.signboard.0.0.png',185,-28);
button(wg+'/Scania','World/WorldSelect.BtWorld.0.normal.0.png',221,110,'world');
img(wg+'/ScrollClosed','World/WorldSelect.scroll.0.0.png',185,210);
img(wg+'/Scroll','World/WorldSelect.scroll.0.3.png',185,94);
b.addComponent(wg+'/Scroll','script.LoginSpriteAnimation',{Frames:[0,1,2,3].map(i=>lookup(`World/WorldSelect.scroll.0.${i}.png`).ruid).join(','),Heights:'152,416,408,401',TopY:206,Loop:false,Interval:0.1});
empty(wg+'/Channels');
img(wg+'/Channels/WorldName','World/WorldSelect.world.0.png',239,235);
button(wg+'/Channels/Go','World/WorldSelect.BtGoworld.normal.0.png',497,241,'channelEnter');
for(let i=1;i<=19;i++){
 let x=240+(i-1)%4*94,y=290+Math.floor((i-1)/4)*32;
 img(wg+'/Channels/Channel'+i,`World/WorldSelect.channel.${i}.normal.png`,x,y);
 b.addComponent(wg+'/Channels/Channel'+i,'MOD.Core.ButtonComponent',{Transition:0});
 b.addComponent(wg+'/Channels/Channel'+i,'script.LoginActionButton',{Action:'channel:'+i});
 b.sprite(wg+'/Channels/Channel'+i+'/Gauge',{image_ruid:lookup('World/WorldSelect.channel.chgauge.png').ruid,color:'#FFFFFF',alpha:1,sprite_type:3,fill_method:0,rect_size:[73,9],pos:[-1,-6]});
 b.patchComponent(wg+'/Channels/Channel'+i+'/Gauge','MOD.Core.SpriteGUIRendererComponent',{FillAmount:0});
 texturePatch(wg+'/Channels/Channel'+i+'/LabelPaper',`World/WorldSelect.channel.${i}.normal.png`,[0,7],[78,12],[7,0,78,1]);
 b.text(wg+'/Channels/Channel'+i+'/LabelPaper/Text','CH.'+i,{size:9,color:'#615448',rect_size:[78,12]});
 b.patch(wg+'/Channels/Channel'+i+'/LabelPaper/Text',{display_order:1});
}
img(wg+'/Channels/Selection','World/WorldSelect.channel.chSelect.3.png',226,281);
txt(wg+'/Channels/Status','서버 목록을 불러오는 중입니다.',249,456,400,18,11);
button(wg+'/Channels/Prev','Createcharacter/NewChar.BtLeft.normal.0.png',540,424,'channelPrev');
button(wg+'/Channels/Next','Createcharacter/NewChar.BtRight.normal.0.png',595,424,'channelNext');
txt(wg+'/Channels/Page','1/1',555,424,40,17,9);

const cs='Stage/CharacterSelectGroup/SelectBackground';empty('Stage/CharacterSelectGroup');empty(cs);
b.addComponent(cs,'script.CharacterSelectComponent');
img(cs+'/Signboard','Sellectcharacter/login.img.CharSelect.signboard.0.0.png',568,148);
button(cs+'/EnterButton','Sellectcharacter/CharSelect.BtSelect.normal.0.png',584,163,'enter');
button(cs+'/CreateCharacterButton','Sellectcharacter/CharSelect.BtNew.normal.0.png',584,211,'create');
button(cs+'/DeleteCharacterButton','Sellectcharacter/CharSelect.BtDelete.normal.0.png',584,254,'delete');
for(let i=1;i<=3;i++){
 const n=cs+'/CharacterSlot'+i,x=215+(i-1)*115;
 b.button(n,'',{rect_size:[100,140],pos:[x-400,300-370],bg_color:{r:1,g:1,b:1,a:0},sprite_type:0});
 b.patchComponent(n,'MOD.Core.ButtonComponent',{Transition:0,Selectable:false});
 b.addComponent(n,'script.CharacterSlotButton');
 b.sprite(n+'/SlotBG',{image_ruid:lookup('Sellectcharacter/Onnametag1.png').ruid,color:'#FFFFFF',alpha:1,sprite_type:0,pos:[0,-14],rect_size:[84,20]});
 b.text(n+'/NameText','',{size:11,color:'#FFFFFF',pos:[0,-13],rect_size:[100,20]});
 b.avatar(n+'/SlotAvatar',{pos:[0,-4],rect_size:[64,90],preserve_avatar:2,raycast:false});
 for(const c of old.find('CharacterSelectGroup/SelectBackground/CharacterSlot'+i+'/SlotAvatar').jsonString['@components'])if(!/UITransform|AvatarGUIRenderer/.test(c['@type']))b.upsertComponent(n+'/SlotAvatar',c['@type'],c);
 b.patch(n+'/SlotBG',{display_order:0});b.patch(n+'/SlotAvatar',{display_order:1});b.patch(n+'/NameText',{display_order:2});
 b.sprite(n+'/SelectionLight',{image_ruid:lookup('Effect/shine/CharSelect.effect.0.0.png').ruid,color:'#FFFFFF',alpha:0.6,sprite_type:0,pos:[0,62],rect_size:[49,134],enable:false});
 b.addComponent(n+'/SelectionLight','script.LoginSpriteAnimation',{Frames:Array.from({length:6},(_,j)=>lookup(`Effect/shine/CharSelect.effect.0.${j}.png`).ruid).join(','),Interval:0.12});
 b.patch(n+'/SelectionLight',{display_order:0});
}
button(cs+'/PrevPageButton','Createcharacter/NewChar.BtLeft.normal.0.png',273,416,'prevPage',22,24);
button(cs+'/NextPageButton','Createcharacter/NewChar.BtRight.normal.0.png',405,416,'nextPage',22,24);
txt(cs+'/PageText','1 / 4',308,416,84,24,12,'#ffffff');
img(cs+'/InfoScroll','Effect/shine/scroll/CharSelect.scroll.0.3.png',205,90);
txt(cs+'/InfoScroll/Info','',410,204,104,98,12);
// Child coordinates are local to the parchment, not to the 800x600 stage.
b.patch(cs+'/InfoScroll/Info',{pos:[0,0],rect_size:[104,98]});

const cc='Stage/CreateCharacter/CreateCharacterBackground';empty('Stage/CreateCharacter');empty(cc);
img(cc+'/Signboard','Sellectcharacter/login.img.NewChar.signboard.0.0.png',500,104);
b.textInput(cc+'/CreateCharacterName',{placeholder:'캐릭터 이름',char_limit:12,font_size:13,color:'#fff5dc',bg_color:{r:0.3,g:0.12,b:0,a:0.25},pos:[198,89],rect_size:[156,27]});
b.avatar(cc+'/PreviewAvatar',{pos:[0,-48],rect_size:[64,90],preserve_avatar:2,raycast:false});
for(const c of old.find('CreateCharacter/CreateCharacterBackground/PreviewAvatar').jsonString['@components'])if(!/UITransform|AvatarGUIRenderer/.test(c['@type']))b.upsertComponent(cc+'/PreviewAvatar',c['@type'],c);
const cp=cc+'/CharacterSettingPanel';empty(cp);b.addComponent(cp,'script.CharacterSettingComponent');
for(const [i,row] of ['Face','Hair','Top','Bottom','Shoes','Weapon'].entries()){
 const n=cp+'/Row_'+row;
 img(n,`Createcharacter/avatar/NewChar.avatarSel.${i}.normal.png`,506,250+i*19,186,17);
 button(n+'/FacePrevButton','Createcharacter/NewChar.BtLeft.normal.0.png',0,0,null);
 button(n+'/FaceNextButton','Createcharacter/NewChar.BtRight.normal.0.png',0,0,null);
 b.patch(n+'/FacePrevButton',{pos:[-22,0]});b.patch(n+'/FaceNextButton',{pos:[85,0]});
 b.text(n+'/FaceValueText','',{size:10,color:'#6d3418',pos:[30,0],rect_size:[80,17]});
}
button(cc+'/CreateCharacterok','Createcharacter/NewChar.BtYes.normal.0.png',519,388,'createNext');
b.addComponent(cc+'/CreateCharacterok','script.CreateCharacterok');
button(cc+'/Cancel','Createcharacter/NewChar.BtNo.normal.0.png',602,388,'cancelCreate');
const jp=cc+'/JobSelectPanel';b.panel(jp,{pos:[199,-6],rect_size:[170,126],color:'#ffebc3',alpha:1});
b.text(jp+'/JobTitleText','직업 선택',{size:12,color:'#643213',pos:[0,51],rect_size:[165,19]});
const jobs=['히어로','팔라딘','다크나이트','비숍','썬콜','불독','신궁','보우마스터','나이트로드','섀도어'];
for(let i=1;i<=10;i++)b.button(jp+'/JobBtn_'+i,jobs[i-1],{pos:[i%2?-41:41,29-Math.floor((i-1)/2)*21],rect_size:[78,19],font_size:10,color:'#643213',bg_color:'#f4d099'});
b.patch(jp,{enable:false});

img('Stage/BookFrame','bookframe.png',0,0,800,600);b.patch('Stage/BookFrame',{display_order:800});
empty('Stage/Navigation');b.patch('Stage/Navigation',{display_order:900});
img('Stage/Navigation/Step','World/Common.step.1.png',0,37);
img('Stage/Navigation/WorldLabel','World/Common.selectWorld.png',0,102);
txt('Stage/Navigation/WorldLabel/Value','스카니아\nCH.1',0,0,80,50,12,'#ffecd4');b.patch('Stage/Navigation/WorldLabel/Value',{pos:[22,0]});
b.patchComponent('Stage/Navigation/WorldLabel/Value','MOD.Core.TextGUIRendererComponent',{OverrideSorting:true,OrderInLayer:1000});
img('Stage/Navigation/Back','처음으로1.png',0,426);b.addComponent('Stage/Navigation/Back','MOD.Core.ButtonComponent',{Transition:2,ImageRUIDs:{HighlightedSprite:lookup('처음으로2.png').ruid,PressedSprite:lookup('처음으로3.png').ruid}});b.addComponent('Stage/Navigation/Back','script.LoginActionButton',{Action:'back'});
b.mask('Stage/Navigation/StepCustom',{pos:[-336,234],rect_size:[118,43]});
if(b.find('Stage/Navigation/StepCustom/Texture'))b.remove('Stage/Navigation/StepCustom/Texture');
for(let y=0;y<4;y++)for(let x=0;x<9;x++)texturePatch(`Stage/Navigation/StepCustom/Tile${x}_${y}`,'World/Common.step.1.png',[-52+x*14,14.5-y*14],[14,14],[0,28,14,14]);
b.text('Stage/Navigation/StepCustom/Text','캐릭터 선택',{size:14,color:'#fff3dd',bold:true,pos:[0,5],rect_size:[118,24]});
b.text('Stage/Navigation/StepCustom/Sub','CHARACTER SELECT',{size:7,color:'#c6a387',pos:[0,-12],rect_size:[118,12]});
b.patch('Stage/Navigation/StepCustom/Text',{display_order:100});b.patch('Stage/Navigation/StepCustom/Sub',{display_order:101});
b.patch('Stage/Navigation/StepCustom/Text',{enable:false});b.patch('Stage/Navigation/StepCustom/Sub',{enable:false});b.patch('Stage/Navigation/WorldLabel/Value',{enable:false});
txt('Stage/Navigation/Title','캐릭터 선택',5,49,118,24,14,'#fff3dd');
txt('Stage/Navigation/Subtitle','CHARACTER SELECT',5,75,118,12,7,'#c6a387');
txt('Stage/Navigation/WorldValue','스카니아\nCH.1',48,105,80,50,12,'#ffecd4');
for(const n of ['Title','Subtitle','WorldValue'])b.patch('Stage/Navigation/'+n,{display_order:1000});
b.patchComponent('Stage/Navigation/Title','MOD.Core.TextGUIRendererComponent',{FontStyle:1});

b.panel('Modal',{anchor:'stretch',color:'#000000',alpha:0.4,raycast:true,enable:false});
b.sprite('Modal/Paper',{image_ruid:lookup('Notice/Notice.backgrnd.0.png').ruid,color:'#FFFFFF',sprite_type:0,rect_size:[652,394]});
b.text('Modal/Paper/Message','',{pos:[35,35],rect_size:[400,190],size:21,color:'#673f25'});
for(const [name,art,x,action] of [['Yes','Yes',-65,'noticeYes'],['No','No',105,'noticeNo']]){
 b.sprite('Modal/Paper/'+name,{image_ruid:lookup(`Notice/Notice.Bt${art}.normal.0.png`).ruid,color:'#FFFFFF',sprite_type:0,pos:[x,-120],rect_size:[135,58]});
 b.addComponent('Modal/Paper/'+name,'MOD.Core.ButtonComponent',{Transition:2,ImageRUIDs:{HighlightedSprite:lookup(`Notice/Notice.Bt${art}.mouseOver.0.png`).ruid,PressedSprite:lookup(`Notice/Notice.Bt${art}.pressed.0.png`).ruid}});
 b.addComponent('Modal/Paper/'+name,'script.LoginActionButton',{Action:action});
}
for(const n of ['Stage/WorldGroup','Stage/CharacterSelectGroup','Stage/CreateCharacter','Stage/Navigation'])b.patch(n,{enable:false});
for(const e of b.listEntities()){
 const c=b.getComponent(e.path,'MOD.Core.ButtonComponent');
 if(c?.ImageRUIDs){for(const [k,v] of Object.entries(c.ImageRUIDs))if(typeof v==='string')c.ImageRUIDs[k]={DataId:v};b.patchComponent(e.path,'MOD.Core.ButtonComponent',{ImageRUIDs:c.ImageRUIDs});}
}
b.patchComponent(lg+'/StartButton','MOD.Core.ButtonComponent',{ImageRUIDs:{HighlightedSprite:{DataId:lookup('Login화면/loginmouse.png').ruid},PressedSprite:{DataId:lookup('Login화면/loginpressed.png').ruid},DisabledSprite:{DataId:lookup('Login화면/logindisabled.png').ruid}}});
b.write(root+'/ui/LoginScene.ui');
const current=UIBuilder.read(root+'/ui/DefaultGroup.ui');
for(const n of ['LoginGroup','CharacterSelectGroup','CreateCharacter'])if(current.find(n))current.remove(n);
current.write(root+'/ui/DefaultGroup.ui',{strict:false});
console.log('LoginScene created with '+b.listEntities().length+' entities.');
