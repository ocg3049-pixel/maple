const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');

const b = new UIBuilder('DefaultGroup');

const DG = '/ui/DefaultGroup';

// ─── 헬퍼: 공통 앵커 옵션 ─────────────────────────────────────────────
const MC = (px, py, w, h) => ({ anchor: 'middle-center', pos: [px, py], rect_size: [w, h] });

// ─── 1. LoginGroup ───────────────────────────────────────────────────
b.group(DG + '/LoginGroup', MC(0, 0, 1920, 1080));
b.panel(DG + '/LoginGroup/LoginBackground', MC(0, 0, 860, 640), { color: { r:0.05, g:0.05, b:0.15, a:0.92 } });
b.upsertComponent(DG + '/LoginGroup/LoginBackground', 'MOD.Core.SpriteGUIRendererComponent', { Color:{r:0.05,g:0.05,b:0.15,a:0.92} });
b.upsertComponent(DG + '/LoginGroup/LoginBackground', 'script.loginbackground', { Enable: true });
b.text(DG + '/LoginGroup/LoginBackground/TitleText', 'MapleStory Worlds', { anchor:'middle-center', pos:[0, 250], rect_size:[600, 60], size:36, bold:true, color:{r:0.2,g:0.9,b:0.4} });
b.text(DG + '/LoginGroup/LoginBackground/AccountText', '', { anchor:'middle-center', pos:[0, -200], rect_size:[500, 40], size:20, color:{r:1,g:1,b:1} });
b.text(DG + '/LoginGroup/LoginBackground/PasswordText', '', { anchor:'middle-center', pos:[0, -300], rect_size:[500, 40], size:18, color:{r:0.8,g:0.8,b:0.8} });
b.button(DG + '/LoginGroup/LoginBackground/StartButton', '시작', { anchor:'middle-center', pos:[300, -250], rect_size:[140, 50] });
b.upsertComponent(DG + '/LoginGroup/LoginBackground/StartButton', 'script.loginbutton', { Enable: true });

// ─── 2. CharacterSelectGroup ─────────────────────────────────────────
b.group(DG + '/CharacterSelectGroup', MC(0, 0, 1920, 1080));
b.panel(DG + '/CharacterSelectGroup/SelectBackground', MC(0, 0, 1600, 900), { color:{r:0.06,g:0.06,b:0.18,a:0.95} });
b.upsertComponent(DG + '/CharacterSelectGroup/SelectBackground', 'MOD.Core.SpriteGUIRendererComponent', { Color:{r:0.06,g:0.06,b:0.18,a:0.95} });
b.upsertComponent(DG + '/CharacterSelectGroup/SelectBackground', 'script.CharacterSelectComponent', { Enable: true });

// 캐릭터 슬롯 3개
const slotXs = [-300, 0, 300];
for (let i = 1; i <= 3; i++) {
  const sx = slotXs[i-1];
  const sBase = DG + '/CharacterSelectGroup/SelectBackground/CharacterSlot' + i;
  b.button(sBase, '슬롯 ' + i, { anchor:'middle-center', pos:[sx, 20], rect_size:[200, 340] });
  b.upsertComponent(sBase, 'script.CharacterSlotButton', { Enable: true });
  b.avatar(sBase + '/SlotAvatar', { anchor:'middle-center', pos:[0, 50], rect_size:[160, 220] });
  b.text(sBase + '/NameText', '', { anchor:'middle-center', pos:[0, -130], rect_size:[190, 30], size:16, color:{r:1,g:1,b:1} });
}

// 캐릭터 생성/삭제 버튼
b.button(DG + '/CharacterSelectGroup/SelectBackground/CreateCharacterButton', '캐릭터 생성', { anchor:'middle-center', pos:[700, 100], rect_size:[200, 60] });
b.upsertComponent(DG + '/CharacterSelectGroup/SelectBackground/CreateCharacterButton', 'script.createcharacter', { Enable: true });
b.button(DG + '/CharacterSelectGroup/SelectBackground/DeleteCharacterButton', '캐릭터 삭제', { anchor:'middle-center', pos:[700, -100], rect_size:[200, 60] });
b.upsertComponent(DG + '/CharacterSelectGroup/SelectBackground/DeleteCharacterButton', 'script.DeleteCharacterButton', { Enable: true });

