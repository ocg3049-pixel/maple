#!/usr/bin/env node
"use strict";

const path = require("path");
const { UIBuilder } = require(path.join(
  "/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs"
));

const UI_PATH = "/Users/florence/Desktop/ui/DefaultGroup.ui";

const b = UIBuilder.load(UI_PATH);

// Enable RaycastTarget on equip slots
const equipSlots = [
  "EquipWindow/SlotFace",
  "EquipWindow/SlotHair",
  "EquipWindow/SlotTop",
  "EquipWindow/SlotBottom",
  "EquipWindow/SlotShoes",
  "EquipWindow/SlotWeapon",
];

console.log("=== Enabling RaycastTarget on equip slots ===");
for (const slotPath of equipSlots) {
  b.patchComponent(slotPath, "MOD.Core.SpriteGUIRendererComponent", { RaycastTarget: true });
  console.log(`  ${slotPath}: RaycastTarget = true`);
}

// Enable RaycastTarget on inven slots
console.log("\n=== Enabling RaycastTarget on inven slots ===");
for (let i = 1; i <= 20; i++) {
  const slotPath = `InvenWindow/InvenSlot${i}`;
  b.patchComponent(slotPath, "MOD.Core.SpriteGUIRendererComponent", { RaycastTarget: true });
  console.log(`  ${slotPath}: RaycastTarget = true`);
}

// Verify
const check = b.getComponent("EquipWindow/SlotFace", "MOD.Core.SpriteGUIRendererComponent");
console.log(`\n=== Verify SlotFace RaycastTarget: ${check.RaycastTarget} ===`);

b.write(UI_PATH, { lint: false });
console.log("Done! RaycastTarget enabled on all 26 slot entities.");
