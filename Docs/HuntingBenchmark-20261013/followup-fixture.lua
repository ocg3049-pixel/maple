local sm=_SkillManager
local b={builds={}}
local priority={
 [1]={"슬래시블러스트","파워스트라이크","러시","분노","부스터","파이널어택","파워가드","콤보 어택","파워스트라이크 강화","발도술","코마","패닉","브랜디쉬","어드밴스드 콤보","돌진","기사 소환"},
 [2]={"슬래시블러스트","파워스트라이크","러시","부스터","파이널어택","가드","리스토네이션","파워가드","아이언 월","차지 블로우","속성필드","디바인 스윙 강화","디바인 스티그마 강화","디바인 저지먼트 강화","디바인 차지","차지 블로우 강화","속성 증폭","돌진","궁병 지원"},
 [3]={"슬래시블러스트","파워스트라이크","서먼 다크드래곤","부스터","파이널어택","파워가드","스피어 버스터","드래곤 라이딩","드래곤 로어","힐러 소환","어드밴스드 스피어 버스터","드래곤 블러드","돌진","용 소환"},
 [4]={"매직 미사일","매직클로","홀리 에로우","도적 소환","텔레포트","부스터","블레스","힐","샤이닝 레이","용사 소환","매직 부스터","홀리 매직쉘","제네시스","리커버리 오로라","바하뮤트","엔젤레이","궁수 소환","리저렉션"},
 [5]={"매직 미사일","매직클로","썬더볼트","텔레포트","빙하지대","부스터","메디테이션","콜드빔","아이스 스트라이크","아이스 데몬","소환수 강화","용사 소환","매직 부스터","블리자드","리커버리 오로라","체인라이트닝","이프리트"},
 [6]={"매직 미사일","매직클로","파이어에로우","텔레포트","불의 영역","부스터","메디테이션","포이즌 미스트","익스플로젼","불과 친화력","파이어데몬","파이어데몬 강화","매직 부스터","메테오","리커버리 마나","엘퀴네스","불꽃 파도","파이어에로우 강화"},
 [7]={"에로우 블로우","에로우 블로우 강화","더블샷","아이언 에로우","더블 점프","부스터","파이널 어택:궁수","체인샷","아이스 샷","스트레이프","용사 소환","피어싱","프리져","샤프 아이즈","스나이핑"},
 [8]={"에로우 블로우","에로우 블로우 강화","더블샷","에로우 봄","속사","더블 점프","부스터","파이널 어택:궁수","체인샷","파이어 샷","스트레이프","용사 소환","폭풍의 시","피닉스","샤프 아이즈"},
 [9]={"럭키세븐","표창+","트레이닝","표창 분산","암행","헤이스트","부스터","표창+ II","페이크","드레인 샷","트리플 스로우","쉐도우 파트너","플래시 점프","어벤져","표창+ III","쿼드러플 스로우","각성","표창+ IV"},
 [10]={"더블스탭","분신 소환","다크사이트","새비지블로우","헤이스트","부스터","분신 강화","암행","페이크","어썰터","분신 강화 II","백스탭","플래시 점프","암행2","쉐도우 파트너","부메랑 스탭","암살","분신 강화 III","연막"}}
local function emit(tag,data) log("[HUNTBENCH:"..tag.."] ".._HttpService:JSONEncode(data)) end
local function cancelBuffs()
 if _AutoHuntManager.autoOn then _AutoHuntManager:Toggle() end
 for _,entry in ipairs(_BuffBarManager._T.buffList or {}) do
  if entry.cancel and entry.getRemaining and entry.getRemaining()>0 then entry.cancel() end
 end
 sm:RequestCancelBuff("firezone")
 sm:RequestCancelBuff("glacier")
 sm:EndHurricane(); sm:EndRapidFire(); sm:CancelPiercing(); sm:CancelSniping()
end
local function makeBuild(job,level)
 local levels={};local allowed={};local order={};local remaining={}
 for _,tid in ipairs({"0","1","2","3","4","5","6"}) do
  for _,s in ipairs(sm._T.skillData[tid] or {}) do if s.spendable then levels[s.name]=0 end end
 end
 levels["HP 회복"]=10;levels["MP 회복"]=20;levels["__beginnerAutoSpent"]=30
 for tier=1,5 do
  remaining[tier]=sm:GetTierBudget(tier)
  for _,name in ipairs(sm:GetJobSkillNames(job)[tostring(tier)] or {}) do
   local s=sm:FindSkillByName(name)
   if s and sm:GetSkillRequiredLevel(name)<=level then allowed[name]=s;table.insert(order,name) end
  end
 end
 local ensure
 ensure=function(name,wanted,depth)
  local s=allowed[name]
  if not s or not s.spendable or depth>8 then return end
  local tier=sm:GetSkillTier(name)
  if (remaining[tier] or 0)<=0 then return end
  for _,r in ipairs(sm:GetSkillPrerequisites(name)) do
   ensure(r.name,r.level,depth+1)
   if (levels[r.name] or 0)<r.level then return end
  end
  local add=math.min(remaining[tier],math.max(0,math.min(wanted,s.maxLevel or 20)-(levels[name] or 0)))
  levels[name]=(levels[name] or 0)+add;remaining[tier]=remaining[tier]-add
 end
 for tier=1,5 do
  for _,name in ipairs(order) do if sm:GetSkillTier(name)==tier then ensure(name,1,0) end end
  for _,name in ipairs(priority[job]) do if allowed[name] and sm:GetSkillTier(name)==tier then ensure(name,allowed[name].maxLevel or 20,0) end end
  for _,name in ipairs(order) do if sm:GetSkillTier(name)==tier then ensure(name,allowed[name].maxLevel or 20,0) end end
 end
 sm:ImportHotkeys({})
 sm._T.refundedSkillSlots={}
 sm:ImportSkillLevels(levels)
 for _,name in ipairs(order) do sm:ApplySkillLevelSideEffects(allowed[name]) end
 sm:ReconcileSkillPointsToLevel()
 -- Higher-tier actions receive available slots first; passives require no slot.
 for tier=5,1,-1 do
  for _,name in ipairs(priority[job]) do
   local s=allowed[name]
   if s and sm:GetSkillTier(name)==tier and ((not s.spendable) or (s.level or 0)>0) then sm:AutoAssignLearnedSkill(name,s.ruid) end
  end
 end
 for _,name in ipairs(order) do
  local s=allowed[name]
  if (not s.spendable) or (s.level or 0)>0 then sm:AutoAssignLearnedSkill(name,s.ruid) end
 end
 for _,name in ipairs({"HP 회복","MP 회복"}) do local s=sm:FindSkillByName(name);sm:AutoAssignLearnedSkill(name,s.ruid) end
 sm:SyncSkillEffectsToServer()
 _AutoHuntManager._T.roleCacheUntil=0
 local rec={job=job,jobName=_TestCommandManager:JobNames()[job],level=level,combatPower=_CharInfoManager:CalcCombatPower(),skills=sm:ExportSkillLevels(),hotkeys=sm:ExportHotkeys(),remaining=remaining}
 table.insert(b.builds,rec);emit("BUILD",rec)
end

_BattleStatsManager._T.followupFixture={build=makeBuild,cancel=cancelBuffs}
log("[VRF] Followup fixture ready")