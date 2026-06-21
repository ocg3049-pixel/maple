#!/usr/bin/env node
"use strict";

const path = require("path");
const { UIBuilder } = require(path.join(
  "/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs"
));

const UI_PATH = "/Users/florence/Desktop/ui/DefaultGroup.ui";

const b = UIBuilder.load(UI_PATH);

// Print current entities to understand structure
console.log("=== Current entities ===");
b.printEntities();

// Add ButtonComponent to equip slots
const equipSlots = [
  "EquipWindow/SlotFace",
  "EquipWindow/SlotHair",
  "EquipWindow/SlotTop",
  "EquipWindow/SlotBottom",
  "EquipWindow/SlotShoes",
  "EquipWindow/SlotWeapon",
];

console.log("\n=== Adding ButtonComponent to equip slots ===");
for (const slotPath of equipSlots) {
  const existing = b.hasComponent(slotPath, "MOD.Core.ButtonComponent");
  console.log(`${slotPath}: has ButtonComponent = ${existing}`);
  if (!existing) {
    b.upsertComponent(slotPath, "MOD.Core.ButtonComponent");
    console.log(`  -> added ButtonComponent`);
  } else {
    console.log(`  -> already has ButtonComponent, skipping`);
  }
}

// Add ButtonComponent to inven slots
console.log("\n=== Adding ButtonComponent to inven slots ===");
for (let i = 1; i <= 20; i++) {
  const slotPath = `InvenWindow/InvenSlot${i}`;
  const existing = b.hasComponent(slotPath, "MOD.Core.ButtonComponent");
  if (!existing) {
    b.upsertComponent(slotPath, "MOD.Core.ButtonComponent");
    console.log(`  ${slotPath}: added ButtonComponent`);
  } else {
    console.log(`  ${slotPath}: already has ButtonComponent`);
  }
}

console.log("\n=== Writing UI file ===");
b.write(UI_PATH, { lint: false });
console.log("Done! DefaultGroup.ui updated.");