// ─── 3. CreateCharacter ──────────────────────────────────────────────
b.group(DG + '/CreateCharacter', MC(0, 0, 1920, 1080));
b.panel(DG + '/CreateCharacter/CreateCharacterBackground', MC(0, 0, 1400, 900), { color:{r:0.06,g:0.06,b:0.18,a:0.95} });
b.text(DG + '/CreateCharacter/CreateCharacterBackground/NameLabel', '캐릭터 이름', { anchor:'middle-center', pos:[-400, 335], rect_size:[300, 26], size:14, color:{r:0.8,g:0.8,b:1} });
b.textInput(DG + '/CreateCharacter/CreateCharacterBackground/CreateCharacterName', { anchor:'middle-center', pos:[-400, 300], rect_size:[300, 44], font_size:18, placeholder:'닉네임 입력 (한글 2자+/영문 3자+)', char_limit:20 });
b.button(DG + '/CreateCharacter/CreateCharacterBackground/CreateCharacterok', '확인', { anchor:'middle-center', pos:[500, -300], rect_size:[140, 50] });
b.upsertComponent(DG + '/CreateCharacter/CreateCharacterBackground/CreateCharacterok', 'script.CreateCharacterok', { Enable: true });
b.avatar(DG + '/CreateCharacter/CreateCharacterBackground/PreviewAvatar', { anchor:'middle-center', pos:[-300, 0], rect_size:[260, 400] });

// CharacterSettingPanel + 행들
const panelBase = DG + '/CreateCharacter/CreateCharacterBackground/CharacterSettingPanel';
b.panel(panelBase, MC(200, 0, 700, 480));
b.upsertComponent(panelBase, 'script.CharacterSettingComponent', { Enable: true });
const rows = [
  ['Row_Face',   0,  180],
  ['Row_Hair',   0,  120],
  ['Row_Top',    0,   60],
  ['Row_Bottom', 0,    0],
  ['Row_Shoes',  0,  -60],
  ['Row_Weapon', 0, -120],
  ['Row_Gender', 0, -180],
];
for (const [rowName, rx, ry] of rows) {
  const rBase = panelBase + '/' + rowName;
  b.panel(rBase, MC(rx, ry, 680, 50));
  b.text(rBase + '/FaceLabel', rowName.replace('Row_', ''), { anchor:'middle-center', pos:[-150, 0], rect_size:[120, 40], size:16, color:{r:1,g:1,b:1} });
  b.button(rBase + '/FacePrevButton', '<', { anchor:'middle-center', pos:[-70, 0], rect_size:[60, 40] });
  b.text(rBase + '/FaceValueText', '', { anchor:'middle-center', pos:[20, 0], rect_size:[200, 40], size:14, color:{r:1,g:1,b:1} });
  b.button(rBase + '/FaceNextButton', '>', { anchor:'middle-center', pos:[160, 0], rect_size:[60, 40] });
}

// ─── 4. EquipWindow ──────────────────────────────────────────────────
b.panel(DG + '/EquipWindow', MC(0, 0, 280, 540));
b.sprite(DG + '/EquipWindow/BG', MC(0, 0, 280, 540));
// TitleText
b.panel(DG + '/EquipWindow/TitleText', MC(0, -30, 280, 40));
b.sprite(DG + '/EquipWindow/TitleText/TitleBG', MC(0, 0, 280, 40));
b.text(DG + '/EquipWindow/TitleText/Label', 'EQUIP', { anchor:'middle-center', pos:[0, 0], rect_size:[280, 40], size:18, bold:true, color:{r:0.2,g:0.9,b:0.4} });
b.panel(DG + '/EquipWindow/CloseEquip', MC(-10, -10, 28, 22));
b.upsertComponent(DG + '/EquipWindow/CloseEquip', 'MOD.Core.UITouchReceiveComponent', {});
b.sprite(DG + '/EquipWindow/Divider', MC(0, -58, 260, 2));
b.text(DG + '/EquipWindow/HintText', '더블클릭: 장착/해제', { anchor:'middle-center', pos:[0, -85], rect_size:[260, 24], size:12, color:{r:0.8,g:0.8,b:0.8} });

