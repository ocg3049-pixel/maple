// 섀도어 섬광 - 던지는 단검 (칼끝이 오른쪽 +x 방향)
// 논리 그리드 64x32 → 출력 128x64 (2px/dot, maple cartoon 표 기준)
const GW = 64, GH = 32;
const s = c.width / GW;
const px = (x, y, color) => {
  if (x < 0 || y < 0 || x >= GW || y >= GH) return;
  ctx.fillStyle = color;
  ctx.fillRect(x * s, y * s, s, s);
};
const rect = (x0, y0, x1, y1, color) => {
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) px(x, y, color);
};

// ── 팔레트 (selout = base 대비 명도 -40~50%, 순수 검정 금지) ──
const STEEL_DEEP = '#5A6A7B';
const STEEL_SHAD = '#8496A8';
const STEEL_BASE = '#B8C8D8';
const STEEL_HI   = '#DCE8F2';
const STEEL_TOP  = '#F6FBFF';
const STEEL_OUT  = '#38434F';
const STEEL_AA   = '#76869A';

const GOLD_BASE = '#F0C64E';
const GOLD_SHAD = '#B8902C';
const GOLD_HI   = '#FFE9A0';
const GOLD_OUT  = '#7E6018';

const GRIP_BASE = '#9B5F3A';
const GRIP_SHAD = '#6A3D24';
const GRIP_HI   = '#C08050';
const GRIP_OUT  = '#452617';

const CY = 16;                    // 세로 중심축
const BX0 = 25, BX1 = 61;         // 칼날 x 범위(BX1 = 칼끝)
const TAPER_FROM = 47;            // 여기서부터 칼끝으로 좁아진다
const HALF = 6;                   // 칼날 반두께

// ── 칼날 ──
const halfAt = (x) => {
  if (x <= TAPER_FROM) return HALF;
  const t = (x - TAPER_FROM) / (BX1 - TAPER_FROM);
  return Math.max(0, Math.round(HALF * (1 - t)));
};

let prevHalf = null;
for (let x = BX0; x <= BX1; x++) {
  const half = halfAt(x);
  const yTop = CY - half, yBot = CY + half;
  for (let y = yTop; y <= yBot; y++) {
    if (y === yTop || y === yBot) { px(x, y, STEEL_OUT); continue; }
    const span = yBot - yTop;
    const r = span === 0 ? 0.5 : (y - yTop) / span;
    if (r < 0.28)      px(x, y, STEEL_HI);
    else if (r < 0.50) px(x, y, STEEL_BASE);
    else if (r < 0.74) px(x, y, STEEL_SHAD);
    else               px(x, y, STEEL_DEEP);
  }
  // 실루엣 선택적 AA - 테이퍼 계단을 1px 중간색으로 완화(외곽에만)
  if (prevHalf !== null && half < prevHalf) {
    px(x, CY - prevHalf, STEEL_AA);
    px(x, CY + prevHalf, STEEL_AA);
  }
  prevHalf = half;
}
// 중앙 능선(풀러) - 위쪽 스페큘러 1줄 + 아래쪽 어두운 1줄로 입체감
for (let x = BX0 + 2; x <= BX1 - 4; x++) px(x, CY - 2, STEEL_TOP);
for (let x = BX0 + 2; x <= BX1 - 5; x++) px(x, CY + 2, STEEL_DEEP);
// 칼끝 마감
px(BX1, CY, STEEL_OUT);
px(BX1 - 1, CY, STEEL_TOP);
// 칼날 뿌리(가드에 물리는 부분) 외곽 정리
for (let y = CY - HALF; y <= CY + HALF; y++) px(BX0 - 1, y, STEEL_OUT);

// ── 가드(십자) ──
rect(21, 8, 24, 24, GOLD_BASE);
rect(21, 8, 24, 9, GOLD_HI);
rect(21, 22, 24, 24, GOLD_SHAD);
for (let y = 8; y <= 24; y++) { px(20, y, GOLD_OUT); px(25, y, GOLD_OUT); }
for (let x = 20; x <= 25; x++) { px(x, 7, GOLD_OUT); px(x, 25, GOLD_OUT); }

// ── 손잡이(가죽 그립) ──
rect(9, 13, 20, 19, GRIP_BASE);
rect(9, 13, 20, 13, GRIP_HI);
rect(9, 19, 20, 19, GRIP_SHAD);
for (const gx of [12, 15, 18]) for (let y = 13; y <= 19; y++) px(gx, y, GRIP_SHAD);
for (let x = 9; x <= 20; x++) { px(x, 12, GRIP_OUT); px(x, 20, GRIP_OUT); }

// ── 폼멜(자루 끝) ──
rect(4, 12, 8, 20, GOLD_BASE);
rect(4, 12, 8, 13, GOLD_HI);
rect(4, 19, 8, 20, GOLD_SHAD);
for (let y = 12; y <= 20; y++) { px(3, y, GOLD_OUT); px(9, y, GOLD_OUT); }
for (let x = 3; x <= 9; x++) { px(x, 11, GOLD_OUT); px(x, 21, GOLD_OUT); }
// 폼멜 모서리 살짝 깎기(둥근 느낌) + AA
px(3, 11, GOLD_SHAD); px(9, 11, GOLD_SHAD);
px(3, 21, GOLD_SHAD); px(9, 21, GOLD_SHAD);
