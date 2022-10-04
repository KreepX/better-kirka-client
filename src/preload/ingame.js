const { clipboard, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const Store = require('electron-store');

const settings = new Store();

const discord = ipcRenderer.sendSync('discord');
const ingameIds = ipcRenderer.sendSync('ids');
const badgeLinks = ipcRenderer.sendSync('badges');


const documents = ipcRenderer.sendSync('docs');
const scriptFolder = documents + "\\BetterKirkaClient\\scripts";

if (!fs.existsSync(scriptFolder)) {
    fs.mkdirSync(scriptFolder, {recursive: true});
}
try {
    fs.readdirSync(scriptFolder).filter(file => path.extname(file).toLowerCase() === '.js').forEach(filename => {
        try {
            require(`${scriptFolder}/${filename}`);
        } catch (e) {
            console.error("an error occurred while executing userscript: " + filename + " error: " + e);
        }
    });
} catch (e) {
    console.error("an error occurred while loading userscripts: " + e);

function ShowDevTip(Msg) {
  let tipchilds = document.querySelectorAll('.vue-notification-wrapper');
  if (tipchilds.length >= DevTooltipsMaxTips) document.getElementsByClassName('vue-notification-group')[0].getElementsByTagName('span')[0].removeChild(tipchilds[0]);
  if (typeof Msg === 'object') Msg = JSON.stringify(Msg);

  let newtip = document.createElement('div');
  // prettier-ignore
  let dataid = tipchilds ? String(tipchilds.length + 1) : '1';
  newtip.setAttribute('data-id', dataid);
  newtip.className = 'vue-notification-wrapper vn-fade-move';
  newtip.style = 'transition-timing-function: ease; transition-delay: 0s; transition-property: all;';
  newtip.id = 'BKC-dev-tip' + devid++;
  /*
// prettier-ignore
// normal logo
newtip.innerHTML=`
<div class="alert-default error" style="display: flex;align-items: center;padding: .9rem 1.1rem;margin-bottom: .5rem;color: var(--white);cursor: pointer;box-shadow: 0 0 .7rem rgba(0,0,0,.25);border-radius: .2rem;background: linear-gradient(262.54deg,#202639 9.46%,#223163 100.16%);margin-left: 1rem;border: solid .15rem var(--primary-1);font-family: Exo\ 2;">
<svg xmlns="http://www.w3.org/2000/svg" class="icon svg-icon svg-icon--warn" style="width: 2rem;min-width: 2rem;height: 2rem;margin-right: .9rem;color: var(--white);fill: currentColor;box-sizing: border-box;"><!---->
<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons.6e41b8dd.svg#warn" style="box-sizing: border-box;"></use>
</svg><span id="BKC-dev-tip-text" class="text" style="font-size: 1rem;font-weight: 600;text-align: left;overflow-wrap: anywhere;">` + Msg + `</span></div>
`;
*/
  newtip.innerHTML =
    `
<div class="alert-default error" style="display: flex;align-items: center;padding: .9rem 1.1rem;margin-bottom: .5rem;color: var(--white);cursor: pointer;box-shadow: 0 0 .7rem rgba(0,0,0,.25);border-radius: .2rem;background: linear-gradient(262.54deg,#202639 9.46%,#223163 100.16%);margin-left: 1rem;border: solid .15rem var(--primary-1);font-family: Exo\ 2;">
<img alt="" style="width: 2rem;min-width: 2rem;height: 2rem;margin-right: .9rem;color: var(--white);fill: currentColor;box-sizing: border-box;" src="data:image/png;base64,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" />
<span id="BKC-dev-tip-text" class="text" style="font-size: 1rem;font-weight: 600;text-align: left;overflow-wrap: anywhere;">` +
    Msg +
    `</span></div>
`;
  newtip.addEventListener('click', () => {
    clearTip(newtip.id);
  });
  document.getElementsByClassName('vue-notification-group')[0].getElementsByTagName('span')[0].appendChild(newtip);

  setTimeout(() => {
    clearTip(newtip.id);
  }, DevTooltipsTimeout);
}

function consoledebug(params = 'NO PARAMS', type = 'ERROR', showtip = '', scufflocation = '') {
  if (!scufflocation) {
    try {
      scufflocation = consoledebug.caller.name;
    } catch (e) {}
  }
  if (type.toUpperCase() === 'ERROR') {
    console.debug(consolelogCnf.layout, 'color:red;', ' [ERROR] ', 'color:red;', '[', 'color:white;', consolelogCnf.origin, consolelogCnf.icon, ' ', 'color:red;', '] [', 'color:aqua;', scufflocation, 'color:red;', ']', 'color:lightblue;', ': ', 'color:white;', params);
  } else {
    console.debug(consolelogCnf.layout, 'color:#4b89ff;', ' [DEBUG] ', 'color:blue;', '[', 'color:white;', consolelogCnf.origin, consolelogCnf.icon, ' ', 'color:blue;', '] [', 'color:aqua;', scufflocation, 'color:blue;', ']', 'color:lightblue;', ': ', 'color:white;', params);
  }
  if (showtip) {
    ShowDevTip(params);
  }
}

window.addEventListener('error', (event) => {
  if (event.filename.match(consolelogCnf.source)) {
    event.preventDefault();
    consoledebug(event, 'Error');
    if (DevToolTips) {
      ShowDevTip(event.message);
    }
  }
});

function insertAfter(newElement, referenceElement) {
  referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
}

// prettier-ignore
function scrollIntoView(t) { // http://roysharon.com/blog/37
 if (typeof(t) !== 'object') return;
 if (t.getRangeAt){if (t.rangeCount === 0) return;t = t.getRangeAt(0);}
 if (t.cloneRange){var r = t.cloneRange();r.collapse(true);
  // eslint-disable-next-line no-redeclare
  var t = r.startContainer;
  if (t.nodeType === 1)
   t = t.childNodes[r.startOffset];
  }
 let o = t;while (o && o.nodeType !== 1) o = o.previousSibling;t = o || t.parentNode;
 if (t) t.scrollIntoView();

}

function hexToH(H) {
  let r = 0;
  let g = 0;
  let b = 0;
  if (H.length === 4) {
    r = '0x' + H[1] + H[1];
    g = '0x' + H[2] + H[2];
    b = '0x' + H[3] + H[3];
  } else if (H.length === 7) {
    r = '0x' + H[1] + H[2];
    g = '0x' + H[3] + H[4];
    b = '0x' + H[5] + H[6];
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b);
  let cmax = Math.max(r, g, b);
  let delta = cmax - cmin;
  let h = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h *= 60;
  if (h < 0) h += 360;
  return h;
}

function hslToHex(h, s, l) {
  l /= 100;
  // eslint-disable-next-line no-mixed-operators
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function componentToHex(c) {
  let hex = c.toString(16);
  // prettier-ignore
  // eslint-disable-next-line eqeqeq
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rr, gg, bb) {
  return '#' + componentToHex(rr) + componentToHex(gg) + componentToHex(bb);
}

function frameFuncsRemove(pos) {
  let index = frameFuncs.indexOf(pos);
  if (index > -1) {
    frameFuncs.splice(index, 1);
  }
}

function InitweaponFunc() {
  if (scene) {
    weaponModel = scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems']['0']['_queries']['player']['entities']['0']['_components']['35']['weapons'][weap]['model'];
    armsMaterial = weaponModel['parent']['children']['0']['material'];
    weaponMaterial = weaponModel['children'][num]['material'];
  }
}

function overlayModelFunc() {
  if (overlayModel) {
    if (leftHanded) {
      overlayModel.scale.x = -1;
    } else {
      overlayModel.scale.x = 1;
    }
  }
}

function permCrosshairToggleFunc() {
  if (permCrosshair) {
    if (!document.querySelector('#BKC-Styles').innerHTML.match(/img[#]crosshair-static[{]opacity[:]1[!]important[;][}]/g)) document.querySelector('#BKC-Styles').innerHTML += 'img#crosshair-static{opacity:1!important;}';
  } else if (document.querySelector('#BKC-Styles').innerHTML.match(/img[#]crosshair-static[{]opacity[:]1[!]important[;][}]/g)) {
    document.querySelector('#BKC-Styles').innerHTML = document.querySelector('#BKC-Styles').innerHTML.replace(/img[#]crosshair-static[{]opacity[:]1[!]important[;][}]/g, '');
  }
}

function hideWeaponsAdsFunc() {
  if (weaponMaterial) weaponMaterial.visible = !scoped;
  if ((scoped && hideWeaponsAds)) {
    armsMaterial.visible = !scoped;
  } else {
    armsMaterial.visible = arms;
  }
}

function inspectingFunc() {
  if (inspecting) {
    if (!prevInsp) {
      if (weaponModel) {
        prevInspectPos = weaponModel.position.clone();
        prevInspectRot = weaponModel.rotation.clone();
        inspectedWeapon = weaponModel;
      }
    }

    weaponModel.rotation.x = 0;
    weaponModel.rotation.y = -0.3;
    weaponModel.rotation.z = -0.4;
    weaponModel.position.y = 0.05;
    weaponModel.position.z = -0.08;
  } else if (prevInsp) {
    inspectedWeapon.rotation.x = prevInspectRot.x;
    inspectedWeapon.rotation.y = prevInspectRot.y;
    inspectedWeapon.rotation.z = prevInspectRot.z;
    inspectedWeapon.position.y = prevInspectPos.y;
    inspectedWeapon.position.z = prevInspectPos.z;
  }

  prevInsp = inspecting;
}

function wireframeArmsFunc() {
  if (armsMaterial) {
    if (wireframeArms) {
      armsMaterial.wireframe = true;
      armsMaterial.color.r = r / 255;
      armsMaterial.color.g = g / 255;
      armsMaterial.color.b = b / 255;
      armsMaterial.emissive.r = r / 255;
      armsMaterial.emissive.g = g / 255;
      armsMaterial.emissive.b = b / 255;
    } else if (prevWireframeArms) {
      armsMaterial.wireframe = false;
      armsMaterial.color.r = 1;
      armsMaterial.color.g = 1;
      armsMaterial.color.b = 1;
      armsMaterial.emissive.r = 0;
      armsMaterial.emissive.g = 0;
      armsMaterial.emissive.b = 0;
    }
    prevWireframeArms = wireframeArms;
  }
}

function wireframeWeaponsFunc() {
  if (weaponMaterial) {
    if (wireframeWeapons) {
      weaponMaterial.wireframe = true;
      weaponMaterial.color.r = r / 255;
      weaponMaterial.color.g = g / 255;
      weaponMaterial.color.b = b / 255;
      weaponMaterial.emissive.r = r / 255;
      weaponMaterial.emissive.g = g / 255;
      weaponMaterial.emissive.b = b / 255;
    } else if (prevWireframeWeapons) {
      weaponMaterial.wireframe = false;
      weaponMaterial.color.r = 1;
      weaponMaterial.color.g = 1;
      weaponMaterial.color.b = 1;
      weaponMaterial.emissive.r = 0;
      weaponMaterial.emissive.g = 0;
      weaponMaterial.emissive.b = 0;
    }

    prevWireframeWeapons = wireframeWeapons;
  }
}

function playerHighLightFunc() {
  if (ShouldHiglight) {
    let localPlayerClass = scene['children']['0']['parent']['entity']['_entityManager']['mWnwM']['systemManager']['_systems']['0']['_queries']['player']['entities']['0']['_components']['38'].wnWmN;

    for (let i = 0; i < scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems']['2']['_queries']['animationEntities']['entities'].length; i++) {
      let player = scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems']['2']['_queries']['animationEntities']['entities'][i]['_components'];
      let mat = scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems']['2']['_queries']['animationEntities']['entities'][i]['_components'][0].value.children[0].children[0].children[1].material;

      if (mat.color.r === 1 && mat.color.g < 1 && mat.color.b < 1) continue;

      if (!localPlayerClass.team || localPlayerClass.team !== player['50'].team) {
        color = colorEnemy;
      } else {
        color = colorTeam;
      }

      mat.map = null;
      mat.color.r = color.r * Number.MAX_SAFE_INTEGER;
      mat.color.g = color.g * Number.MAX_SAFE_INTEGER;
      mat.color.b = color.b * Number.MAX_SAFE_INTEGER;
      mat.needsUpdate = true;
    }
  }
}

function menuVisibleFunc() {
  if (menuVisible) {
    window.requestAnimationFrame(menuVisibleFunc);
    if (minPlayerSlider) {
      // eslint-disable-next-line radix
      minPlayers = Number.parseInt(minPlayerSlider.value);
      minPlayersLab.innerText = minPlayerSlider.value + ' min. Players';
    }

    if (maxPlayerSlider) {
      // eslint-disable-next-line radix
      maxPlayers = Number.parseInt(maxPlayerSlider.value);
      maxPlayersLab.innerText = maxPlayerSlider.value + ' max. Players';
    }

    if (minTimeLeftSlider) {
      // eslint-disable-next-line radix
      minTimeLeft = Number.parseInt(minTimeLeftSlider.value);
      minTimeLeftLab.innerText = minTimeLeftSlider.value + ' min. Time Left';
    }

    if (volumeSlider) {
      volume = Number.parseFloat(volumeSlider.value);
      volumeLab.innerText = 'Volume: ' + volumeSlider.value;
    }
  }
}

function hideFlagAdsFunc() {
  if (flagMaterial) {
    if (hideFlagAds) {
      flagMaterial.visible = !scoped;
    } else {
      flagMaterial.visible = true;
    }
  }
}

function CleanweaponFunc() {
  if (!hideWeaponsAds && !hideArms && !wireframeArms && !wireframeWeapons && !inspecting && !rainbow) {
    frameFuncsRemove(InitweaponFunc);
  }
}

function rainbowFunc() {
  rainbowIntervId = setInterval(() => {
    if (rainbow) {
      if (r > 0 && b === 0) {
        r--;
        g++;
      }
      if (g > 0 && r === 0) {
        g--;
        b++;
      }
      if (b > 0 && g === 0) {
        r++;
        b--;
      }
    } else {
      //color = colorred;
      r = colorred.r;
      g = colorred.g;
      b = colorred.b;
      CleanweaponFunc();
      clearInterval(rainbowIntervId);
    }
  }, 4);
}

function appendBadges() {
  players.querySelectorAll('.short-id').forEach((e) => {
    if (ingameIds.includes(e.innerText)) {
      let img = document.createElement('img');

      // prettier-ignore
      img.src = badgeLinks[e.innerText] !== '' ? badgeLinks[e.innerText] : badgeLinks.default;

      imgTags.push(img);

      e.parentElement.children[1].append(img);
    }
  });
}

const playersobserver = new MutationObserver((mutation) => {
  let n = false;

  mutation.forEach((e) => {
    e.addedNodes.forEach((f) => {
      if (f.nodeName === 'IMG') n = true;
    });
  });

  if (n) return;

  for (let imgTag of imgTags) {
    if (imgTag) imgTag.parentElement.removeChild(imgTag);
  }

  imgTags = [];

  appendBadges();
});

function ShowBadgesFunc() {
  const ShowBadgesInt = setInterval(() => {
    try {
      // prettier-ignore
      players = document.getElementsByClassName('players')?.[0];

      if (!players) gains = [];

      if (!hasPlayerList && players) {
        appendBadges();

        playersobserver.observe(players, {
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true,
          attributeOldValue: true,
          characterDataOldValue: true,
        });

        hasPlayerList = !!players;
      }
    } catch (e) {}
    if (!ShowBadges) {
      playersobserver.disconnect();
      clearInterval(ShowBadgesInt);
    }
  }, 1000);
}

function settingsSetGit(setting, value) {
  settings.set(setting, value);
  return value;
}

async function ShowHideGameModes() {
  let modecards = document.getElementsByClassName('list-cont')[0].getElementsByClassName('map');
  for (var i = 0; i < modecards.length; i++) {
    try {
      if (modecards[i].innerText.match(/P[_]/g)) {
        if (GameModesShowP === false) {
          modecards[i].parentElement.parentElement.style.display = 'none';
        } else {
          modecards[i].parentElement.parentElement.style.display = 'flex';
        }
      } else if (modecards[i].innerText.match(/TDM[_]/g)) {
        if (GameModesShowTDM === false) {
          modecards[i].parentElement.parentElement.style.display = 'none';
        } else {
          modecards[i].parentElement.parentElement.style.display = 'flex';
        }
      } else if (modecards[i].innerText.match(/POINT[_]/g)) {
        if (GameModesShowPOINT === false) {
          modecards[i].parentElement.parentElement.style.display = 'none';
        } else {
          modecards[i].parentElement.parentElement.style.display = 'flex';
        }
      } else if (modecards[i].innerText.match(/DM[_]/g) && !modecards[i].innerText.match(/TDM[_]/g)) {
        if (GameModesShowDM === false) {
          modecards[i].parentElement.parentElement.style.display = 'none';
        } else {
          modecards[i].parentElement.parentElement.style.display = 'flex';
        }
      }
    } catch {}
  }
}

function GameModesCheckBoxChangeHandler() {
  let selectedmode = this.parentElement.parentElement.className;

  if (selectedmode === 'P') {
    if (this.checked) {
      GameModesShowP = true;
    } else {
      GameModesShowP = false;
    }
    settings.set('GameModesShowP', GameModesShowP);
  } else if (selectedmode === 'TDM') {
    if (this.checked) {
      GameModesShowTDM = true;
    } else {
      GameModesShowTDM = false;
    }
    settings.set('GameModesShowTDM', GameModesShowTDM);
  } else if (selectedmode === 'DM') {
    if (this.checked) {
      GameModesShowDM = true;
    } else {
      GameModesShowDM = false;
    }
    settings.set('GameModesShowDM', GameModesShowDM);
  } else if (selectedmode === 'POINT') {
    if (this.checked) {
      GameModesShowPOINT = true;
    } else {
      GameModesShowPOINT = false;
    }
    settings.set('GameModesShowPOINT', GameModesShowPOINT);
  }

  ShowHideGameModes();
}

const gamemodesobserver = new MutationObserver(() => {
  ShowHideGameModes();
});

function SetGameModesCheckBoxes() {
  try {
    if (!document.querySelector('#view > div > div > div.content > div.servers > div > div.list-cont > div.tabs > div.mods.tabmods')) {
      let modesCont = document.createElement('div');
      modesCont.className = 'mods tabmods';
      modesCont.setAttribute('style', 'display:flex;font-size:1rem!important;margin:0 auto;margin-right:0rem;');
      modesCont.innerHTML = modesContinner;
      document.querySelector('#view > div > div > div.content > div.servers > div > div.list-cont > div.tabs').appendChild(modesCont);
      modesCont.getElementsByClassName('DM-checkbox')[0].checked = GameModesShowDM;
      modesCont.getElementsByClassName('TDM-checkbox')[0].checked = GameModesShowTDM;
      modesCont.getElementsByClassName('P-checkbox')[0].checked = GameModesShowP;
      modesCont.getElementsByClassName('POINT-checkbox')[0].checked = GameModesShowPOINT;
      let modes = document.getElementsByClassName('servers')[0].getElementsByClassName('list-cont')[0].getElementsByClassName('mods')[0].getElementsByTagName('input');
      for (var i = 0; i < modes.length; i++) {
        modes[i].addEventListener('change', GameModesCheckBoxChangeHandler);
      }
      gamemodesobserver.observe(document.querySelector('#view > div > div > div.content > div.servers > div > div.list-cont > div.list'), { attributes: true, childList: true, subtree: true });
    }
  } catch {}
}

const modesContinner = `

    <style>
    
    div.tabs>div.mods.tabmods>div>label.custom-checkbox>input {
        position: absolute;
        z-index: -1;
        opacity: 0;
    }
    
    div.tabs>div.mods.tabmods>div>label.custom-checkbox>span{
        display: inline-flex;
        align-items: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    div.tabs>div.mods.tabmods>div>label.custom-checkbox>input:checked+span:before {
        background-color: #ffb914;
        border-color: #b6830e;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='hsl(42, 85%, 100%)' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
    }
    
    div.tabs>div.mods.tabmods>div>label.custom-checkbox>span:before {
        content: "";
        display: inline-block;
        width: 1.3em;
        height: 1.3em;
        flex-shrink: 0;
        flex-grow: 0;
        /*margin-top: .3em;*/
        border: .15rem solid #3c4b68;
        border-radius: .25em;
        margin-right: .5em;
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: 50% 50%;
        background-color: #2f3957;
    }
    
    </style>
    
    <div class="DM" style="margin-right:.5rem!important;height:3.1vh;margin:auto;">
    <label class="custom-checkbox checkbox-size">
    <input type="checkbox" class="DM-checkbox">
    <span> Solo </span>
    </label>
    </div>
    
    <div class="TDM" style="margin-right:.5rem!important;height:3.1vh;margin:auto;">
    <label class="custom-checkbox checkbox-size">
    <input type="checkbox" class="TDM-checkbox">
    <span> Team </span>
    </label>
    </div>
    
    <div class="POINT" style="margin-right:.5rem!important;height:3.1vh;margin:auto;">
    <label class="custom-checkbox checkbox-size">
    <input type="checkbox" class="POINT-checkbox">
    <span> Point </span>
    </label>
    </div>
    
    <div class="P" style="margin-right:.5rem!important;height:3.1vh;margin:auto;">
    <label class="custom-checkbox checkbox-size">
    <input type="checkbox" class="P-checkbox">
    <span> Parkour </span>
    </label>
    </div>
    
`;

let r = 255;
let g = 0;
let b = 0;
let rainbowIntervId;
const settings = new Store();
let consolelogCnf = {
  icon: 'background:url("data:image/png;base64,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") center right / 10px 10px no-repeat;padding-top:0px;padding-left:5px;',
  origin: 'Better Kirka Client',
  layout: '%c%s%c%s%c%s%c%s%c%s%c%s%c%s%c%s%c%o',
  source: 'ingame.js',
};
let DevToolTips = true; // shows console errors as in-game native notifications
let DevTooltipsTimeout = 5000; // how long to wait before auto removing them
let DevTooltipsMaxTips = 3; // max amount of notifications on screen at a time
let devid = 0;
let arms = true;
let colorEnemy;
let colorTeam;
let color;
let weaponModel;
let armsMaterial;
let weaponMaterial;
// prettier-ignore
// eslint-disable-next-line eqeqeq
let GameModesShowP = typeof settings.get('GameModesShowP') == 'undefined' ? settingsSetGit('GameModesShowP', true) : settings.get('GameModesShowP');
// prettier-ignore
// eslint-disable-next-line eqeqeq
let GameModesShowTDM = typeof settings.get('GameModesShowTDM') == 'undefined' ? settingsSetGit('GameModesShowTDM', true) : settings.get('GameModesShowTDM');
// prettier-ignore
// eslint-disable-next-line eqeqeq
let GameModesShowPOINT = typeof settings.get('GameModesShowPOINT') == 'undefined' ? settingsSetGit('GameModesShowPOINT', true) : settings.get('GameModesShowPOINT');
// prettier-ignore
// eslint-disable-next-line eqeqeq
let GameModesShowDM = typeof settings.get('GameModesShowDM') == 'undefined' ? settingsSetGit('GameModesShowDM', true) : settings.get('GameModesShowDM');
let imgTags = [];
let hasPlayerList = false;
// prettier-ignore
// eslint-disable-next-line eqeqeq
let ShowBadges = typeof settings.get('ShowBadges') == 'undefined' ? settingsSetGit('ShowBadges', true) : settings.get('ShowBadges');
let frameFuncs = [];

const discord = ipcRenderer.sendSync('discord');
const ingameIds = ipcRenderer.sendSync('ids');
const badgeLinks = ipcRenderer.sendSync('badges');

const documents = ipcRenderer.sendSync('docs');
const scriptFolder = documents + '\\BetterKirkaClient\\scripts';
if (!fs.existsSync(scriptFolder)) {
  fs.mkdirSync(scriptFolder, { recursive: true });
}
try {
  fs.readdirSync(scriptFolder)
    .filter((file) => path.extname(file).toLowerCase() === '.js')
    .forEach((filename) => {
      try {
        require(`${scriptFolder}/${filename}`);
      } catch (e) {
        console.error('an error occurred while executing userscript: ' + filename + ' error: ' + e);
      }
    });
} catch (e) {
  console.error('an error occurred while loading userscripts: ' + e);
}

let permCrosshair = !!settings.get('permCrosshair');
let noLoadingTimes = true;
let customCss = !!settings.get('customCss');
let hideWeaponsAds = !!settings.get('hideWeaponsAds');
let hideArms = !!settings.get('hideArms');
let leftHanded = !!settings.get('leftHanded');
let hideFlagAds = !!settings.get('hideFlagAds');
let playerHighLight = !!settings.get('playerHighLight');
let fullBlack = !!settings.get('fullBlack');
let wireframeWeapons = !!settings.get('wireframeWeapons');
let wireframeArms = !!settings.get('wireframeArms');
let rainbow = !!settings.get('rainbow');
let adspower = !!settings.get('adspower');
let autoJoin = !!settings.get('autoJoin');
// prettier-ignore
// eslint-disable-next-line eqeqeq
let fpsCap = typeof settings.get('fpsCap') == 'undefined' ? false : settings.get('fpsCap');
// prettier-ignore
// eslint-disable-next-line eqeqeq
let capture = typeof settings.get('capture') == 'undefined' ? false : settings.get('capture');
// prettier-ignore
// eslint-disable-next-line eqeqeq
let volume = typeof settings.get('volume') == 'undefined' ? 1 : settings.get('volume');
let noKillSound = !!settings.get('noKillSound');
let volumeSlider;
let volumeLab;
let clearInspect;
let marketNames = !!settings.get('marketNames');
let customPrice = !!settings.get('customPrice');
let inspecting = false;
let inspectingoverride = false;
let prevInsp = false;
let prevInspectPos;
let prevInspectRot;
let prevWireframeWeapons = false;
let prevWireframeArms = false;
let gui = document.createElement('div');
let menuVisible = false;
let inspectListening = false;
if (!settings.get('inspectKey')) settings.set('inspectKey', 'j');
let menuListening = false;
let euLobbies = !!settings.get('euLobbies');
let naLobbies = !!settings.get('naLobbies');
let asiaLobbies = !!settings.get('asiaLobbies');
let ffaLobbies = !!settings.get('ffaLobbies');
let tdmLobbies = !!settings.get('tdmLobbies');
let parkourLobbies = !!settings.get('parkourLobbies');
// prettier-ignore
// eslint-disable-next-line eqeqeq
let preferredFilter = typeof settings.get('preferredFilter') == 'undefined' ? 'Players' : settings.get('preferredFilter');
// prettier-ignore
// eslint-disable-next-line eqeqeq
let minPlayers = typeof settings.get('minPlayers') == 'undefined' ? 4 : settings.get('minPlayers');
let colorred = hexToRgb('#ff0000');
// prettier-ignore
// eslint-disable-next-line eqeqeq
let maxPlayers = typeof settings.get('maxPlayers') == 'undefined' ? 8 : settings.get('maxPlayers');
// prettier-ignore
// eslint-disable-next-line eqeqeq
let minTimeLeft = typeof settings.get('minTimeLeft') == 'undefined' ? 3 : settings.get('minTimeLeft');
let filterMaps = !!settings.get('filterMaps');
let avoidSameLobby = true;
let currentURL = window.location.href;
let gameModes = [];
let bestLobby = '';
let allLobbyData = [];
// prettier-ignore
let maps = settings.get('maps') ? settings.get('maps') : [];
let customGames = !!settings.get('customGames');
let responseCount = 0;
let minPlayerSlider;
let maxPlayerSlider;
let minPlayersLab;
let maxPlayersLab;
let minTimeLeftSlider;
let minTimeLeftLab;
let settingsButtonsAdded = false;
let scene;
let flagMaterial;
let players;
let gains = [];
let overlayModel;
let clearhideWeaponsAdsFunc;
let clearhideArmsFunc;
let clearoverlayModelFunc;
let clearhideFlagAdsFunc;
let clearplayerHighLightFunc;
let clearwireframeWeaponsFunc;
let clearwireframeArmsFunc;
let ShouldHiglight = false;
//let crosshair;
let weap;
let num;
let animate;
let animateState;
let scoped = false;

if (rainbow) {
  rainbowFunc();
}

if (ShowBadges) {
  ShowBadgesFunc();
}

/*
if (permCrosshair) {
  // frameFuncs.push(permCrosshairFunc);
  // permCrosshairToggleFunc();
}
*/

if (playerHighLight) {
  frameFuncs.push(playerHighLightFunc);
}

if (leftHanded) {
  frameFuncs.push(overlayModelFunc);
}

if (hideFlagAds) {
  frameFuncs.push(hideFlagAdsFunc);
}

if (hideWeaponsAds) {
  frameFuncs.push(hideWeaponsAdsFunc);
}

if (hideArms) {
  arms = false;
  if (!frameFuncs.includes(hideWeaponsAdsFunc)) {
  frameFuncs.push(hideWeaponsAdsFunc);
  }
}

if (wireframeArms) {
  frameFuncs.push(wireframeArmsFunc);
}

if (wireframeWeapons) {
  frameFuncs.push(wireframeWeaponsFunc);
}

if (leftHanded) {
  frameFuncs.push(overlayModelFunc);
}

if (hideWeaponsAds || hideArms || wireframeArms || wireframeWeapons || rainbow) {
  if (!frameFuncs.includes(InitweaponFunc)) {
    frameFuncs.unshift(InitweaponFunc);
  }
}

// eslint-disable-next-line no-extend-native
WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {
  apply(target, thisArg, argArray) {
    if (argArray[0] && argArray[0].type === 'Scene') {
      if (argArray[0].children[0].type === 'AmbientLight') {
        ShouldHiglight = false;
        scene = argArray[0];

        setTimeout(() => {
          scene.children.forEach((e) => {
            // prettier-ignore
            if (e.type === "Sprite" && !e.material.depthTest && e.material.map?.image?.width === 149) {
                            flagMaterial = e.material;
                        }
          });
        }, 1000);

        const j = setInterval(() => {
          try {
            if (scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems']['2']['_queries']['animationEntities']['entities']) {
              ShouldHiglight = true;
            }
          } catch {}
          if (ShouldHiglight) {
            clearInterval(j);
          }
        });
      } else if (argArray[0].children[0].type === 'DirectionalLight') {
        // prettier-ignore
        if (argArray[0].children[3]?.children[0]?.children[0]) {
                    overlayModel = null;
                    const t = setInterval(() => {

                        try {
                            for (let i = 0; i < argArray[0].children[3].children[0].children.length; i++) {
                                if (argArray[0].children[3].children[0].children[i].type === "Object3D") {
                                    overlayModel = argArray[0].children[3].children[0].children[i];
                                    break;
                                }
                            }
                        } catch {
                        }
                        if (overlayModel) clearInterval(t);
                    });
                }
      }
    }

    // eslint-disable-next-line prefer-rest-params
    return Reflect.apply(...arguments);
  },
});

new MutationObserver((mutationRecords) => {
    if (window.location.href.match(/kirka[.]io[/]game/g) !== null && !document.querySelector(".end-modal")) {
      if (!animate) {
        animateState("true");
      }
  
      try {
        if (document.getElementsByClassName("list-weapons")[0].children[0].children[0].innerText !== null) {
          weap = document.getElementsByClassName("list-weapons")[0].children[0].children[0].innerText;
          num = 4;
          if (weap === "Weatie" || weap === "MAC-10") {
            num = 5;
          } else if (weap === "AR-9") {
            num = 3;
          }
        }
      } catch {}
    } else {
      ShouldHiglight = false;
      scene = false;
  
      if (animate) {
        animateState();
      }
  
      if (window.location.href.match(/kirka[.]io[/]servers/g) !== null && !document.querySelector("#view > div > div > div.content > div.servers > div > div.list-cont > div.tabs > div.mods.tabmods")) {
        SetGameModesCheckBoxes();
      }
    }
  
    try {
      mutationRecords.forEach((record) => {
        record.addedNodes.forEach((el) => {
          if (el.classList?.contains("loading-scene") && noLoadingTimes)
            el.parentNode.removeChild(el);
          if (el.id === "qc-cmp2-container") el.parentNode.removeChild(el);
  
          if (el.id === "cmpPersistentLink" || el.classList?.contains("home") || el.classList?.contains("moneys")) {
            if (!document.querySelector("#clientJoinButton")) {
              let btn = document.createElement("button");
              btn.id = "clientJoinButton";
  
              btn.style = `
              background-color: var(--primary-1);
              --hover-color: var(--primary-2);
              --top: var(--primary-2);
              --bottom: var(--primary-3);
              display: flex;
              justify-content: center;
              align-items: center;
              border: none;
              position: absolute;
              color: var(--white);
              font-size: 1rem;
              transition: all .3s ease;
              font-family: Rowdies;
              padding: .9em 1.4em;
              transform: skew(-10deg);
              font-weight: 900;
              overflow: hidden;
              text-transform: uppercase;
              border-radius: .2em;
              outline: none;
              text-shadow: 0 0.1em 0 #000;
              -webkit-text-stroke: 1px var(--black);
              box-shadow: 0 0.15rem 0 rgba(0,0,0,.315);
              cursor: pointer;
              box-shadow: 0 5.47651px 0 rgba(0,0,0,.5);
              text-shadow: -1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 1px 1px rgba(0,0,0,.486);
              width: 150px;
              height: 50px;
              bottom: 20px;
              right: 100%;
              margin-right: 10px;
              font-size: 20px;
              `;
  
              btn.innerText = "Join Link";
  
              btn.onclick = () => {
                window.open(clipboard.readText());
              };
  
              document.getElementsByClassName("play-content")[0].append(btn);
            }
            document.getElementsByClassName("settings-and-socicons")[0].children[0].onclick = () => {
              window.open("https://discord.com/invite/cNwzjsFHpg");
            };
  
            document.getElementsByClassName("settings-and-socicons")[0].children[1].onclick = () => {
              window.open(
                "https://github.com/42infi/better-kirka-client/releases"
              );
            };
  
            if (!el.classList?.contains("home") && !el.classList?.contains("moneys"))
              el.parentNode.removeChild(el);
          }
          /*
  
          if (el.classList?.contains("game-interface")) {
                      crosshair = document.getElementById("crosshair-static");
                  }
                  */
  
          if (el.classList?.contains("settings") && !settingsButtonsAdded) {
            let exportBtn = document.createElement("div");
  
            exportBtn.id = "importBtn";
  
            exportBtn.style = `
            line-height: 1.2;
            user-select: none;
            --white: #fff;
            --secondary-2: #37477c;
            -webkit-font-smoothing: antialiased;
            text-align: center;
            font-family: Exo\ 2;
            box-sizing: border-box;
            text-shadow: -1px -1px 0 #0f0f0f,1px -1px 0 #0f0f0f,-1px 1px 0 #0f0f0f,1px 1px 0 #0f0f0f;
            font-weight: 100;
            height: 100%;
            padding: 0 .8rem;
            color: var(--white);
            font-size: 1.5rem;
            box-shadow: 0 .125rem .25rem rgba(24,28,40,.25);
            border-radius: 0 .313rem .313rem 0;
            background-color: var(--secondary-2);
            display: flex;
            justify-content: center;
            align-items: center;
            `;
  
            exportBtn.onmouseover = () => {
              exportBtn.style.color = "#ffd500";
            };
  
            exportBtn.onmouseout = () => {
              exportBtn.style.color = "#ffffff";
            };
  
            exportBtn.innerText = "Export to clipboard";
  
            exportBtn.onclick = () => {
              let gameSettingsObj = {};
  
              for (let key in localStorage) {
                if (key.startsWith("m")) {
                  if (localStorage[key].startsWith('"') && localStorage[key].endsWith('"')) {
                    gameSettingsObj[key] = localStorage[key].slice(1, -1);
                  } else {
                    gameSettingsObj[key] = localStorage[key];
                  }
                }
              }
              clipboard.writeText(JSON.stringify(gameSettingsObj));
            };
  
            let importBtn = document.createElement("div");
  
            importBtn.id = "importBtn";
  
            importBtn.style = `
            line-height: 1.2;
            user-select: none;
            --white: #fff;
            --secondary-2: #37477c;
            -webkit-font-smoothing: antialiased;
            text-align: center;
            font-family: Exo\ 2;
            box-sizing: border-box;
            text-shadow: -1px -1px 0 #0f0f0f,1px -1px 0 #0f0f0f,-1px 1px 0 #0f0f0f,1px 1px 0 #0f0f0f;
            font-weight: 100;
            height: 100%;
            padding: 0 .8rem;
            color: var(--white);
            font-size: 1.5rem;
            box-shadow: 0 .125rem .25rem rgba(24,28,40,.25);
            border-radius: 0 .313rem .313rem 0;
            background-color: var(--secondary-2);
            display: flex;
            justify-content: center;
            align-items: center;
            `;
  
            importBtn.onmouseover = () => {
              importBtn.style.color = "#ffd500";
            };
  
            importBtn.onmouseout = () => {
              importBtn.style.color = "#ffffff";
            };
  
            importBtn.innerText = "Import from clipboard";
  
            importBtn.onclick = () => {
              Object.assign(localStorage, JSON.parse(clipboard.readText()));
              window.location.reload();
            };
  
            document.getElementsByClassName("left")[0].appendChild(exportBtn);
            document.getElementsByClassName("left")[0].appendChild(importBtn);
  
            settingsButtonsAdded = true;
          }
        });
      });
    } catch {}
  }).observe(document, { childList: true, subtree: true });
  
// new adblock
Object.defineProperty(window, 'aiptag', {
  // eslint-disable-next-line no-unused-vars
  set(v) {},
  // eslint-disable-next-line getter-return
  get() {},
});

document.addEventListener('DOMContentLoaded', () => {
  if (customCss) {
    let cssLinkElem = document.createElement('link');
    cssLinkElem.href = settings.get('cssLink');
    cssLinkElem.rel = 'stylesheet';
    document.head.append(cssLinkElem);
  }

  gui.id = 'gui';

  let guistyles = `

#gui {
  background-color: #18191c;
  border: 5px solid #18191c;
  border-top: 0px;
  border-bottom: 0px;
  box-shadow: 0 0 8px 2px #000;
  position: absolute;
  left: 5%;
  top: 2.5%;
  z-index: 300;
  color: #fff;
  padding: 6px;
  font-family: "Titillium Web",serif;
  line-height: 1.6;
  border-radius: 3px;
  max-height: 95%;
  max-width: 90%;
  min-width: 51%;
  min-height: 45%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  place-content: stretch space-between;
  align-items: stretch;
  resize: both;
  overflow: auto;
  padding-top: .1rem;
}

.heading {
  min-height: 2.3rem;
  max-height: 2.3rem;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin: 0px -6px 8px;
  font-size: 24px;
  border-bottom: 2px solid #8c8c8c;
  min-width: 100%;
  overflow: hidden;
  line-height: 1.7rem;
  margin-bottom: -0px;
}

.footer, .heading {
  background-color: #18191c;
  font-family: "Titillium Web",serif;
  font-weight: 700;
  text-align: center;
}

.module-wrapper {
  display: flex;
  flex-wrap: wrap;
  max-height: 80%;
  align-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}

.module {
  overflow-wrap: anywhere;
}

.colordemo {
  user-select: none;
  cursor: default;
  pointer-events: none;
  width: 1.75rem;
  border-radius: 0.2rem;
  margin-right: .5rem;
}

.footer {
  min-height: 0%;
  max-height: 8%;
  justify-content: center;
  align-items: center;
  margin: 6px -6px 0px;
  font-size: 11px;
  border-top: 2px solid #8c8c8c;
  line-height: 1.6rem;
}

.autojoin-hr {
  width: 20%;
  min-width: 10%;
  height: 1px;
  background-color: #8c8c8c;
  margin: .5rem 0;
  margin-right: .3rem;
}

input:disabled {
  background: #fff;
  border: 1px solid #000;
  width: 50px
}

.module:hover {
  background-color: rgb(0, 0, 0, .1)
}

`;

  if (permCrosshair) guistyles += 'img#crosshair-static{opacity:1!important;}';
  /*
if (noLoadingTimes)
guistyles +='.loading-scene{display:none!important;}';
*/
  // prettier-ignore
  gui.innerHTML +=`<style id="BKC-Styles">@import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap');` + guistyles + `</style>

  <div id="infi" class="heading">Client Settings</div>
      <div class="module-wrapper">
           <div class="module">
               <input type="checkbox" id="crosshair" name="crosshair">
               <label for="crosshair">Perm. Crosshair</label>
           </div>
       
           <div class="module">
               <input type="checkbox" id="customCSS" name="customCSS">
               <label for="customCSS">CSS Link: </label>
               <input type="text" id="cssLink" placeholder="Paste CSS Link Here">
           </div>
       
           <div class="module">
               <input type="checkbox" id="hideweap" name="hideweap">
               <label for="hideweap">Hide Weapon ADS</label>
           </div>
       
           <div class="module">
               <input type="checkbox" id="arms" name="arms">
               <label for="arms">Hide Arms</label>
           </div>
       
           <div class="module">
               <input type="checkbox" id="leftHanded" name="leftHanded">
               <label for="leftHanded">Left Handed</label>
           </div>
       
           <div class="module">
               <input type="checkbox" id="hideflag" name="hideflag">
               <label for="hideflag">Hide Flag ADS</label>
           </div>
       
           <div class="module">
               <input type="checkbox" id="highlight" name="highlight">
               <label for="highlight">Highlight Players</label>
           </div>
       
           <div class="module">
               <label for="EnemyhighlightColor">Custom Enemy Highlight Color: </label>
               <input type="text" title="Enter a Valid Color Value &#013; examples: &#013; Red &#013; Yellow &#013; DarkGoldenRod &#013; #000000 &#013; rgb(255,04,65)" id="EnemyhighlightColorFilterField" placeholder="Red">
               <input type="text" class="colordemo" id="EnemyhighlightColorCard">
               </div>

           <div class="module" style="margin: .25rem 0;">
               <label for="TeamhighlightColor">Custom Teammate Highlight Color: </label>
               <input type="text" title="Enter a Valid Color Value &#013; examples: &#013; Red &#013; Yellow &#013; DarkGoldenRod &#013; #000000 &#013; rgb(255,04,65)" id="TeamhighlightColorFilterField" placeholder="Blue">
               <input type="text" class="colordemo" id="TeamhighlightColorCard">
               </div>

           <div class="module">
               <input type="checkbox" id="wireframeWeapons" name="wireframeWeapons">
               <label for="wireframeWeapons">Wireframe Weapons</label>
           </div>
       
           <div class="module">
               <input type="checkbox" id="wireframeArms" name="wireframeArms">
               <label for="wireframeArms">Wireframe Arms</label>
           </div>
       
           <div class="module">
               <input type="checkbox" id="rainbow" name="rainbow">
               <label for="rainbow">Rainbow Colors</label>
           </div>
       
           <div class="module">
               Inspect Key
               <button id="inspBindButton" style="width: 100px">click to bind</button>
           </div>
       
           <div class="module">
               <input type="checkbox" id="adspower" name="adspower">
               <label for="adspower">0 ADS Power</label>
           </div>
       
           <div class="module">
               <input type="checkbox" id="autoJoin" name="autoJoin">
               <label for="autoJoin">Auto-Joiner (Key F7)</label>
           </div>
       
           <div class="module autojoin autojoin-hr"></div>
       
           <div class="module autojoin">
               <input type="checkbox" id="euLobbies" name="euLobbies">
               <label for="euLobbies">EU Lobbies</label>
           </div>
       
           <div class="module autojoin">
               <input type="checkbox" id="naLobbies" name="naLobbies">
               <label for="naLobbies">NA Lobbies</label>
           </div>
       
           <div class="module autojoin">
               <input type="checkbox" id="asiaLobbies" name="asiaLobbies">
               <label for="asiaLobbies">ASIA Lobbies</label>
           </div>
       
           <div class="module autojoin">
               <input type="checkbox" id="ffaLobbies" name="ffaLobbies">
               <label for="ffaLobbies">FFA Lobbies</label>
           </div>
       
           <div class="module autojoin">
               <input type="checkbox" id="tdmLobbies" name="tdmLobbies">
               <label for="tdmLobbies">TDM Lobbies</label>
           </div>
       
           <div class="module autojoin">
               <input type="checkbox" id="parkourLobbies" name="parkourLobbies">
               <label for="parkourLobbies">PARKOUR Lobbies</label>
           </div>
       
           <div class="module autojoin">
               <label for="preferredFilter">Prefered Filter:</label>
               <select id="preferredFilter" name="preferredFilter">
                   <option value="Time">Time</option>
                   <option value="Players">Players</option>
               </select>
           </div>
       
           <div class="module autojoin">
               <input type="range" id="minPlayers" name="minPlayers" min="0" max="8" value="0" step="1">
               <label id="minPlayersLab" for="minPlayers">min. Players</label>
           </div>
       
           <div class="module autojoin">
               <input type="range" id="maxPlayers" name="maxPlayers" min="0" max="8" value="0" step="1">
               <label id="maxPlayersLab" for="maxPlayers">max. Players</label>
           </div>
       
           <div class="module autojoin">
               <input type="range" id="minTimeLeft" name="minTimeLeft" min="0" max="8" value="0" step="1">
               <label id="minTimeLeftLab" for="minTimeLeft">min. Time Left</label>
           </div>
       
           <div class="module autojoin">
               <input type="checkbox" id="filterMaps" name="filterMaps">
               <label for="filterMaps">Map Filter: </label>
               <input type="text" id="mapFilterField" placeholder="Map1, Map2, Map3, etc.">
           </div>
       
           <div class="module autojoin">
               <input type="checkbox" id="customGames" name="customGames">
               <label for="customGames">Custom Games </label>
           </div>
       
           <div class="module autojoin autojoin-hr"></div>
       
           <div class="module">
               <input type="checkbox" id="fpsCap" name="fpsCap">
               <label for="fpsCap">Cap FPS</label>
           </div>
       
           <div class="module">
               <input type="checkbox" id="capture" name="capture">
               <label for="capture">Window Capture</label>
           </div>
       
           <div class="module">
               Menu Toggle Key
               <button id="menuBindButton" style="width: 100px">click to bind</button>
           </div>
       
           <div class="module">
               <input type="range" id="volume" name="volume" min="0" max="2" value="1" step="0.1">
               <label id="volumeLab" for="volume">Volume</label>
           </div>
       
           <div class="module">
               <input type="checkbox" id="noKillSound" name="noKillSound">
               <label for="noKillSound">Disable Killsounds (applies after reload)</label>
           </div>

           <div class="module">
               <input type="checkbox" id="marketNames" name="marketNames">
               <label for="marketNames">Market Names</label>
           </div>
               <div class="module">
               <input type="checkbox" id="customPrice" name="customPrice">
               <label for="customPrice">Custom List Price</label>
           </div>

           <div class="module">
           <input type="checkbox" id="ShowBadges" name="ShowBadges">
           <label title="Show Custom Client Badges" for="ShowBadges">Show Custom Badges</label>
           </div>

      </div><div class="footer">Toggle With "PageUp" Key</div>

`;

  gui.onclick = (e) => {
    if (e.target.id === 'ShowBadges') {
      ShowBadges = e.target.checked;
      settings.set('ShowBadges', ShowBadges);
      if (ShowBadges) {
        ShowBadgesFunc();
      }
    }

    if (e.target.id === 'crosshair') {
      permCrosshair = e.target.checked;
      settings.set('permCrosshair', permCrosshair);

      /*
      if (permCrosshair) {
        if (!frameFuncs.includes(permCrosshairFunc)) {
          frameFuncs.push(permCrosshairFunc);
        }
      } else {
        frameFuncsRemove(permCrosshairFunc);
      }
*/

      permCrosshairToggleFunc();
    }

    if (e.target.id === 'hideweap') {
      hideWeaponsAds = e.target.checked;
      settings.set('hideWeaponsAds', hideWeaponsAds);

      if (hideWeaponsAds) {
        try {
          clearTimeout(clearhideWeaponsAdsFunc);
        } catch {}

        if (!frameFuncs.includes(hideWeaponsAdsFunc)) {
          frameFuncs.push(hideWeaponsAdsFunc);
        }
        if (!frameFuncs.includes(InitweaponFunc)) {
          frameFuncs.unshift(InitweaponFunc);
        }
      } else if (!hideArms && !hideWeaponsAds) {
          clearhideArmsFunc = setTimeout(() => {
            frameFuncsRemove(hideWeaponsAdsFunc);
            CleanweaponFunc();
          }, 100);
        }
      
    }

    if (e.target.id === 'arms') {
      hideArms = e.target.checked;
      settings.set('hideArms', hideArms);
      if (hideArms) {
        arms = false;
        try {
          clearTimeout(clearhideArmsFunc);
        } catch {}

        if (!frameFuncs.includes(hideWeaponsAdsFunc)) {
          frameFuncs.push(hideWeaponsAdsFunc);
        }
        if (!frameFuncs.includes(InitweaponFunc)) {
          frameFuncs.unshift(InitweaponFunc);
        }
      } else {
        arms = true;
        if (!hideArms && !hideWeaponsAds){
        clearhideArmsFunc = setTimeout(() => {
          frameFuncsRemove(hideWeaponsAdsFunc);
          CleanweaponFunc();
        }, 100);
      }
      }
    }

    if (e.target.id === 'leftHanded') {
      leftHanded = e.target.checked;
      settings.set('leftHanded', leftHanded);
      if (leftHanded) {
        try {
          clearTimeout(clearoverlayModelFunc);
        } catch {}
        if (!frameFuncs.includes(overlayModelFunc)) {
          frameFuncs.push(overlayModelFunc);
        }
      } else {
        clearoverlayModelFunc = setTimeout(() => {
          frameFuncsRemove(overlayModelFunc);
          CleanweaponFunc();
        }, 100);
      }
    }

    if (e.target.id === 'hideflag') {
      hideFlagAds = e.target.checked;
      settings.set('hideFlagAds', hideFlagAds);
      if (hideFlagAds) {
        try {
          clearTimeout(clearhideFlagAdsFunc);
        } catch {}
        if (!frameFuncs.includes(hideFlagAdsFunc)) {
          frameFuncs.push(hideFlagAdsFunc);
        }
      } else {
        clearhideFlagAdsFunc = setTimeout(() => {
          frameFuncsRemove(hideFlagAdsFunc);
          CleanweaponFunc();
        }, 100);
      }
    }

    if (e.target.id === 'highlight') {
      playerHighLight = e.target.checked;
      settings.set('playerHighLight', playerHighLight);
      if (playerHighLight) {
        try {
          clearTimeout(clearplayerHighLightFunc);
        } catch {}
        if (!frameFuncs.includes(playerHighLightFunc)) {
          frameFuncs.push(playerHighLightFunc);
        }
      } else {
        clearplayerHighLightFunc = setTimeout(() => {
          frameFuncsRemove(playerHighLightFunc);
        }, 100);
      }
    }
    /*
        if (e.target.id === "black") {
            fullBlack = e.target.checked;
            settings.set('fullBlack', fullBlack);
        }
        */

    if (e.target.id === 'wireframeWeapons') {
      wireframeWeapons = e.target.checked;
      settings.set('wireframeWeapons', wireframeWeapons);
      if (wireframeWeapons) {
        try {
          clearTimeout(clearwireframeWeaponsFunc);
        } catch {}
        if (!frameFuncs.includes(wireframeWeaponsFunc)) {
          frameFuncs.push(wireframeWeaponsFunc);
        }

        if (!frameFuncs.includes(InitweaponFunc)) {
          frameFuncs.unshift(InitweaponFunc);
        }
      } else {
        clearwireframeWeaponsFunc = setTimeout(() => {
          frameFuncsRemove(wireframeWeaponsFunc);
          CleanweaponFunc();
        }, 100);
      }
    }

    if (e.target.id === 'wireframeArms') {
      wireframeArms = e.target.checked;
      settings.set('wireframeArms', wireframeArms);
      if (wireframeArms) {
        try {
          clearTimeout(clearwireframeArmsFunc);
        } catch {}
        if (!frameFuncs.includes(wireframeArmsFunc)) {
          frameFuncs.push(wireframeArmsFunc);
        }
        if (!frameFuncs.includes(InitweaponFunc)) {
          frameFuncs.unshift(InitweaponFunc);
        }
      } else {
        clearwireframeArmsFunc = setTimeout(() => {
          frameFuncsRemove(wireframeArmsFunc);
          CleanweaponFunc();
        }, 100);
      }
    }

    if (e.target.id === 'rainbow') {
      rainbow = e.target.checked;
      settings.set('rainbow', rainbow);
      if (rainbow) {
        if (!frameFuncs.includes(InitweaponFunc)) {
          frameFuncs.unshift(InitweaponFunc);
        }
        rainbowFunc();
      }
    }

    if (e.target.id === 'adspower') {
      adspower = e.target.checked;
      settings.set('adspower', adspower);
    }

    if (e.target.id === 'customCSS') {
      customCss = e.target.checked;
      settings.set('customCss', customCss);
    }

    if (e.target.id === 'autoJoin') {
      autoJoin = e.target.checked;
      settings.set('autoJoin', autoJoin);
      for (let f of document.getElementsByClassName('autojoin')) {
        // prettier-ignore
        f.style.display = autoJoin ? 'block' : 'none';
      }
    }

    if (e.target.id === 'euLobbies') {
      euLobbies = e.target.checked;
      settings.set('euLobbies', euLobbies);
    }

    if (e.target.id === 'naLobbies') {
      naLobbies = e.target.checked;
      settings.set('naLobbies', naLobbies);
    }

    if (e.target.id === 'asiaLobbies') {
      asiaLobbies = e.target.checked;
      settings.set('asiaLobbies', asiaLobbies);
    }

    if (e.target.id === 'ffaLobbies') {
      ffaLobbies = e.target.checked;
      settings.set('ffaLobbies', ffaLobbies);
    }

    if (e.target.id === 'tdmLobbies') {
      tdmLobbies = e.target.checked;
      settings.set('tdmLobbies', tdmLobbies);
    }

    if (e.target.id === 'parkourLobbies') {
      parkourLobbies = e.target.checked;
      settings.set('parkourLobbies', parkourLobbies);
    }

    if (e.target.id === 'filterMaps') {
      filterMaps = e.target.checked;
      settings.set('filterMaps', filterMaps);
    }

    if (e.target.id === 'customGames') {
      customGames = e.target.checked;
      settings.set('customGames', customGames);
    }

    if (e.target.id === 'fpsCap') {
      fpsCap = e.target.checked;
      settings.set('fpsCap', fpsCap);
      alert('setting will apply after client restart');
    }

    if (e.target.id === 'capture') {
      capture = e.target.checked;
      settings.set('capture', capture);
      alert('setting will apply after client restart');
    }

    if (e.target.id === 'noKillSound') {
      noKillSound = e.target.checked;
      settings.set('noKillSound', noKillSound);
    }

    if (e.target.id === 'marketNames') {
      marketNames = e.target.checked;
      settings.set('marketNames', marketNames);
    }

    if (e.target.id === 'customPrice') {
      customPrice = e.target.checked;
      settings.set('customPrice', customPrice);
    }
  };

  gui.style.display = 'none';

  document.body.appendChild(gui);

  if (settings.get('menuOpen') === undefined || settings.get('menuOpen')) {
    toggleGui();
  }

  document.getElementById('crosshair').checked = permCrosshair;
  document.getElementById('customCSS').checked = customCss;
  document.getElementById('hideweap').checked = hideWeaponsAds;
  document.getElementById('arms').checked = hideArms;
  document.getElementById('leftHanded').checked = leftHanded;
  document.getElementById('hideflag').checked = hideFlagAds;
  document.getElementById('highlight').checked = playerHighLight;
  // document.getElementById("black").checked = fullBlack;
  document.getElementById('wireframeWeapons').checked = wireframeWeapons;
  document.getElementById('wireframeArms').checked = wireframeArms;
  document.getElementById('rainbow').checked = rainbow;
  document.getElementById('adspower').checked = adspower;
  document.getElementById('ShowBadges').checked = ShowBadges;
  maxPlayersLab = document.getElementById('maxPlayersLab');
  minPlayersLab = document.getElementById('minPlayersLab');
  minTimeLeftLab = document.getElementById('minTimeLeftLab');
  maxPlayerSlider = document.getElementById('maxPlayers');
  minPlayerSlider = document.getElementById('minPlayers');
  minTimeLeftSlider = document.getElementById('minTimeLeft');
  maxPlayerSlider.onchange = () => {
    // eslint-disable-next-line radix
    settings.set('maxPlayers', Number.parseInt(maxPlayerSlider.value));
  };
  minPlayerSlider.onchange = () => {
    // eslint-disable-next-line radix
    settings.set('minPlayers', Number.parseInt(minPlayerSlider.value));
  };
  minTimeLeftSlider.onchange = () => {
    // eslint-disable-next-line radix
    settings.set('minTimeLeft', Number.parseInt(minTimeLeftSlider.value));
  };
  minPlayerSlider.value = minPlayers;
  maxPlayerSlider.value = maxPlayers;
  minTimeLeftSlider.value = minTimeLeft;
  if (autoJoin) {
    for (let e of document.getElementsByClassName('autojoin')) {
      // prettier-ignore
      e.style.display = autoJoin ? 'block' : 'none';
    }
  }

  document.getElementById('autoJoin').checked = autoJoin;
  document.getElementById('euLobbies').checked = euLobbies;
  document.getElementById('naLobbies').checked = naLobbies;
  document.getElementById('asiaLobbies').checked = asiaLobbies;
  document.getElementById('ffaLobbies').checked = ffaLobbies;
  document.getElementById('tdmLobbies').checked = tdmLobbies;
  document.getElementById('parkourLobbies').checked = parkourLobbies;

  let inspectBindButton = document.getElementById('inspBindButton');
  inspectBindButton.style.fontWeight = '800';
  inspectBindButton.onclick = () => {
    inspectListening = true;
    inspectBindButton.innerText = 'Press a Key';
  };

  inspectBindButton.innerText = settings.get('inspectKey').toUpperCase();
  let cssField = document.getElementById('cssLink');
  if (settings.get('cssLink') === undefined) settings.set('cssLink', '');
  cssField.value = settings.get('cssLink');

  cssField.oninput = () => {
    settings.set('cssLink', cssField.value);
  };

  let filter = document.getElementById('preferredFilter');

  filter.value = preferredFilter;

  filter.onchange = () => {
    preferredFilter = filter.value;
    settings.set('preferredFilter', filter.value);
  };

  document.getElementById('filterMaps').checked = filterMaps;

  let mapField = document.getElementById('mapFilterField');

  let mapString = '';
  for (let name of maps) {
    mapString += name + ', ';
  }

  mapField.value = mapString.slice(0, -2);

  mapField.oninput = () => {
    maps = mapField.value.replace(/ /g, '').toLowerCase().split(',');
    settings.set('maps', maps);
  };

  function GetUsableColor(Element) {
    let a = window
      .getComputedStyle(Element)
      .backgroundColor.replace(/rgb[(](.*)[)]/g, '$1')
      .split(',');
    if (a[0] !== a[1] && a[0] !== a[2] && a[1] !== a[0] && a[1] !== a[2]) {
      return hexToRgb(hslToHex(hexToH(rgbToHex(Number(a[0]), Number(a[1]), Number(a[2]))), 100, 50));
    }
    return hexToRgb(rgbToHex(Number(a[0]), Number(a[1]), Number(a[2])));
  }

  // Enemy color
  let EnemyhighlightColorString = document.getElementById('EnemyhighlightColorFilterField');
  let EnemyhighlightColorCard = document.getElementById('EnemyhighlightColorCard');
  // prettier-ignore
  // eslint-disable-next-line no-shadow, no-nested-ternary, eqeqeq
  colorEnemy = typeof settings.get('EnemyhighlightColor') == 'undefined' ? (fullBlack ? settingsSetGit('EnemyhighlightColor','Black') : settingsSetGit('EnemyhighlightColor','Red')) : settings.get('EnemyhighlightColor');
  EnemyhighlightColorString.value = colorEnemy;
  EnemyhighlightColorCard.style = 'background-color:' + colorEnemy + ';';
  colorEnemy = GetUsableColor(EnemyhighlightColorCard);

  if (EnemyhighlightColorString.value === 'Red') {
    EnemyhighlightColorString.value = '';
  }

  EnemyhighlightColorString.oninput = () => {
    if (EnemyhighlightColorString.value.length === 0) {
      EnemyhighlightColorCard.style.backgroundColor = 'Red';
      settings.set('EnemyhighlightColor', 'Red');
    } else {
      EnemyhighlightColorCard.style.backgroundColor = EnemyhighlightColorString.value;
      settings.set('EnemyhighlightColor', EnemyhighlightColorString.value);
    }

    colorEnemy = GetUsableColor(EnemyhighlightColorCard);

    /*
  setTimeout(() => {
    consoledebug(colorEnemy,'debug','true');
  },1000);
  */
  };

  // Team color
  let TeamhighlightColorString = document.getElementById('TeamhighlightColorFilterField');
  let TeamhighlightColorCard = document.getElementById('TeamhighlightColorCard');
  // prettier-ignore
  // eslint-disable-next-line no-shadow, no-nested-ternary, eqeqeq
  colorTeam = typeof settings.get('TeamhighlightColor') == 'undefined' ? settingsSetGit('TeamhighlightColor','Blue') : settings.get('TeamhighlightColor');
  TeamhighlightColorString.value = colorTeam;
  TeamhighlightColorCard.style = 'background-color:' + colorTeam + ';';
  colorTeam = GetUsableColor(TeamhighlightColorCard);

  if (TeamhighlightColorString.value === 'Blue') {
    TeamhighlightColorString.value = '';
  }

  TeamhighlightColorString.oninput = () => {
    if (TeamhighlightColorString.value.length === 0) {
      TeamhighlightColorCard.style.backgroundColor = 'Blue';
      settings.set('TeamhighlightColor', 'Blue');
    } else {
      TeamhighlightColorCard.style.backgroundColor = TeamhighlightColorString.value;
      settings.set('TeamhighlightColor', TeamhighlightColorString.value);
    }

    colorTeam = GetUsableColor(TeamhighlightColorCard);

    /*
setTimeout(() => {
  consoledebug(colorTeam,'debug','true');
},1000);
*/
  };

  document.getElementById('customGames').checked = customGames;

  document.getElementById('fpsCap').checked = fpsCap;
  document.getElementById('capture').checked = capture;
  document.getElementById('marketNames').checked = marketNames;
  document.getElementById('customPrice').checked = customPrice;

  let menuBindButton = document.getElementById('menuBindButton');
  menuBindButton.style.fontWeight = '800';
  menuBindButton.onclick = () => {
    menuListening = true;
    menuBindButton.innerText = 'Press a Key';
  };

  // prettier-ignore
  menuBindButton.innerText = settings.get("menuKey") !== undefined ? settings.get("menuKey").toUpperCase() : "click to bind";

  document.getElementById('noKillSound').checked = noKillSound;

  volumeLab = document.getElementById('volumeLab');
  volumeSlider = document.getElementById('volume');

  volumeSlider.onchange = () => {
    settings.set('volume', Number.parseFloat(volumeSlider.value));
    for (let i = 0; i < gains.length; i++) {
      const cur = gains[i];
      if (cur) cur.value = volume;
    }
  };

  volumeSlider.value = volume;

  // adds search bar
  if (document.querySelector('#view > div > div > div.top-bar > div.left') && !document.querySelector('#searchfrnds')) {
    let fbtn = document.createElement('input');
    fbtn.placeholder = 'Search...';
    fbtn.className = 'input';
    fbtn.id = 'searchfrnds';
    fbtn.style.width = 'calc(100%)';
    fbtn.style.margin = 'auto 0.3rem';
    fbtn.style.cursor = 'text';
    fbtn.innerHTML = '<style>html>body>div#app>div#view{user-select:text!important;}</style>';
    insertAfter(fbtn, document.querySelector('#view > div > div > div.top-bar > div.left'));
    fbtn.addEventListener('keypress', (evt) => {
      if (evt.key === 'Enter') {
        window.find(document.querySelector('#searchfrnds').value, false, false, true, false, true);
        scrollIntoView(window.getSelection());
      }
    });
  }
});

document.addEventListener('mousedown', (e) => {
  inspectingoverride = true;
  inspecting = false;
  if (e.button === 2) scoped = true;
});

document.addEventListener('mouseup', (e) => {
  inspectingoverride = false;
  if (e.button === 2) scoped = false;
  if (e.button === 3 || e.button === 4) e.preventDefault();
});

let inspectedWeapon;
let clearInspectFunc;

gui.addEventListener('keydown', (e) => {
  if (inspectListening) {
    settings.set('inspectKey', e.key);
    document.getElementById('inspBindButton').innerText = e.key.toUpperCase();
    inspectListening = false;
  }
  if (menuListening) {
    settings.set('menuKey', e.key);
    document.getElementById('menuBindButton').innerText = e.key.toUpperCase();
    menuListening = false;
    toggleGui();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === settings.get('inspectKey').toLowerCase() && !inspectingoverride) {
    try {
      clearTimeout(clearInspect);
    } catch {}
    try {
      clearTimeout(clearInspectFunc);
    } catch {}
    inspecting = true;
    if (!frameFuncs.includes(inspectingFunc)) {
      frameFuncs.push(inspectingFunc);
    }
    if (!frameFuncs.includes(InitweaponFunc)) {
          frameFuncs.unshift(InitweaponFunc);
        }
    // prettier-ignore
  } else if (e.key.toLowerCase() === settings.get('menuKey')?.toLowerCase() || e.key === 'PageUp') {
    toggleGui();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === settings.get('inspectKey').toLowerCase()) {
    try {
      clearTimeout(clearInspect);
    } catch {}
    try {
      clearTimeout(clearInspectFunc);
    } catch {}
    clearInspect = setTimeout(() => {
      inspecting = false;
      inspectingoverride = false;
      clearInspectFunc = setTimeout(() => {
        frameFuncsRemove(inspectingFunc);
        CleanweaponFunc();
      }, 100);
    }, 3000);
  }
});

if (discord) {
  // eslint-disable-next-line no-global-assign
  XMLHttpRequest = class extends XMLHttpRequest {
    get response() {
      if (this.marketReq && marketNames) {
        this.marketReq = false;

        let newResponse = [];

        for (const listing of this.response) {
          listing.market = listing.market + ' | ' + listing.userId;
          newResponse.push(listing);
        }

        return newResponse;
      }

      return super.response;
    }

    open(method, url) {
      this.url = url;
      if (url === 'https://api.kirka.io/api/market') this.marketReq = true;
      // eslint-disable-next-line prefer-rest-params
      return super.open(...arguments);
    }

    async send(data) {
      if (this.url === 'https://api.kirka.io/api/inventory/market' && customPrice) {
        let json = JSON.parse(data);
        if (json.price > 0) {
          let result = await ipcRenderer.sendSync('pricePrompt');

          if (result == null) {
            json.price = -1;
          } else if (result !== '') {
            // eslint-disable-next-line no-shadow, radix
            let customPrice = Number.parseInt(result);
            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(customPrice)) {
              json.price = customPrice;
            }
          }

          data = JSON.stringify(json);
        }
      }

      return super.send(data);
    }
  };

  let updating = false;

  // eslint-disable-next-line no-inner-declarations
  async function marketUsers() {
    const countElements = document.getElementsByClassName('count');
    const itemElements = document.getElementsByClassName('item-name');

    let count = 0;

    for (let i = 0; i < countElements.length; i++) {
      let sellerId = countElements[i].innerText.split(' | ')[1];

      itemElements[i].innerText = itemElements[i].innerText.split(' - ')[0];

      fetch('https://api.kirka.io/api/user/getProfile', {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json;charset=UTF-8',
          Referer: 'https://kirka.io/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `{"id":"${sellerId}"}`,
        method: 'POST',
      }) // eslint-disable-next-line no-shadow
        .then((r) => r.json())
        .then((seller) => {
          count++;
          if (count >= countElements.length) updating = false;
          countElements[i].innerHTML = countElements[i].innerHTML.split(' | ')[0];
          itemElements[i].innerText += ' - ' + seller.name + '#' + seller.shortId;
        });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new MutationObserver(() => {
      if (window.location.href === 'https://kirka.io/hub/market') {
        if (document.getElementsByClassName('subjects').length === 2) {
          // prettier-ignore
          if (!document.getElementsByClassName("item-name")[0]?.innerText.includes(" - ")) {
                        if (!updating && marketNames) {
                            marketUsers();
                            updating = true;
                        }
                    }
        }
      }
    }).observe(document.querySelector('#view'), {
      subtree: true,
      childList: true,
    });
  });
}

animateState = (Newstate = 'false') => {
  if (Newstate === 'true') {
    if (!animate) {
      animate = () => {
        window.requestAnimationFrame(animate);
        for (let A of frameFuncs) {
          A();
        }
      };
      animate();
    }
  } else {
    animate = () => {
      animate = false;
    };
  }
};

// eslint-disable-next-line no-global-assign
XMLHttpRequest = class extends XMLHttpRequest {
  get responseText() {
    if (this.invReq) {
      this.invReq = false;
      let entries = JSON.parse(this.responseText);
      let sortedItems = { legendary: [], epic: [], rare: [], common: [] };

      for (let entry of entries) {
        sortedItems[entry.item.rarity.toLowerCase()].push(entry);
      }

      let editEntries = [];
      // eslint-disable-next-line guard-for-in
      for (let rarity in sortedItems) {
        editEntries = [].concat(editEntries, sortedItems[rarity]);
      }

      return JSON.stringify(editEntries);
    }

    return super.responseText;
  }

  open(method, url) {
    if (url === 'https://api.kirka.io/api/inventory') this.invReq = true;
    // eslint-disable-next-line prefer-rest-params
    return super.open(...arguments);
  }
};

function minutesLeft(e) {
  return Math.ceil(480 - (Date.now() - Date.parse(e)) / 1000);
}

document.onkeydown = (event) => {
  if (event.key === 'F7' && autoJoin) {
    responseCount = 0;
    allLobbyData = [];

    fetch('https://eu1.kirka.io/matchmake')
      .then((response) => response.json())
      .then((dataEU) => {
        for (let i = 0; i < dataEU.length; i++) {
          dataEU[i].region = 'EU';
        }
        if (euLobbies) {
          for (let i = 0; i < dataEU.length; i++) {
            allLobbyData.push(dataEU[i]);
          }
        }
        responseCount++;
        checkSearchLobby();
      });
    fetch('https://na1.kirka.io/matchmake')
      .then((response) => response.json())
      .then((dataNA) => {
        for (let i = 0; i < dataNA.length; i++) {
          dataNA[i].region = 'NA';
        }
        if (naLobbies) {
          for (let i = 0; i < dataNA.length; i++) {
            allLobbyData.push(dataNA[i]);
          }
        }
        responseCount++;
        checkSearchLobby();
      });
    fetch('https://asia1.kirka.io/matchmake')
      .then((response) => response.json())
      .then((dataASIA) => {
        for (let i = 0; i < dataASIA.length; i++) {
          dataASIA[i].region = 'ASIA';
        }
        if (asiaLobbies) {
          for (let i = 0; i < dataASIA.length; i++) {
            allLobbyData.push(dataASIA[i]);
          }
        }
        responseCount++;
        checkSearchLobby();
      });
  }
};

function checkSearchLobby() {
  if (responseCount < 3) return;

  if (parkourLobbies) {
    gameModes.push('ParkourRoom');
  }
  if (ffaLobbies) {
    gameModes.push('DeathmatchRoom');
  }
  if (tdmLobbies) {
    gameModes.push('TeamDeathmatchRoom');
  }

  let fittingLobbies = [];
  for (let i = 0; i < allLobbyData.length; i++) {
    if (allLobbyData[i].metadata.custom === true && !customGames) continue;
    if (allLobbyData[i].locked === false && allLobbyData[i].clients >= minPlayers && allLobbyData[i].clients <= maxPlayers && gameModes.includes(allLobbyData[i].name) && minutesLeft(allLobbyData[i].createdAt) >= minTimeLeft && (maps.includes(allLobbyData[i].metadata.mapName.toLowerCase()) || !filterMaps)) {
      if (avoidSameLobby) {
        if (!currentURL.includes(allLobbyData[i].roomId)) {
          fittingLobbies.push(allLobbyData[i]);
        }
      } else {
        fittingLobbies.push(allLobbyData[i]);
      }
    }
  }

  if (fittingLobbies.length !== 0) {
    bestLobby = fittingLobbies[0];
    if (fittingLobbies.length > 0) {
      for (let i = 0; i < fittingLobbies.length; i++) {
        if (bestLobby.clients < fittingLobbies[i].clients) {
          bestLobby = fittingLobbies[i];
        } else if (bestLobby.clients === fittingLobbies[i].clients) {
          if (minutesLeft(bestLobby.createdAt) < minutesLeft(fittingLobbies[i].createdAt)) {
            bestLobby = fittingLobbies[i];
          }
        }
      }
    }
  } else if (preferredFilter === 'Time') {
    bestLobby = fittingLobbies[0];
    if (fittingLobbies.length > 0) {
      for (let i = 0; i < fittingLobbies.length; i++) {
        if (minutesLeft(bestLobby.createdAt) < minutesLeft(fittingLobbies[i].createdAt)) {
          bestLobby = fittingLobbies[i];
        }
      }
    }
  }
  if (fittingLobbies.length !== 0 && bestLobby !== '') {
    let joinURL = 'https://kirka.io/games/' + bestLobby.region + '~' + bestLobby.roomId;
    window.open(joinURL);
    // prettier-ignore
  } else alert('No Lobby found - consider changing your settings'); // popup ohne alert?
}

function toggleGui() {
  menuVisible = !menuVisible;
  if (menuVisible) {
    menuVisibleFunc();
    // frameFuncs.push(menuVisibleFunc);
    document.exitPointerLock();
    gui.style.display = 'flex';
  } else {
    gui.style.display = 'none';
  }
  settings.set('menuOpen', menuVisible);
}

function hexToRgb(hex) {
  // prettier-ignore
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  // prettier-ignore
  return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

let oldDefine = Object.defineProperty;
Object.defineProperty = (...args) => {
  if (args[0] && args[1] && args[1] === 'renderer' && args[0].constructor.name.startsWith('_0x')) {
    if (args[0].WnNMwm) {
      Object.defineProperty(args[0].camera, 'fov', {
        get() {
          // prettier-ignore
          return adspower ? args[0].WnNMwm.fov : this.vFov;
        },
        set(v) {
          this.vFov = v;
        },
      });
    }
  }
  return oldDefine(...args);
};

const proxy = Function.prototype.constructor;
// eslint-disable-next-line no-extend-native
Function.prototype.constructor = function (...args) {
  if (args[0] === 'while (true) {}' || args[0] === 'debugger') return proxy.apply(this);
  // eslint-disable-next-line prefer-rest-params
  return proxy.apply(this, arguments);
};

// eslint-disable-next-line no-extend-native
Object.defineProperty(Object.prototype, 'gain', {
  set(v) {
    if (v.gain) {
      v.gain.value = volume;
      gains.push(v.gain);
    }
    this._v = v;
  },
  get() {
    return this._v;
  },
});

Object.defineProperty(Audio.prototype, 'muted', {
  // eslint-disable-next-line no-unused-vars
  set(v) {},
  get() {
    return noKillSound;
  },
});