const equipSlots = [
  ['SlotFace',   -95,  10],
  ['SlotHair',    95,  10],
  ['SlotTop',    -95, -100],
  ['SlotBottom',  95, -100],
  ['SlotShoes',  -95, -210],
  ['SlotWeapon',  95, -210],
  ['SlotCap',      0,  120],
];
for (const [sn, ex, ey] of equipSlots) {
  const eBase = DG + '/EquipWindow/' + sn;
  b.panel(eBase, MC(ex, ey, 74, 74));
  b.upsertComponent(eBase, 'MOD.Core.UITouchReceiveComponent', {});
  b.sprite(eBase + '/SlotBG', MC(0, 0, 74, 74));
  b.sprite(eBase + '/Icon', MC(0, -8, 50, 50));
  b.text(eBase + '/ItemName', '', { anchor:'middle-center', pos:[0, -32], rect_size:[74, 16], size:9, color:{r:1,g:1,b:1} });
  b.text(eBase + '/Label', '', { anchor:'middle-center', pos:[0, -8], rect_size:[74, 20], size:10, color:{r:0.9,g:0.9,b:0.9} });
  b.text(eBase + '/StarLabel', '', { anchor:'middle-center', pos:[0, 46], rect_size:[74, 14], size:9, color:{r:1,g:0.8,b:0} });
  b.panel(eBase + '/Touch', MC(0, 0, 74, 74));
  b.upsertComponent(eBase + '/Touch', 'MOD.Core.UITouchReceiveComponent', {});
}

// ─── 5. EnhanceWindow ─────────────────────────────────────────────────
b.panel(DG + '/EnhanceWindow', MC(0, 0, 340, 480));
b.text(DG + '/EnhanceWindow/TitleText', '장비 강화', { anchor:'middle-center', pos:[0, 200], rect_size:[300, 36], size:20, bold:true, color:{r:0.2,g:0.9,b:0.4} });
b.panel(DG + '/EnhanceWindow/CloseEnhance', MC(160, 210, 28, 22));
b.upsertComponent(DG + '/EnhanceWindow/CloseEnhance', 'MOD.Core.UITouchReceiveComponent', {});
b.text(DG + '/EnhanceWindow/TargetNameLabel', '', { anchor:'middle-center', pos:[0, 140], rect_size:[300, 30], size:16, color:{r:1,g:1,b:1} });
b.panel(DG + '/EnhanceWindow/TargetSlotBG', MC(0, 60, 80, 80));
b.sprite(DG + '/EnhanceWindow/TargetSlotBG/TargetIcon', MC(0, 0, 70, 70));
b.text(DG + '/EnhanceWindow/TargetSlotBG/StarLabel', '', { anchor:'middle-center', pos:[0, -45], rect_size:[120, 16], size:11, color:{r:1,g:0.8,b:0} });
b.text(DG + '/EnhanceWindow/EnhanceLevelText', '', { anchor:'middle-center', pos:[0, -20], rect_size:[300, 30], size:15, color:{r:1,g:1,b:0.6} });
b.panel(DG + '/EnhanceWindow/LogBG', MC(0, -120, 300, 120));
b.text(DG + '/EnhanceWindow/LogBG/EnhanceLogText', '', { anchor:'middle-center', pos:[0, 0], rect_size:[280, 110], size:13, color:{r:0.9,g:0.9,b:0.9} });
b.button(DG + '/EnhanceWindow/EnhanceBtn', '강화', { anchor:'middle-center', pos:[0, -210], rect_size:[200, 50] });

