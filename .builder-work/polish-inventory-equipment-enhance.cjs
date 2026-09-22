const { UIBuilder } = require('/Users/florence/Desktop/.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs');

const b = UIBuilder.read('ui/DefaultGroup.ui');
UIBuilder.snapshot('ui/DefaultGroup.ui');

const UI = 'MOD.Core.UITransformComponent';
const SPR = 'MOD.Core.SpriteGUIRendererComponent';
const TXT = 'MOD.Core.TextComponent';
const BTN = 'MOD.Core.ButtonComponent';
const closeRuid = '4fea64a3307cda641809ad8be0d4890b';
const tabRuid = '27f3fbc786584f619050bcb4fba9965c';
const white = { r: 1, g: 1, b: 1, a: 1 };
const pale = { r: 0.91, g: 0.93, b: 0.95, a: 1 };
const navy = { r: 0.09, g: 0.10, b: 0.115, a: 0.96 };
const navy2 = { r: 0.10, g: 0.16, b: 0.24, a: 0.94 };
const accent = { r: 0.18, g: 0.64, b: 0.78, a: 1 };
const inactive = { r: 0.23, g: 0.24, b: 0.29, a: 1 };

function has(path, comp) { return b.find(path) && b.hasComponent(path, comp); }
function patchText(path, updates) { if (has(path, TXT)) b.patchComponent(path, TXT, updates); }
function patchSprite(path, updates) { if (has(path, SPR)) b.patchComponent(path, SPR, updates); }
function patchRect(path, size) { if (b.find(path)) b.patch(path, { rect_size: size }); }

// All three main windows use the Character Info title size.
patchText('EquipWindow/HeaderLabel', { FontSize: 17, FontColor: white });
patchText('InvenWindow/TitleText/Label', { FontSize: 17 });
patchText('EnhanceWindow/LeftPanel/SideHeader', { FontSize: 17 });
patchText('EnhanceWindow/RightPanel/RightTitleText', { FontSize: 17 });

// Close controls: same 40x40, transparent hit surface and × typography as CharInfoWindow.
for (const [root, label] of [
  ['EquipWindow/CloseEquip', 'EquipWindow/CloseEquip'],
  ['InvenWindow/CloseInven', 'InvenWindow/CloseInven/Label'],
  ['EnhanceWindow/CloseEnhance', 'EnhanceWindow/CloseEnhance/XLabel'],
]) {
  patchRect(root, [40, 40]);
  patchSprite(root, { ImageRUID: { DataId: closeRuid }, Color: { r: 1, g: 1, b: 1, a: 0 }, RaycastTarget: true });
  patchText(label, { Text: '×', FontSize: 24, FontColor: { r: 0.78, g: 0.80, b: 0.84, a: 1 }, Bold: true, Alignment: 4 });
  patchRect(label, [40, 40]);
}

// Deco is the visual continuation of EquipWindow, not a legacy-looking separate popup.
patchSprite('DecoWindow/BG', { ImageRUID: b.getComponent('EquipWindow/BG', SPR).ImageRUID, Color: white });
patchText('DecoWindow/HeaderLabel', { FontSize: 17, FontColor: white, Text: 'EQUIPMENT' });
patchText('DecoWindow/TitleLabel', { FontSize: 17, FontColor: { r: 0.82, g: 0.96, b: 0.31, a: 1 } });
patchSprite('DecoWindow/Preview/Box', {
  ImageRUID: b.getComponent('EquipWindow/Preview/Box', SPR).ImageRUID,
  Color: b.getComponent('EquipWindow/Preview/Box', SPR).Color,
});
for (const path of ['DecoWindow/TabCoord', 'DecoWindow/TabAndroid', 'DecoWindow/TabDamageSkin']) {
  patchSprite(`${path}/TabBG`, { ImageRUID: { DataId: tabRuid }, PreserveSprite: 1, Color: inactive });
  patchText(`${path}/Label`, { FontSize: 16, FontColor: pale, Bold: false });
}
patchRect('DecoWindow/CloseDeco', [40, 40]);
patchRect('DecoWindow/CloseDeco/BG', [40, 40]);
patchSprite('DecoWindow/CloseDeco/BG', { ImageRUID: { DataId: closeRuid }, Color: { r: 1, g: 1, b: 1, a: 0 } });
patchRect('DecoWindow/CloseDeco/Label', [40, 40]);
patchText('DecoWindow/CloseDeco/Label', { Text: '×', FontSize: 24, FontColor: { r: 0.78, g: 0.80, b: 0.84, a: 1 }, Bold: true, Alignment: 4 });
patchRect('DecoWindow/CloseDeco/Touch', [40, 40]);

