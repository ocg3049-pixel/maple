const path = require('node:path');
const root = path.resolve(__dirname, '..');
const {UIBuilder} = require(path.join(root,'.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs'));
const art = require(path.join(root,'RootDesk/MyDesk/Assets/UIPolish/ruids.json'));
const b=UIBuilder.read(path.join(root,'ui/MiniMapUI.ui'));
const S='MOD.Core.SpriteGUIRendererComponent', T='MOD.Core.TextGUIRendererComponent';
const white={r:1,g:1,b:1,a:1};
const skin=(p,ruid,type=1)=>b.patchComponent(p,S,{ImageRUID:{DataId:ruid},Type:type,PreserveSprite:0,Color:white});
b.patch('Board',{rect_size:[450,310]});skin('Board',art.minimap);
b.patch('Board/HeaderShade',{enable:false});b.patch('Board/RegionArtwork',{enable:false});
for(const [n,y] of [['RegionName',-46],['MapName',-73]]) {
 b.patch('Board/'+n,{anchor:'top-left',pivot:[0,1],pos:[88,y],rect_size:[345,27],display_order:6});
 const c=b.hasComponent('Board/'+n,T)?T:'MOD.Core.TextComponent';
 b.patchComponent('Board/'+n,c,{FontSize:n==='MapName'?23:20,FontColor:white,BestFit:true,MinSize:14,MaxSize:n==='MapName'?23:20,...(c===T?{HorizontalAlignment:1,VerticalAlignment:512}:{Alignment:3})});
}
b.text('Board/MiniTitle','MINI MAP',{anchor:'top-left',pos:[14,-10],rect_size:[125,22],size:15,color:'#D7EDFF',alignment:3});
b.sprite('Board/RegionIcon',{anchor:'top-left',pos:[17,-39],rect_size:[60,60],image_ruid:art.func_worldmap,color:'#FFFFFF',sprite_type:0});
b.patch('Board/MoveGrip',{anchor:'top-left',pivot:[0,1],pos:[8,-5],rect_size:[310,28],display_order:20});
b.patchComponent('Board/MoveGrip',S,{Color:{r:1,g:1,b:1,a:0},RaycastTarget:true});
for(const [n,x] of [['BtnSizeDown',-62],['BtnSizeUp',-26]]) {
 b.patch('Board/'+n,{anchor:'top-right',pivot:[.5,.5],pos:[x,-23],rect_size:[28,26],display_order:21});skin('Board/'+n,art.minimap);
}
b.sprite('Board/MapFrame',{pos:[0,-49],rect_size:[426,190],image_ruid:art.minimap,color:'#D8EFFF'});
b.patch('Board/MapFrame',{display_order:0});
b.mask('Board/MapViewport',{pos:[0,-49],rect_size:[414,178]});b.patch('Board/MapViewport',{display_order:1});
for(let i=1;i<=32;i++){
 const p='Board/MapViewport/Tile_'+i;
 b.empty(p,{rect_size:[1,1],enable:false});
 b.upsertComponent(p,'MOD.Core.RawImageGUIRendererComponent',{Enable:true});
}
for(const e of b.listEntities()) {
 if(/^MOB_|^SUM_|^PLY$/.test(e.name)) {
  skin(e.path,e.name==='PLY'?art.marker_self:art.marker_other,0);
  b.patch(e.path,{rect_size:e.name==='PLY'?[11,11]:[9,9],display_order:e.name==='PLY'?500:400});
 }
 if(/^FH_/.test(e.name)) b.patch(e.path,{display_order:2});
}
b.patch('Board/ResizeGrip',{display_order:600});
b.write(path.join(root,'ui/MiniMapUI.ui'));
// A short-lived local cover hides the capture camera. It has no controller.
const fpath=path.join(root,'ui/MiniMapCaptureUI.ui');
const fs=require('node:fs');
const f=fs.existsSync(fpath)?UIBuilder.read(fpath):new UIBuilder('MiniMapCaptureUI',100,false);
f.patchComponent('MiniMapCaptureUI','MOD.Core.UIGroupComponent',{DefaultShow:false,GroupOrder:100,GroupType:2});
f.sprite('Screen',{anchor:'stretch',rect_size:[1920,1080],alpha:0,raycast:true});
f.upsertComponent('Screen','MOD.Core.RawImageGUIRendererComponent',{Enable:true});
f.write(fpath);
