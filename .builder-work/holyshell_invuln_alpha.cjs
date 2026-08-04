// 홀리 매직쉘(소환수 3종): ① 쉴드 이펙트 투명도 50% ② 막아낸 뒤 1.5초 무적(그 동안 쉴드 미소모)
const fs = require("fs");

const FILES = [
  "RootDesk/MyDesk/Skills/HeroSummon.mlua",
  "RootDesk/MyDesk/Skills/HealerSummon.mlua",
  "RootDesk/MyDesk/Skills/SummonDragon.mlua",
];

const OLD_FX = '{ ["OrderInLayer"] = 8 })';
const NEW_FX = '{ ["OrderInLayer"] = 8, ["Alpha"] = 0.5 })';

const OLD_CONSUME = `		-- 쉴드가 남아 있으면 1개 소모하고 true(이번 공격 무시). 사망 상태면 쓰지 않는다.
		if self._T.dying then return false end
		if self.HolyShell <= 0 then return false end
		self.HolyShell = self.HolyShell - 1
		self:PlayHolyShellFx(self.HolyShell)`;

const NEW_CONSUME = `		-- 쉴드가 남아 있으면 1개 소모하고 true(이번 공격 무시). 사망 상태면 쓰지 않는다.
		-- (요청) 막아낸 뒤 **1.5초 무적** - 그 동안 들어오는 공격은 쉴드를 더 쓰지 않고 그냥 무시한다
		-- (밀집 지역에서 한 번에 여러 대 맞아 쉴드가 순식간에 증발하는 것을 막는다).
		if self._T.dying then return false end
		local now = _UtilLogic.ElapsedSeconds
		if (self._T.holyShellInvulnUntil or 0) >= now then return true end
		if self.HolyShell <= 0 then return false end
		self.HolyShell = self.HolyShell - 1
		self._T.holyShellInvulnUntil = now + 1.5
		self:PlayHolyShellFx(self.HolyShell)`;

for (const f of FILES) {
  let src = fs.readFileSync(f, "utf8");
  let changed = 0;

  // 쉴드 이펙트 라인에만 Alpha를 붙인다(다른 이펙트의 OrderInLayer=8은 건드리지 않는다).
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("ec0acf34d59043f695f43c55222a7b0e") && lines[i].includes(OLD_FX)) {
      lines[i] = lines[i].replace(OLD_FX, NEW_FX);
      changed++;
    }
  }
  src = lines.join("\n");

  if (src.includes(OLD_CONSUME)) { src = src.replace(OLD_CONSUME, NEW_CONSUME); changed++; }

  fs.writeFileSync(f, src, "utf8");
  console.log(f + " -> " + changed + "곳 수정");
}
