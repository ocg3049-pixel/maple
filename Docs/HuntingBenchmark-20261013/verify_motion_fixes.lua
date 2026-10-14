_TimerService:SetTimerOnce(function()
 local d=_BattleStatsManager._T.huntDiagnostic
 local suite={running=true,rows={}}
 _BattleStatsManager._T.motionRegression=suite
 local ok,why=pcall(function()
 _TestCommandManager:SetHuntBenchmarkMode(true)
 wait(2)
 for _,c in ipairs({{10,80,"105030500"},{2,80,"105030500"},{2,100,"240030200"},{2,140,"100051025"},{8,80,"105030500"},{8,100,"240030200"},{8,140,"100051025"},{5,100,"240030200"},{9,40,"101030100"},{9,60,"100040000"},{9,80,"105030500"},{9,100,"240030200"},{9,140,"100051025"}}) do
  d.cancel()
  local p=_UserService.LocalPlayer
  local a=p:GetComponent("script.PlayerAttack")
  a:EndCombatMotion()
  _TestCommandManager:ApplyCommand("level",c[2])
  _TestCommandManager:ApplyCommand("job",c[1])
  d.build(c[1],c[2])
  _WorldMapManager:RequestMoveToMap(c[3])
  wait(9)
  if p.CurrentMap.Name~=c[3] then error("Diagnostic map mismatch") end
  local started=_UtilLogic.ElapsedSeconds
  local kills=a.MonsterKillCount
  local counts={} local maxAge=0 local seenGen=nil local seenAt=started
  local travel=0 local prev=p.TransformComponent.WorldPosition
  log("[HUNTDIAG:START] ".._HttpService:JSONEncode({job=c[1],level=c[2],map=c[3]}))
  _AutoHuntManager:Toggle()
  while _UtilLogic.ElapsedSeconds<started+45 do
   wait(0.25)
   local now=_UtilLogic.ElapsedSeconds
   local gen=a._T.combatMotionGeneration
   if gen~=seenGen then
    seenGen=gen;seenAt=now
    local source=a._T.combatMotionSource or "none"
    counts[source]=(counts[source] or 0)+1
   end
   if a:HasActiveCombatMotion() then
    local age=now-seenAt
    maxAge=math.max(maxAge,age)
    if age>math.max(5,(a._T.combatMotionDuration or 0)+2) then error("Motion stalled: "..tostring(a._T.combatMotionSource)) end
   end
   local pos=p.TransformComponent.WorldPosition
   travel=travel+math.abs(pos.x-prev.x)+math.abs(pos.y-prev.y);prev=pos
  end
  local rec={job=c[1],level=c[2],map=c[3],seconds=_UtilLogic.ElapsedSeconds-started,kills=a.MonsterKillCount-kills,travel=travel,maxMotionAge=maxAge,motions=counts,magicBooster=_MagicBoosterBuffUI:GetRemaining()}
  table.insert(suite.rows,rec)
  log("[HUNTDIAG:AFTER] ".._HttpService:JSONEncode(rec))
  if rec.kills<=0 or travel<0.5 then error("No positive combat/movement evidence") end
 end
 end)
 d.cancel()
 suite.running=false;suite.pass=ok;suite.error=tostring(why)
 log("[HUNTDIAG:AFTER_DONE] ".._HttpService:JSONEncode({pass=ok,error=tostring(why),count=#suite.rows}))
end,1)
