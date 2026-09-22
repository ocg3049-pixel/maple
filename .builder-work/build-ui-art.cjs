// Original code-drawn UI art. Slot gradient follows the user's explicit request.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const out = path.resolve('RootDesk/MyDesk/Assets/UIPolish');
fs.mkdirSync(out, {recursive:true});
const render = path.resolve('.agents/skills/msw-painter/scripts/render.cjs');
const assets = [];
function emit(name, body, size=64, view=32) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${view} ${view}">${body}</svg>`;
  const file = path.join(out, name+'.svg');
  fs.writeFileSync(file, svg);
  execFileSync(process.execPath,[render,'--type','svg','--in',file,'--out',path.join(out,name+'.png'),'--width',String(size),'--height',String(size)],{stdio:'pipe'});
  assets.push({name,path:path.join(out,name+'.png'),size:fs.statSync(path.join(out,name+'.png')).size});
}
emit('slot',`<defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#f5fbff"/><stop offset=".45" stop-color="#dceaf4"/><stop offset="1" stop-color="#b8cedf"/></linearGradient></defs><rect x="1" y="1" width="62" height="62" rx="5" fill="#708ba4"/><rect x="2" y="2" width="60" height="60" rx="4" fill="url(#g)"/><path d="M7 3H57Q61 3 61 7V29H3V7Q3 3 7 3" fill="#ffffff" opacity=".24"/><rect x="4" y="4" width="56" height="56" rx="3" fill="none" stroke="#ffffff" stroke-opacity=".62"/><path d="M7 61H57" stroke="#8ca9c2"/>`,64,64);
emit('frame',`<defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#3d5267"/><stop offset=".15" stop-color="#273b50"/><stop offset="1" stop-color="#17283b"/></linearGradient></defs><rect x="1" y="1" width="94" height="94" rx="8" fill="#091522"/><rect x="2" y="2" width="92" height="92" rx="7" fill="url(#g)" stroke="#849db2"/><rect x="5" y="5" width="86" height="86" rx="5" fill="none" stroke="#a8c8df" stroke-opacity=".16"/>`,96,96);
emit('minimap',`<defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#72afd9"/><stop offset=".12" stop-color="#5289b9"/><stop offset="1" stop-color="#315b85"/></linearGradient></defs><rect x="1" y="1" width="126" height="126" rx="7" fill="#173c62"/><rect x="3" y="3" width="122" height="122" rx="6" fill="url(#g)" stroke="#b2dbf7" stroke-width="2"/><path d="M10 6H118" stroke="#e5f6ff" opacity=".65"/>`,128,128);
for(const [name,color,shine] of [['self','#ffd740','#fff3ae'],['other','#ee5b64','#ffc3c7']]) {
  emit('marker_'+name,`<circle cx="8" cy="8" r="7" fill="#ffffff"/><circle cx="8" cy="8" r="5.6" fill="${color}"/><circle cx="6" cy="6" r="2" fill="${shine}"/>`,16,16);
}
const drawings={
  equip:'<path d="M10 5L5 7 2 13 7 16 9 13V28H23V13L25 16 30 13 27 7 22 5 19 9H13Z" fill="#73d8ec"/><path d="M10 5H13L16 8 19 5H22L19 11H13Z" fill="#e9fbff"/><path d="M12 15H20V24H12Z" fill="#38a4c0"/>',
  inven:'<path d="M11 4H21V9H25L28 13V28H4V13L7 9H11Z" fill="#deb374"/><path d="M12 5H20V10H12Z" fill="#385568"/><path d="M7 11H25V19H7Z" fill="#f4d59a"/><path d="M14 16H18V22H14Z" fill="#bd7b38"/><path d="M8 23H24V26H8Z" fill="#b78047"/>',
  enhance:'<path d="M8 25L21 12 25 16 12 29H8Z" fill="#e4b377"/><path d="M6 7L13 2 29 17 23 23 17 17 20 14 14 8 11 11Z" fill="#c6e9fb"/><path d="M8 7L13 4 25 16 23 18Z" fill="#ffffff"/><path d="M3 16V21M1 18H6" stroke="#ffe679" stroke-width="2"/>',
  skill:'<path d="M3 5H12L16 8 20 5H29V26H20L16 29 12 26H3Z" fill="#9973d4"/><path d="M5 7H11L15 10V25L11 23H5ZM17 10L21 7H27V23H21L17 25Z" fill="#f3e9ff"/><path d="M8 12H12M8 16H12M20 12H24M20 16H24" stroke="#ab80d8" stroke-width="2"/>',
  character:'<path d="M9 3H22L25 8V17L20 22H11L7 17V8Z" fill="#f4c593"/><path d="M7 9V6L11 2H22L26 6V11H22V7H12V10Z" fill="#795643"/><path d="M5 28V24L11 21 16 24 21 21 28 25V30H5Z" fill="#63bedc"/><path d="M12 12V15M20 12V15" stroke="#283c50" stroke-width="2"/>',
  worldmap:'<path d="M3 6L11 3 21 6 29 3V27L21 30 11 27 3 30Z" fill="#e2e8bb"/><path d="M11 3V27L21 30V6Z" fill="#8bcab2"/><path d="M5 18L10 14 16 17 24 11" fill="none" stroke="#ffffff" stroke-width="2"/><path d="M20 8L23 5H27L30 8V12L25 18 20 12Z" fill="#ef7477"/><rect x="23" y="8" width="4" height="4" fill="#fff1d8"/>',
  keysetting:'<rect x="2" y="6" width="28" height="22" fill="#72bedb"/><path d="M4 8H28V25H4Z" fill="#ceeef8"/><path d="M7 11H10V14H7ZM14 11H17V14H14ZM21 11H24V14H21ZM7 17H10V20H7ZM14 17H17V20H14ZM21 17H24V20H21ZM10 22H22V24H10Z" fill="#4c8da8"/>',
  attack:'<path d="M3 3H8L25 23 21 27 4 8Z" fill="#c3e8f9"/><path d="M29 3H24L7 23 11 27 28 8Z" fill="#ffffff"/><path d="M4 22L10 28M22 22L28 28" stroke="#f4b460" stroke-width="4"/><path d="M4 29L7 26M26 26L29 29" stroke="#e16e72" stroke-width="3"/>',
  jump:'<path d="M14 3L7 10H12V17H18V10H23L16 3Z" fill="#92dcf1"/><path d="M9 19H18V25L25 26V30H6V24Z" fill="#e9b476"/><path d="M6 28H25V31H6Z" fill="#fff0d3"/>',
  autohunt:'<path d="M10 4H22L28 10V22L22 28H10L4 22V10Z" fill="#6ecbb7"/><path d="M12 8H20L24 12V20L20 24H12L8 20V12Z" fill="#244d65"/><path d="M14 12H18V20H14ZM12 14H20V18H12Z" fill="#d8ffe1"/><path d="M16 1V8M16 24V31M1 16H8M24 16H31" stroke="#b9f7c3" stroke-width="2"/>',
  battlestats:'<path d="M4 29V5H7V26H29V29Z" fill="#e7f3fa"/><path d="M10 17H14V24H10Z" fill="#78c9e6"/><path d="M17 12H21V24H17Z" fill="#b0e4af"/><path d="M24 6H28V24H24Z" fill="#f5bd75"/>',
  command:'<path d="M2 5H30V28H2Z" fill="#518ead"/><path d="M4 9H28V26H4Z" fill="#193448"/><path d="M7 13L12 17 7 21M15 22H24" fill="none" stroke="#d5f7ed" stroke-width="2"/><path d="M5 6H7M9 6H11" stroke="#bee8f4"/>',
};
for(const [name,body] of Object.entries(drawings)) emit('func_'+name,`<g shape-rendering="crispEdges" stroke="#21394e" stroke-width="1" stroke-linejoin="miter">${body}</g>`);
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(assets,null,2));
console.log(JSON.stringify(assets));
