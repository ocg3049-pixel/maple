// 홀리 매직쉘: HP를 가진 아군 소환수 3종(용사/힐러/용)에 동일한 쉴드 로직을 붙인다.
// 각 스크립트의 OnEndPlay 앞(또는 파일 끝의 마지막 end 앞)에 공통 블록을 삽입한다.
const fs = require("fs");

const TARGETS = [
  { file: "RootDesk/MyDesk/Skills/HeroSummon.mlua",   tag: "용사",  anchor: '\t@ExecSpace("ServerOnly")\n\tmethod void OnEndPlay()' },
  { file: "RootDesk/MyDesk/Skills/HealerSummon.mlua", tag: "힐러",  anchor: '\t@ExecSpace("ServerOnly")\n\tmethod void OnEndPlay()' },
  { file: "RootDesk/MyDesk/Skills/SummonDragon.mlua", tag: "용",    anchor: '\t@ExecSpace("ServerOnly")\n\tmethod void OnEndPlay()' },
];

function block(tag) {
  return `	-- ── 홀리 매직쉘(4차 버프) 쉴드 ───────────────────────────────
	-- 주인이 홀리 매직쉘을 시전하면 이 소환수에게도 10회짜리 쉴드가 걸린다(개체마다 각각 10회).
	-- 실제 차단은 공격자 쪽 MonsterAttack.IsAttackTarget에서 ConsumeHolyShell()을 불러 처리한다
	-- (방어자 IsHitTarget은 이 프로젝트의 몬스터 공격 경로에서 호출되지 않는다 - 가드/패링과 같은 이유).

	@ExecSpace("ServerOnly")
	method void GrantHolyShell(integer count)
		-- 재시전하면 남은 개수와 무관하게 새로 count개로 채운다.
		self.HolyShell = count
	end

	@ExecSpace("ServerOnly")
	method boolean ConsumeHolyShell()
		-- 쉴드가 남아 있으면 1개 소모하고 true(이번 공격 무시). 사망 상태면 쓰지 않는다.
		if self._T.dying then return false end
		if self.HolyShell <= 0 then return false end
		self.HolyShell = self.HolyShell - 1
		self:PlayHolyShellFx(self.HolyShell)
		log("[HolyShell] ${tag} 소환수 방어! 남은 쉴드 " .. tostring(self.HolyShell))
		return true
	end

	@ExecSpace("Multicast")
	method void PlayHolyShellFx(integer remain)
		-- 쉴드 성공 연출: 막은 개체 몸에서 쉴드 이펙트 + "Guard" 표시 + 머리 위 남은 개수 숫자
		-- (플레이어 쪽 PlayerHit.PlayHolyShellBlockEffects와 같은 규격).
		if not self:IsClient() then return end
		if not isvalid(self.Entity) then return end
		_SoundService:PlaySound("299081e8a23d4f09b9e9858b94662cb2", 1.0)
		local serial = _EffectService:PlayEffectAttached("ec0acf34d59043f695f43c55222a7b0e", self.Entity, Vector3(0, 0.2, 0), 0, Vector3(1, 1, 1), false, { ["OrderInLayer"] = 8 })
		_TimerService:SetTimerOnce(function()
			_EffectService:RemoveEffect(serial)
		end, 1.2)
		_DamageSkinService:PlayTextDamage(self.Entity, "02c22d93421b4038b3c413b3e40b57ec", DamageSkinTextType.Guard, DamageSkinTweenType.Default)
		_DamageSkinService:Play(
			self.Entity, "d58b67cf0f3a4eaf9fe1ad87c0ffac8a", 0,
			{ remain }, DamageSkinTweenType.Default, false,
			Vector2(0, 0.35), Vector2(1, 1), 1.0, 1.0, LitMode.Default
		)
	end

`;
}

for (const t of TARGETS) {
  let src = fs.readFileSync(t.file, "utf8");
  if (src.includes("ConsumeHolyShell")) { console.log("SKIP (already):", t.file); continue; }
  if ((src.split(t.anchor).length - 1) !== 1) {
    console.log("!! anchor not unique in " + t.file + " (count=" + (src.split(t.anchor).length - 1) + ")");
    continue;
  }
  src = src.replace(t.anchor, block(t.tag) + t.anchor);
  fs.writeFileSync(t.file, src, "utf8");
  console.log("patched:", t.file);
}
