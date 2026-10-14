-- Actual Maker wall-clock hunting, 30 trials. No combat/balance source edits.
local sm=_SkillManager
local bs=_BattleStatsManager
if not Environment:IsMakerPlay() or not _LoginFlow:IsInGame() then error("Entered Maker character required") end
local previous=bs._T.twoMinuteBenchmark
if previous and previous.running then error("Already running") end
local b={revision="current-20261014-2min",running=true,phase="setup",rows=previous and previous.rows or {},builds={},seq=0,total=30,started=_UtilLogic.ElapsedSeconds}
bs._T.twoMinuteBenchmark=b
local maps={[60]="100040000",[100]="240030200",[150]="103041100"}
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
local function emit(tag,data) log("[HUNT2:"..tag.."] ".._HttpService:JSONEncode(data)) end
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

local function travel(id)
 _WorldMapManager:RequestMoveToMap(id)
 local deadline=_UtilLogic.ElapsedSeconds+90
 while b.running and _UserService.LocalPlayer.CurrentMap.Name~=id and _UtilLogic.ElapsedSeconds<deadline do wait(0.5) end
 if _UserService.LocalPlayer.CurrentMap.Name~=id then error("Travel failed "..id) end
 wait(4)
end
local function run()
 _TestCommandManager:SetHuntBenchmarkMode(true)
 local deadline=_UtilLogic.ElapsedSeconds+30
 while not _TestCommandManager:IsHuntBenchmarkActor(_UserService.LocalPlayer) and _UtilLogic.ElapsedSeconds<deadline do wait(0.25) end
 if not _TestCommandManager:IsHuntBenchmarkActor(_UserService.LocalPlayer) then error("Resource mode failed") end
 emit("CONDITIONS",{revision=b.revision,levels={60,100,150},hp="unlimited",mp="unlimited",sp="10000 per tier; unlocked job skills maximized",huntingSeconds=120,maps=maps})
 for _,level in ipairs({60,100,150}) do
  for job=1,10 do
   local done=false
   for _,r in ipairs(b.rows) do if r.level==level and r.job==job then done=true end end
   if not done then
    b.seq=#b.rows+1;b.job=job;b.level=level;b.map=maps[level];b.phase="build"
    cancelBuffs()
    travel("100000000")
    _TestCommandManager:ApplyCommand("level",level)
    _TestCommandManager:ApplyCommand("job",job)
    makeBuild(job,level)
    sm:ResetAllCooldowns()
    for key,value in pairs(sm._T) do
     if type(key)=="string" and string.find(key,"CooldownUntil",1,true) and type(value)=="number" then sm._T[key]=0 end
     if type(key)=="string" and string.find(key,"OnCooldown",1,true) and type(value)=="boolean" then sm._T[key]=false end
    end
    if job==9 then for i=2,sm:GetUnlockedShurikenCount() do sm:SetShurikenCount(i,sm:GetShurikenMax()) end end
    travel(b.map)
    if _CharInfoManager:GetDisplayLevel()~=level or _UIMyInfoManager:GetSelectedCharacterJobIdx()~=job then error("Build drift") end
    b.ready=false;b.phase="prepared"
    emit("PREPARED",{seq=b.seq,job=job,level=level,map=b.map})
    deadline=_UtilLogic.ElapsedSeconds+120
    while b.running and not b.ready and _UtilLogic.ElapsedSeconds<deadline do wait(0.25) end
    if not b.ready then error("Monster reset acknowledgement timeout") end
    wait(2)
    if not _AutoHuntManager:HasLivingMonsterInCurrentMap() then error("No living monsters") end
    _MpManager:FillMp()
    local player=_UserService.LocalPlayer
    local pos=player.TransformComponent.WorldPosition
    local hpStart=player.PlayerComponent.Hp
    local mpStart=_MpManager:GetCurrentMp()
    bs:StartMeasure()
    local start=bs._T.measureStart
    _AutoHuntManager:Toggle()
    if not _AutoHuntManager.autoOn then error("AutoHunt did not start") end
    b.phase="hunting";b.huntStart=start
    emit("START",{seq=b.seq,job=job,level=level,map=b.map,at=start})
    local deaths=0;local deadBefore=false;local off=0;local last=start
    local motionGen=nil;local motionSince=start;local maxMotion=0;local stalled=false
    local attack=player:GetComponent("script.PlayerAttack")
    while b.running and _UtilLogic.ElapsedSeconds<start+120 do
     wait(math.min(0.5,start+120-_UtilLogic.ElapsedSeconds))
     local now=_UtilLogic.ElapsedSeconds
     local dead=player.PlayerComponent:IsDead()
     if dead and not deadBefore then deaths=deaths+1 end
     deadBefore=dead
     if not _AutoHuntManager.autoOn then off=off+now-last end
     if attack._T.combatMotionGeneration~=motionGen or not attack:HasActiveCombatMotion() then motionGen=attack._T.combatMotionGeneration;motionSince=now end
     local age=now-motionSince;maxMotion=math.max(maxMotion,age)
     if age>math.max(10,(attack._T.combatMotionDuration or 0)+3) then stalled=true end
     last=now
     if player.CurrentMap.Name~=b.map then error("Map drift") end
    end
    if not b.running then error("Stopped before trial completion") end
    bs:StopMeasure()
    local row={revision=b.revision,seq=b.seq,job=job,jobName=_TestCommandManager:JobNames()[job],level=level,map=b.map,mapName=_WorldMapManager:GetMapDisplayName(b.map),monsters=_WorldMapManager:GetMapMonsters(b.map),kills=bs._T.frozenKills,damage=bs._T.frozenDmg,huntSeconds=bs._T.frozenElapsed,hpStart=hpStart,hpEnd=player.PlayerComponent.Hp,mpStart=mpStart,mpEnd=_MpManager:GetCurrentMp(),deaths=deaths,offSeconds=off,maxMotionSeconds=maxMotion,motionStalled=stalled,startX=pos.x,startY=pos.y,status=(deaths==0 and off<1 and not stalled) and "measured" or "needs_review"}
    table.insert(b.rows,row);emit("RESULT",row)
    b.phase="cleanup";cancelBuffs();wait(3)
   end
  end
 end
 b.running=false;b.phase="done"
 _TestCommandManager:SetHuntBenchmarkMode(false)
 emit("DONE",{count=#b.rows,elapsed=_UtilLogic.ElapsedSeconds-b.started})
end
b.heartbeat=_TimerService:SetTimerRepeat(function()
 emit("STATUS",{phase=b.phase,seq=b.seq,job=b.job,level=b.level,map=b.map,completed=#b.rows,total=30,huntElapsed=b.phase=="hunting" and _UtilLogic.ElapsedSeconds-b.huntStart or 0,elapsed=_UtilLogic.ElapsedSeconds-b.started})
end,30,1)
b.worker=_TimerService:SetTimerOnce(function()
 local ok,why=pcall(run)
 if not ok then
  b.running=false;b.phase="error";b.error=tostring(why)
  if _AutoHuntManager.autoOn then _AutoHuntManager:Toggle() end
  bs:StopMeasure();_TestCommandManager:SetHuntBenchmarkMode(false)
  emit("ERROR",{message=b.error,seq=b.seq,job=b.job,level=b.level,map=b.map,completed=#b.rows})
 end
 if b.heartbeat then _TimerService:ClearTimer(b.heartbeat);b.heartbeat=nil end
end,1)
emit("INSTALLED",{total=30})