// ─── 6. InvenWindow (850×570, 4열×5행=20슬롯, 탭 없음) ───────────────
const IW = DG + '/InvenWindow';

// 슬롯 20개 위치 (ResetWindowChildren의 slotPositions 기준)
const slotPositions = [
  [-147, 160], [-49, 160], [49, 160], [147, 160],
  [-147,  62], [-49,  62], [49,  62], [147,  62],
  [-147, -36], [-49, -36], [49, -36], [147, -36],
  [-147,-134], [-49,-134], [49,-134], [147,-134],
  [-147,-232], [-49,-232], [49,-232], [147,-232],
];

b.panel(IW, MC(100, 0, 850, 570));
b.sprite(IW + '/BG', MC(0, 0, 850, 570));
b.panel(IW + '/TitleText', MC(-270, 255, 260, 30));
b.sprite(IW + '/TitleText/TitleBG', MC(0, 0, 260, 30));
b.text(IW + '/TitleText/Label', 'INVENTORY', { anchor:'middle-center', pos:[0, 0], rect_size:[260, 30], size:18, bold:true, color:{r:0.2,g:0.9,b:0.4} });
b.panel(IW + '/CloseInven', MC(-10, -10, 28, 22));
b.upsertComponent(IW + '/CloseInven', 'MOD.Core.UITouchReceiveComponent', {});
// 최소화 버튼
b.panel(IW + '/InvenMinBtn', MC(380, 260, 36, 22));
b.upsertComponent(IW + '/InvenMinBtn', 'MOD.Core.UITouchReceiveComponent', {});
b.upsertComponent(IW + '/InvenMinBtn', 'MOD.Core.SpriteGUIRendererComponent', { Color:{r:0.3,g:0.5,b:0.8,a:1} });
b.text(IW + '/InvenMinBtn/Label', '_', { anchor:'middle-center', pos:[0, 4], rect_size:[36, 22], size:14, bold:true, color:{r:1,g:1,b:1} });
b.sprite(IW + '/Divider', MC(0, -58, 820, 2));
b.text(IW + '/HintText', '더블클릭: 장착/해제', { anchor:'middle-center', pos:[0, -78], rect_size:[800, 24], size:12, color:{r:0.8,g:0.8,b:0.8} });

// 인벤 슬롯 1-20 (4열×5행, 슬롯크기 44×44)
for (let i = 1; i <= 20; i++) {
  const [ix, iy] = slotPositions[i - 1];
  const sp = IW + '/InvenSlot' + i;
  b.panel(sp, MC(ix, iy, 44, 44));
  b.upsertComponent(sp, 'MOD.Core.UITouchReceiveComponent', {});
  b.sprite(sp + '/SlotBG', MC(0, 0, 44, 44), { color:{r:0.72,g:0.72,b:0.76,a:1} });
  b.sprite(sp + '/Icon', MC(0, -6, 34, 34));
  b.text(sp + '/ItemName', '', { anchor:'middle-center', pos:[0, -4], rect_size:[44, 10], size:8, color:{r:1,g:1,b:1} });
  b.text(sp + '/StarLabel', '', { anchor:'middle-center', pos:[0, 33], rect_size:[44, 10], size:8, color:{r:1,g:0.8,b:0} });
  b.panel(sp + '/Touch', MC(0, 0, 44, 44));
  b.upsertComponent(sp + '/Touch', 'MOD.Core.UITouchReceiveComponent', {});
}

