_TimerService:SetTimerOnce(function()
 local fixture=_BattleStatsManager._T.followupFixture
 local h=_AutoHuntManager
 local p=_UserService.LocalPlayer
 local a=p:GetComponent("script.PlayerAttack")
 local suite={running=true,rows={}}
 _BattleStatsManager._T.followupVerify=suite
 local ok,err=pcall(function()
 for _,job in ipairs({9,8,10}) do
  fixture.cancel() a:EndCombatMotion()
  _TestCommandManager:ApplyCommand("job",job)
  fixture.build(job,140)
  h._T.roleCacheUntil=0 h:RefreshSlotRoles()
  wait(3)
  for _,direction in ipairs({1,-1}) do
   local target=nil
   for _,m in ipairs(p.CurrentMap:GetChildComponentsByTypeName("script.Monster",true)) do
    if not m.IsDead and m.Hp>0 and not m:IsDeathPending() then target=m.Entity break end
   end
   if target==nil then error("No jump target") end
   a:EndCombatMotion()
   local pos=target.TransformComponent.WorldPosition
   p.RigidbodyComponent:SetWorldPosition(Vector2(pos.x-1.1,pos.y+0.1))
   p.MovementComponent:Stop()
   wait(0.5)
   p.PlayerControllerComponent.Enable=false p.PlayerControllerComponent.LookDirectionX=1
   p.RigidbodyComponent.MoveVelocity=Vector2(direction*p.MovementComponent.InputSpeed,0)
   local now=_UtilLogic.ElapsedSeconds
   local startPos=p.TransformComponent.WorldPosition
   local jump={map=p.CurrentMap,target=target,start=now,x=startPos.x,move=direction,face=1,fired=false,retreat=direction<0,reach=6}
   h._T.combatJump=jump
   local started=h:StartVisibleJump(p)
   local picked=h:PickCombatJumpSkill(p,target,false)
   log("[VRF] Jump prepare job="..tostring(job).." move="..tostring(direction).." started="..tostring(started).." skill="..tostring(picked and picked.name))
   local maxMove=0
   for i=1,45 do
    h:CombatJumpTick(_UtilLogic.ElapsedSeconds,p)
    local move=(p.TransformComponent.WorldPosition.x-startPos.x)*direction
    maxMove=math.max(maxMove,move)
    wait(0.04)
   end
   log("[VRF] Jump result job="..tostring(job).." move="..tostring(direction).." fired="..tostring(jump.fired).." travel="..tostring(maxMove).." motion="..tostring(a._T.combatMotionSource))
   table.insert(suite.rows,{job=job,move=direction,fired=jump.fired,travel=maxMove})
   h._T.combatJump=nil a._T.basicAirMotion=nil h:StopMoving()
   wait(2)
  end
 end
 fixture.cancel() a:EndCombatMotion()
 h._T.roleCacheUntil=0 h:RefreshSlotRoles()
 local target=nil local pp=p.TransformComponent.WorldPosition
 for _,m in ipairs(p.CurrentMap:GetChildComponentsByTypeName("script.Monster",true)) do
  if not m.IsDead and m.Hp>0 and m.Entity.TransformComponent.WorldPosition.y>pp.y+0.4 then target=m.Entity break end
 end
 if target~=nil then
  h._T.target=target h._T.nextFlashJump=0
  local pos=target.TransformComponent.WorldPosition
  local accepted=h:TryFlashJumpMove(_UtilLogic.ElapsedSeconds,p,pos.x>=pp.x and 1 or -1,"upper regression")
  log("[VRF] FlashJump upper target rejected="..tostring(not accepted).." verticalReach="..tostring(h:GetFlashJumpReach()))
 end
 -- Observe a full automatic skill cycle after the isolated airborne casts.
 local startKills=a.MonsterKillCount
 h:Toggle()
 wait(25)
 fixture.cancel()
 wait(4)
 log("[VRF] Assaulter auto resumed kills="..tostring(a.MonsterKillCount-startKills).." motionReleased="..tostring(not a:HasActiveCombatMotion()).." controller="..tostring(p.PlayerControllerComponent.Enable))
 end)
 fixture.cancel()
 suite.running=false suite.pass=ok suite.error=tostring(err)
 log("[VRF] Followup movement done pass="..tostring(ok).." error="..tostring(err))
end,1)