// Inventory tabs and footer controls share the equipment tab skin.
for (const key of ['equip', 'consume', 'etc', 'install', 'cash', 'decorate']) {
  patchSprite(`InvenWindow/InvenTab_${key}/TabBG`, { ImageRUID: { DataId: tabRuid }, PreserveSprite: 1, Color: inactive });
  patchText(`InvenWindow/InvenTab_${key}/TabLbl`, { FontColor: pale, Bold: false });
}
patchSprite('InvenWindow/MesoBar/BarBG', { ImageRUID: { DataId: tabRuid }, PreserveSprite: 1, Color: inactive });
patchSprite('InvenWindow/MesoBar/EnhanceOpenBtn', { ImageRUID: { DataId: tabRuid }, PreserveSprite: 1, Color: accent });
patchSprite('InvenWindow/MesoBar/EnhanceOpenBtn/BtnBG', { ImageRUID: { DataId: tabRuid }, PreserveSprite: 1, Color: accent });
patchText('InvenWindow/MesoBar/EnhanceOpenBtn/BtnLabel', { FontColor: white, Bold: true });
patchSprite('InvenWindow/InvenSortBtn', { ImageRUID: { DataId: tabRuid }, PreserveSprite: 1, Color: inactive });

// Compact mode gets an inner panel to remove the empty side-gutter feeling.
if (!b.find('InvenWindow/CompactContentBG')) {
  b.sprite('InvenWindow/CompactContentBG', {
    pos: [0, -22], rect_size: [304, 552], image_ruid: closeRuid,
    color: '#17283D', alpha: 0.94, preserve: 1, raycast: false,
  });
}
b.patch('InvenWindow/CompactContentBG', { display_order: 1, enable: false });

// Scrollbar palette follows the navy/cyan tab system.
patchSprite('InvenWindow/InvenScrollTrack', { Color: navy2 });
patchSprite('InvenWindow/InvenScrollThumb/ThumbBG', { Color: accent });
patchSprite('InvenWindow/InvenScrollUp/UpBG', { Color: inactive });
patchSprite('InvenWindow/InvenScrollDown/DownBG', { Color: inactive });
patchText('InvenWindow/InvenScrollUp/UpLbl', { FontColor: white });
patchText('InvenWindow/InvenScrollDown/DownLbl', { FontColor: white });

// Enhancement hierarchy: stable aligned headers, white requested labels, no bottom log.
b.patch('EnhanceWindow/LeftPanel/SideHeader', { pos: [10, 428] });
b.patch('EnhanceWindow/RightPanel/RightTitleText', { pos: [0, 428] });
patchText('EnhanceWindow/LeftPanel/MesoTitleText', { FontColor: white });
patchText('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatHeader', { FontColor: white });
patchText('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateHeader', { FontColor: white });
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LogBG', { enable: false });
b.patch('EnhanceWindow/LogBG', { enable: false });

// Strong primary action: cyan tab language, larger target, clear white label.
const enhanceBtn = 'EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn';
b.patch(enhanceBtn, { pos: [0, -270], rect_size: [320, 58] });
patchSprite(enhanceBtn, { ImageRUID: { DataId: tabRuid }, PreserveSprite: 1, Color: accent, Type: 1 });
patchText(enhanceBtn, { FontColor: white, FontSize: 22, Bold: true, Text: '강화하기' });

// Item tooltip: layered navy cards, readable title hierarchy and cyan separators.
for (const panel of ['TooltipPanel/Main', 'TooltipPanel/Cmp']) {
  patchSprite(panel, { ImageRUID: { DataId: closeRuid }, Color: navy, PreserveSprite: 1, Type: 1 });
  patchText(`${panel}/Title`, { FontSize: 18, FontColor: white, Bold: true });
  patchText(`${panel}/CPLabel`, { FontColor: { r: 0.73, g: 0.78, b: 0.84, a: 1 } });
  patchText(`${panel}/CPValue`, { FontColor: { r: 0.82, g: 0.96, b: 0.31, a: 1 }, Bold: true });
  patchText(`${panel}/Info`, { FontColor: pale, FontSize: 14 });
  patchSprite(`${panel}/Divider`, { Color: accent });
  patchSprite(`${panel}/IconSlot`, { Color: navy2 });
  patchSprite(`${panel}/Pill1`, { Color: inactive });
  patchSprite(`${panel}/Pill2`, { Color: inactive });
}

// Skill tooltip: wider card and a clear title/body rhythm matching item tooltip.
b.patch('SkillTooltipPanel', { rect_size: [320, 250] });
patchRect('SkillTooltipPanel/BG', [320, 250]);
patchSprite('SkillTooltipPanel/BG', { ImageRUID: { DataId: closeRuid }, Color: navy, PreserveSprite: 1, Type: 1 });
b.patch('SkillTooltipPanel/Icon', { pos: [-118, 72], rect_size: [58, 58] });
patchSprite('SkillTooltipPanel/Icon', { Color: white });
b.patch('SkillTooltipPanel/Title', { pos: [28, 78], rect_size: [220, 34] });
patchText('SkillTooltipPanel/Title', { FontSize: 18, FontColor: white, Bold: true, Alignment: 3 });
b.patch('SkillTooltipPanel/Info', { pos: [0, -12], rect_size: [288, 126] });
patchText('SkillTooltipPanel/Info', { FontSize: 14, FontColor: pale, Alignment: 0 });
b.patch('SkillTooltipPanel/Info2', { pos: [0, -92], rect_size: [288, 42] });
patchText('SkillTooltipPanel/Info2', { FontSize: 13, FontColor: { r: 0.72, g: 0.80, b: 0.88, a: 1 }, Alignment: 0 });

b.write('ui/DefaultGroup.ui', { lint: true, strict: false, lint_verbose: true });
console.log('UI polish applied');
