const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const {UIBuilder} = require(path.join(root,'.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs'));
const {lintUiFile} = require(path.join(root,'.agents/skills/msw-ui-system/scripts/ui_lint.cjs'));
const report=console.log;
console.log=(...args)=>{if(!/^(  |Loaded |Written |WARN ui_lint|OK ui_lint)/.test(String(args[0])))report(...args);};
const S='MOD.Core.SpriteGUIRendererComponent', T='MOD.Core.TextGUIRendererComponent', U='MOD.Core.UITransformComponent';
const flat='4fea64a3307cda641809ad8be0d4890b', white={r:1,g:1,b:1,a:1};
function edit(group,fn){
  const file=path.join(root,'ui',group+'.ui');
  const baseline=lintUiFile(file).filter(f=>f.severity==='error');
  const b=UIBuilder.read(file), ids=b.listEntities().map(e=>[e.path,b.getId(e.path)]);
  fn(b);
  let failure;try{b.write(file);}catch(e){failure=e;}
  const after=lintUiFile(file).filter(f=>f.severity==='error');
  const known=new Set(baseline.map(f=>f.rule+'|'+f.path));
  assert.deepEqual(after.filter(f=>!known.has(f.rule+'|'+f.path)),[]);
  if(failure&&!after.length)throw failure;
  const check=UIBuilder.read(file);
  for(const [p,id]of ids)assert.equal(check.getId(p),id);
  report(group+': UUIDs preserved, '+after.length+' baseline lint errors, none added');
}
edit('MiniMapUI',b=>{
  b.patchComponent('/','MOD.Core.UIGroupComponent',{GroupType:1,GroupOrder:-1});
  b.patch('Board/ResizeGrip',{enable:false});
  b.patch('Board/BtnSizeUp',{enable:false});
  b.patch('Board/BtnSizeDown',{anchor:'top-right',pivot:[1,1],pos:[-8,-6],rect_size:[28,26],display_order:1000});
  b.patchComponent('Board/BtnSizeDown',T,{Text:'-',FontSize:21,FontColor:white});
  b.patchComponent('Board/BtnSizeDown','MOD.Core.ButtonComponent',{Transition:0});
  b.patch('Board/MoveGrip',{anchor:'top-left',pivot:[0,1],pos:[8,-5],rect_size:[396,28]});
  b.patch('Board/MiniTitle',{pos:[14,-8]});
});
edit('DefaultGroup',b=>{
  // Replace the stitched bands with one image; text/entity bindings stay untouched.
  const plate='MapleHUD/LevelPlate';
  for(let i=1;i<=12;i++)b.patch(plate+'/Fade'+i,{enable:false});
  b.sprite(plate+'/Background',{anchor:'middle-center',pos:[0,0],pivot:[.5,.5],rect_size:[330,42],
    image_ruid:'5abf27ffb8854b85ba206181778a1c00',color:white,sprite_type:0,raycast:false});
  b.patch(plate+'/Background',{display_order:-1});
  // The slot image includes its own fine edge. Disable old doubled outline/drop shadow.
  for(const e of b.listEntities().filter(e=>/\/InvenWindow\/InvenSlot\d+\/SlotBG$/.test(e.path))){
    b.patchComponent(e.path,S,{ImageRUID:{DataId:'801e17e8e8a64904afde1a6434c4c369'},Color:white,Type:0,
      DropShadow:false,Outline:false,OutlineWidth:0,PreserveSprite:0});
  }
  const chat='MapleHUD/ChatBox';
  b.setComponentEnabled(chat,'MOD.Core.ChatComponent',false);
  b.patchComponent(chat,'MOD.Core.ChatComponent',{HideWorldChatButton:true,UseChatBalloon:false,EnableVoiceChat:false});
  const bg=chat+'/SimpleChatBG';
  b.patch(bg,{anchor:'stretch',pos:[0,0],rect_size:[0,0],enable:true,display_order:-10});
  b.patchComponent(bg,U,{OffsetMin:{x:0,y:0},OffsetMax:{x:0,y:0}});
  b.patchComponent(bg,S,{ImageRUID:{DataId:flat},Type:0,Color:{r:.085,g:.095,b:.11,a:.88},RaycastTarget:true,Outline:false,DropShadow:false});
  for(let i=1;i<=18;i++)b.patch(chat+'/SimpleLine'+i,{enable:false});
  b.patch(chat+'/MoveGrip',{anchor:'top-left',pivot:[0,1],pos:[8,-5],rect_size:[602,24],display_order:10});
  b.patch(chat+'/ResizeGrip',{anchor:'top-left',pivot:[0,1],pos:[0,0],rect_size:[650,5],display_order:11});
  b.patchComponent(chat+'/MoveGrip',S,{ImageRUID:{DataId:flat},Color:{r:1,g:1,b:1,a:0},RaycastTarget:true});
  b.patchComponent(chat+'/ResizeGrip',S,{ImageRUID:{DataId:flat},Color:{r:.42,g:.45,b:.49,a:.75},RaycastTarget:true});
  b.text(chat+'/Title','채팅',{size:14,color:'#e6e8eb',anchor:'top-left',pos:[12,-6],rect_size:[100,22],alignment:3});
  b.button(chat+'/BtnCollapse','-',{font_size:21,color:white,bg_color:{r:.19,g:.20,b:.22,a:1},
    anchor:'top-right',pos:[-6,-4],rect_size:[28,24],image_ruid:flat,sprite_type:0});
  b.patchComponent(chat+'/BtnCollapse','MOD.Core.ButtonComponent',{Transition:0});
  b.patch(chat+'/BtnCollapse',{display_order:30});
  b.mask(chat+'/Messages',{anchor:'bottom-left',pos:[12,30],rect_size:[626,174],image_ruid:flat,alpha:0});
  b.text(chat+'/Messages/Log','',{anchor:'bottom-left',pos:[0,0],rect_size:[626,24],size:17,color:white,alignment:6,overflow:1});
  b.patchComponent(chat+'/Messages/Log',T,{Font:'Maple',FontColor:white,IsRichText:false,EnableProfanityFilter:true,
    AllowAutomaticTranslation:false,Overflow:2,Underlay:false,OutlineWidth:0});
  b.textInput(chat+'/Input',{anchor:'bottom-left',pos:[10,3],rect_size:[630,26],font_size:17,color:white,
    bg_color:{r:.13,g:.145,b:.16,a:.98},image_ruid:flat,sprite_type:0,placeholder:'Enter 키로 채팅',char_limit:280,line_type:0});
  b.patchComponent(chat+'/Input',T,{Font:'Maple',IsRichText:false,HorizontalAlignment:1,VerticalAlignment:512,
    Padding:{left:6,right:6,top:0,bottom:0},Overflow:2});
  b.patchComponent(chat+'/Input','MOD.Core.TextGUIRendererInputComponent',{AutoClear:true,PlaceHolderColor:{r:.65,g:.68,b:.72,a:1}});
  b.patch(chat+'/Input',{display_order:20});
});
