const fs=require('fs'),path=require('path');
const root='/Users/florence/Desktop';
const base=root+'/RootDesk/MyDesk/';
function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(p,d.name)):[path.join(p,d.name)]);}
for(const p of walk(base).filter(p=>p.endsWith('.mlua'))){let t=fs.readFileSync(p,'utf8');let s=t.replaceAll('/ui/DefaultGroup/LoginGroup','/ui/LoginScene/Stage/LoginGroup').replaceAll('/ui/DefaultGroup/CharacterSelectGroup','/ui/LoginScene/Stage/CharacterSelectGroup').replaceAll('/ui/DefaultGroup/CreateCharacter','/ui/LoginScene/Stage/CreateCharacter');if(s!==t)fs.writeFileSync(p,s);}
function edit(p,fn){let t=fs.readFileSync(base+p,'utf8');let s=fn(t);if(s!==t)fs.writeFileSync(base+p,s);}
function method(t,name,body){const re=new RegExp('(^[ \\t]*)method ([^\\n]+) '+name+'\\(([^\\n]*)\\)\\n[\\s\\S]*?\\n\\1end','m');if(!re.test(t))throw Error('Missing method '+name);return t.replace(re,(_,indent,ret,args)=>`${indent}method ${ret} ${name}(${args})\n${body.split('\n').map(l=>indent+'\t'+l).join('\n')}\n${indent}end`);}
edit('KeyboardInputManager.mlua',t=>{
 t=method(t,'OnKeyDown',`-- 로그인 입력은 게임 입력 차단보다 먼저 전용 컨트롤러로 전달한다.
if _LoginFlow:IsInGame() then return end
if e.key == KeyboardKey.Escape then _LoginFlow:Action("back") return end
if e.key == KeyboardKey.Return then
    local phase = _LoginFlow.phase
    if phase == "login" then _LoginFlow:Action("login")
    elseif phase == "channel" then _LoginFlow:Action("channelEnter")
    elseif phase == "character" then _LoginFlow:Action("enter") end
elseif _LoginFlow.phase == "character" and not _LoginFlow.busy then
    if e.key == KeyboardKey.LeftArrow then self:DoNavigate(-1)
    elseif e.key == KeyboardKey.RightArrow then self:DoNavigate(1)
    elseif e.key == KeyboardKey.UpArrow then self:DoPage(-1)
    elseif e.key == KeyboardKey.DownArrow then self:DoPage(1) end
end`);
 t=method(t,'DoLogin','-- 기존 호출자도 월드 선택 단계를 거친다.\n_LoginFlow:Action("login")');
 t=method(t,'ResetCharSelectPositions','-- 새 UI는 빌더 좌표가 기준이며 실행 시 위치를 덮어쓰지 않는다.');
 t=method(t,'DoAutoCreateCharacter','-- 단축키로 생성 절차를 우회하지 않는다.\n_LoginFlow:Action("create")');return t;
});
edit('UIEquipInventoryManager.mlua',t=>{
 t=t.replace(/\t\tsetEnable\("\/ui\/LoginScene\/Stage\/(LoginGroup|CharacterSelectGroup|CreateCharacter)"[^\n]*\n/g,'');
 const start=t.indexOf('\t\tlocal lgBase =');const end=t.indexOf('\n\t\tlog("[EquipInven] ready")',start);
 if(start>=0&&end>=0)t=t.slice(0,start)+t.slice(end);return t;
});
edit('UI/UIItemDiscardManager.mlua',t=>t.replace('return self.pending or self.clock < self.releaseUntil','return not _LoginFlow:IsInGame() or self.pending or self.clock < self.releaseUntil'));
edit('CharacterSlotButton.mlua',t=>{
 t=t.replace('if #parts < 7 then return end','if #parts < 7 then return end\n\t\tif not _LoginFlow:BeginEntry() then return end\n\t\tcharSelectComp:SelectSlot(slotNum)');
 const start=t.indexOf('\t\t-- 로그인/캐릭터 선택 패널만');const end=t.indexOf('\t\t-- 장비창에',start);
 if(start>=0&&end>=0)t=t.slice(0,start)+t.slice(end);return t;
});
edit('CreateCharacterok.mlua',t=>{
 t=t.replace('@EventSender("Self")\n\thandler HandleButtonClickEvent(ButtonClickEvent event)','@ExecSpace("ClientOnly")\n\tmethod void Submit()\n\t\t-- 이름과 직업을 검증한 후 기존 서버 저장 경로로 생성한다.');
 t=t.replace('nameInput.TextInputComponent.Text','nameInput.TextGUIRendererInputComponent.Text');
 t=t.replace(/print\(("[^\n]+")\)/g,'_LoginFlow:Notice($1, "")');
 return t;
});
edit('CharacterSettingComponent.mlua',t=>t.replace('entity.TextComponent.Text = text','entity.TextGUIRendererComponent.Text = text').replace('Color(0.25, 0.25, 0.62, 0.95)','Color(1, 0.72, 0.34, 1)').replace('Color(0.1, 0.1, 0.27, 0.8)','Color(1, 1, 1, 1)').replace('okBtn.ButtonComponent.Enable = self.jobIdx > 0','okBtn.ButtonComponent.Enable = _LoginFlow.phase == "create" or self.jobIdx > 0'));
edit('CharacterSelectComponent.mlua',t=>{
 t=t.replaceAll('nameText.TextComponent.Text','nameText.TextGUIRendererComponent.Text');
 t=t.replace('Color(0.24, 0.42, 0.78, 0.95)','Color(1, 1, 1, 1)').replace('Color(0.145098045, 0.168627456, 0.2901961, 0.85)','Color(0.5, 0.4, 0.3, 0.55)');
 t=t.replace('\t\tself:UpdatePageUI()','\t\t_LoginFlow:SelectionChanged()\n\t\tself:UpdatePageUI()');return t;
});
edit('Persistence/CharacterPersistence.mlua',t=>{
 t=t.replace('accountText.TextComponent','accountText.TextGUIRendererComponent');
 t=t.replace('accountText.TextComponent','accountText.TextGUIRendererComponent');
 const start=t.indexOf('\t\t-- 선택창 표시 준비');const end=t.indexOf('\t\tself:PopulateSelectUI()',start);
 if(start>=0&&end>=0)t=t.slice(0,start)+'\t\t_LoginFlow:ShowCharacters()\n\n'+t.slice(end);
 t=t.replace('print(reason)','_LoginFlow:Notice(reason, "")');
 t=t.replace('_UIToast:ShowMessage(msg)','_LoginFlow:EntryFailed(msg)');
 t=t.replace('self:MarkDirty("init")','self:MarkDirty("init")\n\t\t_LoginFlow:CharacterRestored()');
 t=t.replace('self:ReceiveCharacterSave(saveStr, senderUserId)','_LoginFlow:AuthorizeEntry(senderUserId)\n\t\tself:ReceiveCharacterSave(saveStr, senderUserId)');
 t=t.replace(/(method void RequestEnterCharacter\([^\n]+\)\n)/,'$1\t\t-- 채널 선택이 확정되기 전에는 인게임 데이터를 활성화하지 않는다.\n\t\tif not _LoginFlow:CanEnterServer(senderUserId) then return end\n');
 t=t.replace('print("캐릭터가 삭제되었습니다. (7일간 보관 후 영구 삭제)")','_LoginFlow:Notice("캐릭터가 삭제되었습니다.\\n7일간 보관 후 영구 삭제됩니다.", "")');
 return t;
});
console.log('Login references migrated; persistence format retained.');
