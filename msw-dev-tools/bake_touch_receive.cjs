#!/usr/bin/env node
"use strict";

const path = require("path");
const { UIBuilder } = require(path.join(
  "/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs"
));

const UI_PATH = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const b = UIBuilder.load(UI_PATH);

// Equip slots
const equipSlots = [
  "EquipWindow/SlotFace",
  "EquipWindow/SlotHair",
  "EquipWindow/SlotTop",
  "EquipWindow/SlotBottom",
  "EquipWindow/SlotShoes",
  "EquipWindow/SlotWeapon",
];

console.log("=== Baking UITouchReceiveComponent into equip slots ===");
for (const slotPath of equipSlots) {
  const has = b.hasComponent(slotPath, "MOD.Core.UITouchReceiveComponent");
  if (!has) {
    b.upsertComponent(slotPath, "MOD.Core.UITouchReceiveComponent");
    console.log(`  ${slotPath}: added UITouchReceiveComponent`);
  } else {
    console.log(`  ${slotPath}: already has UITouchReceiveComponent`);
  }
}

console.log("\n=== Baking UITouchReceiveComponent into inven slots ===");
for (let i = 1; i <= 20; i++) {
  const slotPath = `InvenWindow/InvenSlot${i}`;
  const has = b.hasComponent(slotPath, "MOD.Core.UITouchReceiveComponent");
  if (!has) {
    b.upsertComponent(slotPath, "MOD.Core.UITouchReceiveComponent");
    console.log(`  ${slotPath}: added UITouchReceiveComponent`);
  } else {
    console.log(`  ${slotPath}: already has UITouchReceiveComponent`);
  }
}

b.write(UI_PATH, { lint: false });
console.log("\nDone! UITouchReceiveComponent baked into all 26 slot entities.");