// MesoBar
b.panel(IW + '/MesoBar', MC(-15, -255, 480, 30));
b.sprite(IW + '/MesoBar/MesoIcon', MC(10, 0, 40, 26));
b.text(IW + '/MesoBar/MesoText', '0', { anchor:'middle-center', pos:[82, 0], rect_size:[280, 26], size:16, color:{r:1,g:1,b:1} });
b.panel(IW + '/MesoBar/EnhanceOpenBtn', MC(270, 0, 60, 26));
b.upsertComponent(IW + '/MesoBar/EnhanceOpenBtn', 'MOD.Core.UITouchReceiveComponent', {});
// 강화 버튼
b.panel(IW + '/InvenEnhanceBtn', MC(165, -255, 200, 34));
b.upsertComponent(IW + '/InvenEnhanceBtn', 'MOD.Core.UITouchReceiveComponent', {});
b.upsertComponent(IW + '/InvenEnhanceBtn', 'MOD.Core.SpriteGUIRendererComponent', { Color:{r:0.2,g:0.5,b:0.9,a:1} });
b.text(IW + '/InvenEnhanceBtn/Label', '장비 강화', { anchor:'middle-center', pos:[0, 0], rect_size:[200, 34], size:13, bold:true, color:{r:1,g:1,b:1} });

// ─── 7. SkillWindow ───────────────────────────────────────────────────
b.panel(DG + '/SkillWindow', {...MC(0, 0, 320, 380), enable: false});
b.sprite(DG + '/SkillWindow/TitleBar', MC(0, 160, 300, 36));
b.upsertComponent(DG + '/SkillWindow/TitleBar', 'MOD.Core.UITouchReceiveComponent', {});
b.panel(DG + '/SkillWindow/CloseSkill', MC(148, 161, 28, 22));
b.upsertComponent(DG + '/SkillWindow/CloseSkill', 'MOD.Core.UITouchReceiveComponent', {});
b.panel(DG + '/SkillWindow/SkillSlot1', MC(0, 40, 80, 80));
b.upsertComponent(DG + '/SkillWindow/SkillSlot1', 'MOD.Core.UITouchReceiveComponent', {});
b.sprite(DG + '/SkillWindow/SkillSlot1/SkillIcon', MC(0, 0, 72, 72));
b.panel(DG + '/SkillWindow/SkillSlot1/Touch', MC(0, 0, 80, 80));
b.upsertComponent(DG + '/SkillWindow/SkillSlot1/Touch', 'MOD.Core.UITouchReceiveComponent', {});


// ─── 8. SkillBar (우측 하단) ──────────────────────────────────────────
const barRow1 = ['Q','W','E','R','1','2','3','4'];
const barRow2 = ['A','S','D','F','5','6','7','8'];
const barXOff = [-224, -160, -96, -32, 32, 96, 160, 224];
b.panel(DG + '/SkillBar', MC(640, -440, 512, 130));
b.upsertComponent(DG + '/SkillBar', 'MOD.Core.SpriteGUIRendererComponent', { Color:{r:0.1,g:0.1,b:0.2,a:0.8} });

for (let ri = 0; ri < barRow1.length; ri++) {
  const k1 = barRow1[ri];
  const k2 = barRow2[ri];
  const bx = barXOff[ri];

  const slot1 = DG + '/SkillBar/Slot_' + k1;
  b.panel(slot1, MC(bx, 36, 56, 56));
  b.upsertComponent(slot1, 'MOD.Core.SpriteGUIRendererComponent', { Color:{r:0.25,g:0.25,b:0.35,a:1} });
  b.sprite(slot1 + '/Icon', MC(0, 0, 50, 50));
  b.text(slot1 + '/KeyLabel', k1, { anchor:'middle-center', pos:[-20, -20], rect_size:[20, 16], size:10, color:{r:0.7,g:0.7,b:0.9} });
  b.panel(slot1 + '/Touch', MC(0, 0, 56, 56));
  b.upsertComponent(slot1 + '/Touch', 'MOD.Core.UITouchReceiveComponent', {});

  const slot2 = DG + '/SkillBar/Slot_' + k2;
  b.panel(slot2, MC(bx, -36, 56, 56));
  b.upsertComponent(slot2, 'MOD.Core.SpriteGUIRendererComponent', { Color:{r:0.25,g:0.25,b:0.35,a:1} });
  b.sprite(slot2 + '/Icon', MC(0, 0, 50, 50));
  b.text(slot2 + '/KeyLabel', k2, { anchor:'middle-center', pos:[-20, -20], rect_size:[20, 16], size:10, color:{r:0.7,g:0.7,b:0.9} });
  b.panel(slot2 + '/Touch', MC(0, 0, 56, 56));
  b.upsertComponent(slot2 + '/Touch', 'MOD.Core.UITouchReceiveComponent', {});
}

// ─── 9. TooltipPanel ─────────────────────────────────────────────────
b.panel(DG + '/TooltipPanel', {...MC(0, 0, 260, 200), enable: false});
b.upsertComponent(DG + '/TooltipPanel', 'MOD.Core.SpriteGUIRendererComponent', { Color:{r:0.08,g:0.08,b:0.2,a:0.95} });
b.text(DG + '/TooltipPanel/TooltipTitle', '', { anchor:'middle-center', pos:[0, 75], rect_size:[240, 30], size:16, bold:true, color:{r:1,g:0.9,b:0.4} });
b.sprite(DG + '/TooltipPanel/TooltipIcon', MC(-85, 30, 50, 50));
b.text(DG + '/TooltipPanel/TooltipInfo', '', { anchor:'middle-center', pos:[30, 10], rect_size:[150, 80], size:13, color:{r:0.9,g:0.9,b:0.9} });
b.text(DG + '/TooltipPanel/StarText', '', { anchor:'middle-center', pos:[0, -70], rect_size:[240, 24], size:14, color:{r:1,g:0.8,b:0} });

// ─── 10. SkillTooltipPanel ────────────────────────────────────────────
b.panel(DG + '/SkillTooltipPanel', {...MC(0, 0, 220, 180), enable: false});
b.upsertComponent(DG + '/SkillTooltipPanel', 'MOD.Core.SpriteGUIRendererComponent', { Color:{r:0.08,g:0.08,b:0.2,a:0.95} });
b.sprite(DG + '/SkillTooltipPanel/Icon', MC(-70, 30, 60, 60));
b.text(DG + '/SkillTooltipPanel/Title', '', { anchor:'middle-center', pos:[0, 70], rect_size:[200, 28], size:15, bold:true, color:{r:0.2,g:0.9,b:0.4} });
b.text(DG + '/SkillTooltipPanel/Info', '', { anchor:'middle-center', pos:[30, 10], rect_size:[120, 70], size:12, color:{r:0.9,g:0.9,b:0.9} });

// ─── 11. DragGhost / SkillDragGhost ──────────────────────────────────
b.sprite(DG + '/DragGhost', {...MC(0, 0, 44, 44), enable: false});
b.sprite(DG + '/SkillDragGhost', {...MC(0, 0, 56, 56), enable: false});

// ─── 12. ShopWindow ──────────────────────────────────────────────────
b.panel(DG + '/ShopWindow', {...MC(0, 0, 600, 500), enable: false});
b.sprite(DG + '/ShopWindow/BG', MC(0, 0, 600, 500));
b.text(DG + '/ShopWindow/TitleText', 'SHOP', { anchor:'middle-center', pos:[0, 210], rect_size:[560, 40], size:22, bold:true, color:{r:0.2,g:0.9,b:0.4} });
b.panel(DG + '/ShopWindow/CloseShop', MC(280, 210, 28, 22));
b.upsertComponent(DG + '/ShopWindow/CloseShop', 'MOD.Core.UITouchReceiveComponent', {});

// ─── 저장 ─────────────────────────────────────────────────────────────
b.write('./ui/DefaultGroup.ui', { lint_verbose: true });
console.log('✅ DefaultGroup.ui 재구성 완료 (' + b.entities.length + ' entities)');
