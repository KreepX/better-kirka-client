/* eslint-disable guard-for-in */
/* eslint-disable getter-return */
/* eslint-disable no-extend-native */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */

const { clipboard, shell } = require('electron');
const Store = require('electron-store');

const settings = new Store();

const BKC = {
  cleartip(id, timeoutID) {
    if (timeoutID) {
      timeoutID = clearTimeout(timeoutID);
      id.parentElement?.removeChild(id);
    }
  },
  tip(...Msg) {
    let span = document.getElementsByClassName('vue-notification-group')[0].getElementsByTagName('span')[0];
    let tipchilds = span?.childNodes;
    if (tipchilds?.length >= DevTooltipsMaxTips) {
      let trimLen = tipchilds.length - 1 - DevTooltipsMaxTips;
      for (let i = 0; i < trimLen; i++) {
        let p = span?.firstChild;
        if (p) span.removeChild(p);
      }
    }
    let newtip = document.createElement('div');
    newtip.setAttribute('data-id', tipchilds ? tipchilds.length + 1 : '1');
    newtip.className = 'vue-notification-wrapper vn-fade-move';
    newtip.style = 'transition-timing-function:ease;transition-delay:0s;transition-property:all;';
    newtip.id = `BKC-dev-tip${++devid}`;
    newtip.innerHTML = `<div class="alert-default error" style="white-space:break-spaces;display:flex;align-items:center;padding:.9rem 1.1rem;margin-bottom:.5rem;color:var(--white);cursor:pointer;box-shadow:0 0 .7rem rgba(0,0,0,.25);border-radius:.2rem;background:linear-gradient(262.54deg,#202639 9.46%,#223163 100.16%);margin-left:1rem;border:solid .15rem var(--primary-1);font-family:Exo\\ 2;">
                        <img alt="" style="width:2rem;min-width:2rem;height:2rem;margin-right:.9rem;color:var(--white);fill:currentColor;box-sizing:border-box;" src="data:image/png;base64,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" />
                        <span id="BKC-dev-tip-text" class="text" style="font-size:1rem;font-weight:600;text-align:center;overflow-wrap:anywhere;">${Msg}</span></div>`;
    newtip = span.appendChild(newtip);

    let timeoutID = setTimeout(() => {
      BKC.cleartip(newtip, timeoutID);
    }, DevTooltipsTimeout);

    newtip.addEventListener('click', () => {
      BKC.cleartip(newtip, timeoutID);
    });
  },
};

window.addEventListener('error', (event) => {
  if (/ingame\.js/.test(event.filename)) {
    event.preventDefault();
    console.error(event);
    if (DevToolTips) {
      BKC.tip(event.message);
    }
  }
});

function hexToH(H) {
  let r = 0;
  let g = 0;
  let b = 0;
  if (H.length === 4) {
    r = `0x${H[1]}${H[1]}`;
    g = `0x${H[2]}${H[2]}`;
    b = `0x${H[3]}${H[3]}`;
  } else if (H.length === 7) {
    r = `0x${H[1]}${H[2]}`;
    g = `0x${H[3]}${H[4]}`;
    b = `0x${H[5]}${H[6]}`;
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
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(rr, gg, bb) {
  return '#' + componentToHex(rr) + componentToHex(gg) + componentToHex(bb);
}

function scrollIntoView(t) {
  if (typeof t !== 'object') return;
  if (t.getRangeAt) {
    if (t.rangeCount === 0) return;
    t = t.getRangeAt(0);
  }
  if (t.cloneRange) {
    var r = t.cloneRange();
    r.collapse(true);
    // eslint-disable-next-line no-redeclare
    var t = r.startContainer;
    if (t.nodeType === 1) t = t.childNodes[r.startOffset];
  }
  let o = t;
  while (o && o.nodeType !== 1) o = o.previousSibling;
  t = o || t.parentNode;
  if (t) t.scrollIntoView();
}

function frameFuncsRemove(pos) {
  let index = frameFuncs.indexOf(pos);
  if (index > -1) {
    frameFuncs.splice(index, 1);
  }
}

function permCrosshairToggleFunc() {
  if (permCrosshair) {
    permcrossstyle.innerHTML = 'img#crosshair-static{opacity:1!important;visibility:visible!important;display:block!important;}';
  } else {
    permcrossstyle.innerHTML = '';
  }
}

function playerHighLightFunc() {
  if (ShouldHiglight) {
    let localPlayerClass = scene['children']['0']['parent']['entity']['_entityManager']['mWnwM']['systemManager']['_systems']['0']['_queries']['player']['entities']['0']['_components']['38'].wnWmN;
    let qNum = 2;

    if (!scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems'][qNum]['_queries'].players && !scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems'][++qNum]['_queries'].players) return;
    for (let i = 0; i < scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems'][qNum]['_queries'].players?.entities?.length; i++) {
      let mat = scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems'][qNum]['_queries'].players.entities[i]['_components'][0].value.children[0].children[0].children[1].material;

      if (mat.color.r === 1 && mat.color.g < 1 && mat.color.b < 1) continue;
      let player = scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems'][qNum]['_queries'].players.entities[i]['_components'];
      if (!localPlayerClass.team || localPlayerClass.team !== player['50'].team) {
        if (mat.color !== colorEnemy) {
          mat.map = null;
          mat.color = colorEnemy;
          mat.needsUpdate = true;
        }
      } else if (mat.color !== colorTeam) {
        mat.map = null;
        mat.color = colorTeam;
        mat.needsUpdate = true;
      }
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

function IsScoped(e) {
  if (e.button === 2) scoped = true;
}

function IsNotScoped(e) {
  if (e.button === 2) scoped = false;
}

function settingsSetGit(setting, value) {
  settings.set(setting, value);
  return value;
}

let Sessionids = [];
function JoinLobbyWhenUnlocked() {
  let children = document.querySelector('html body div#app div#view div.background div.container div.content div.servers div.container-games div.list-cont div.list')?.children;
  if (children) {
    for (var i = 0; i < children.length; i++) {
      if (!children[i].classList.contains('available-rooms') && !children[i].classList.contains('no-free')) {
        if (!children[i]?.querySelector('#bkc-JWF-cb') && children[i].getElementsByClassName('right')?.[0]) {
          var x = document.createElement('INPUT');
          x.type = 'checkbox';
          x.className = 'input-checkbox  button';
          x.id = 'bkc-JWF-cb';
          x.title = 'Join Lobby When Available';
          x.style = 'margin-right:0.5rem;margin-left:1rem;--hover-color:var(--primary-2);display:flex;justify-content:center;align-items:center;border:none;position:relative;color:var(--white);font-size:1rem;transition:all .3s ease;font-family:Rowdies;padding:.9em 1.4em;transform:skew(-10deg);font-weight:900;overflow:hidden;text-transform:uppercase;border-radius:.2em;outline:none;text-shadow:0 .1em 0 #000;-webkit-text-stroke:1px var(--black);box-shadow:0 .15rem 0 rgba(0,0,0,.315);cursor:pointer;';
          children[i].getElementsByClassName('right')[0].appendChild(x);
          x.addEventListener('change', function () {
            let thisId = this.parentElement.parentElement.getElementsByClassName('session-id')[0].innerHTML;
            if (this.checked) {
              if (thisId && !Sessionids.includes(thisId)) {
                Sessionids.unshift(thisId);
              }
            } else {
              let index = Sessionids.indexOf(thisId);
              if (index > -1) {
                Sessionids.splice(index, 1);
              }
            }
          });
          continue;
        }
        if (Sessionids.length) {
          let ThisIdd = children[i].getElementsByClassName('session-id')[0]?.innerHTML;
          if (Sessionids.includes(ThisIdd)) {
            children[i].querySelector('#bkc-JWF-cb').checked = true;
            if (!children[i].classList.contains('locked')) {
              children[i].getElementsByClassName('button join')[0].click();
            }
          } else {
            children[i].querySelector('#bkc-JWF-cb').checked = false;
          }
        }
      }
    }
  }
}

async function ShowHideGameModes() {
  let modecards = document.getElementsByClassName('list-cont')[0].getElementsByClassName('map');
  let mci;
  for (var i = 0; i < modecards.length; i++) {
    mci = modecards[i].innerText;
    if (/^PHY_/.test(mci)) {
      if (!GameModesShowPHY) {
        modecards[i].parentElement.parentElement.style.display = 'none';
      } else {
        modecards[i].parentElement.parentElement.style.display = 'flex';
      }
    } else if (/^P_/.test(mci)) {
      if (!GameModesShowP) {
        modecards[i].parentElement.parentElement.style.display = 'none';
      } else {
        modecards[i].parentElement.parentElement.style.display = 'flex';
      }
    } else if (/^TDM_/.test(mci)) {
      if (!GameModesShowTDM) {
        modecards[i].parentElement.parentElement.style.display = 'none';
      } else {
        modecards[i].parentElement.parentElement.style.display = 'flex';
      }
    } else if (/^POINT_/.test(mci)) {
      if (!GameModesShowPOINT) {
        modecards[i].parentElement.parentElement.style.display = 'none';
      } else {
        modecards[i].parentElement.parentElement.style.display = 'flex';
      }
    } else if (/^DM_/.test(mci)) {
      if (!GameModesShowDM) {
        modecards[i].parentElement.parentElement.style.display = 'none';
      } else {
        modecards[i].parentElement.parentElement.style.display = 'flex';
      }
    } else if (/^BW_/.test(mci)) {
      if (!GameModesShowBW) {
        modecards[i].parentElement.parentElement.style.display = 'none';
      } else {
        modecards[i].parentElement.parentElement.style.display = 'flex';
      }
    }
  }

  document.querySelectorAll('div.list-cont div.list div[style*="display: flex;"] div.right div.online').forEach((playerCnt) => {
    let player = Number(playerCnt.innerHTML.split('/')[0]);
    if (!Number.isNaN(player)) {
      if (player >= minPlayers && player < 8 && !playerCnt.parentElement.parentElement.classList.contains('locked')) {
        if (playerCnt.style.color !== 'var(--green-1)') playerCnt.style.color = 'var(--green-1)';
        if (playerCnt?.title !== 'available') playerCnt.title = 'available';
      } else if (player < minPlayers) {
        if (playerCnt.style.color !== 'var(--red-3)') playerCnt.style.color = 'var(--red-3)';
        if (playerCnt?.title !== 'below min players') playerCnt.title = 'below min players';
      } else {
        if (playerCnt.style.color !== 'var(--primary-1)') playerCnt.style.color = 'var(--primary-1)';
        if (playerCnt?.title !== 'below min time, lobby full or game has ended') playerCnt.title = 'below min time, lobby full or game has ended';
      }
    }
  });
}

function GameModesCheckBoxChangeHandler(event) {
  if (event.target.className === 'P-checkbox') {
    GameModesShowP = event.target.checked;
    settings.set('GameModesShowP', GameModesShowP);
  } else if (event.target.className === 'TDM-checkbox') {
    GameModesShowTDM = event.target.checked;
    settings.set('GameModesShowTDM', GameModesShowTDM);
  } else if (event.target.className === 'DM-checkbox') {
    GameModesShowDM = event.target.checked;
    settings.set('GameModesShowDM', GameModesShowDM);
  } else if (event.target.className === 'BW-checkbox') {
    GameModesShowBW = event.target.checked;
    settings.set('GameModesShowBW', GameModesShowBW);
  } else if (event.target.className === 'POINT-checkbox') {
    GameModesShowPOINT = event.target.checked;
    settings.set('GameModesShowPOINT', GameModesShowPOINT);
  } else if (event.target.className === 'PHY-checkbox') {
    GameModesShowPHY = event.target.checked;
    settings.set('GameModesShowPHY', GameModesShowPHY);
  } else if (event.target.id === 'bkc-min-time') {
    minTime = Number(event.target.options[event.target.selectedIndex].value);
    settings.set('minTime', minTime);
  } else if (event.target.id === 'bkc-min-players') {
    minPlayers = Number(event.target.options[event.target.selectedIndex].value);
    settings.set('minPlayers', minPlayers);
  }
  ShowHideGameModes();
}

const gamemodesobserver = new MutationObserver(() => {
  ShowHideGameModes();
  JoinLobbyWhenUnlocked();
});

function SetGameModesCheckBoxes() {
  let list = document.querySelector('#view div.background div.container div.content div.servers div.container-games div.list-cont div.list');
  if (list && !document.querySelector('#bkc-minmax-selects')) {
    let bkcMinSelect = document.createElement('div');
    bkcMinSelect.id = 'bkc-minmax-selects';
    bkcMinSelect.innerHTML = `
    <label title="Minimum Players" id="bkc-min-players-label">Players:</label>
    <select id="bkc-min-players" title="Minimum Players">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    <option selected="selected" value="7">7</option>
  </select>
  <label title="Minimum Time Remaining" id="bkc-min-time-label">Time:</label>
  <select id="bkc-min-time" title="Minimum Time Remaining">
    <option value="1" selected="selected">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    <option value="7">7</option>
    <option value="8">8</option>
  </select>
    `;

    let modesCont = document.createElement('div');
    modesCont.className = 'mods tabmods';
    modesCont.style = `
    display: flex;
    margin: auto;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    `;
    modesCont.innerHTML = `
      <div class="DM">
      <label class="custom-checkbox checkbox-size">
      <input type="checkbox" class="DM-checkbox">
      <span> Solo </span>
      </label>
      </div>
      
      <div class="BW">
      <label class="custom-checkbox checkbox-size">
      <input type="checkbox" class="BW-checkbox">
      <span> Sabotage </span>
      </label>
      </div>

      <div class="TDM">
      <label class="custom-checkbox checkbox-size">
      <input type="checkbox" class="TDM-checkbox">
      <span> Team </span>
      </label>
      </div>
      
      <div class="POINT">
      <label class="custom-checkbox checkbox-size">
      <input type="checkbox" class="POINT-checkbox">
      <span> Point </span>
      </label>
      </div>
      
      <div class="P">
      <label class="custom-checkbox checkbox-size">
      <input type="checkbox" class="P-checkbox">
      <span> Parkour </span>
      </label>
      </div>
      
      <div class="PHY">
      <label class="custom-checkbox checkbox-size">
      <input type="checkbox" class="PHY-checkbox">
      <span> Physics </span>
      </label>
      </div>
      `;
    modesCont = bkcMinSelect.appendChild(modesCont);
    modesCont.getElementsByClassName('DM-checkbox')[0].checked = GameModesShowDM;
    modesCont.getElementsByClassName('BW-checkbox')[0].checked = GameModesShowBW;
    modesCont.getElementsByClassName('TDM-checkbox')[0].checked = GameModesShowTDM;
    modesCont.getElementsByClassName('P-checkbox')[0].checked = GameModesShowP;
    modesCont.getElementsByClassName('POINT-checkbox')[0].checked = GameModesShowPOINT;
    modesCont.getElementsByClassName('PHY-checkbox')[0].checked = GameModesShowPHY;
    bkcMinSelect.addEventListener('input', GameModesCheckBoxChangeHandler);
    gamemodesobserver.observe(list, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
    });
    bkcMinSelect = list.parentElement.insertBefore(bkcMinSelect, list);
    bkcMinSelect.querySelector(`#bkc-min-players option[value="${minPlayers}"]`).selected = true;
    bkcMinSelect.querySelector(`#bkc-min-time option[value="${minTime}"]`).selected = true;
  }
}

if (typeof settings.get('pendingImport') !== 'undefined') {
  let savedStorage = settings.get('pendingImport');
  Object.assign(localStorage, savedStorage);
  settings.delete('pendingImport');
  window.location.reload();
}

let id;
let gigaJSONParse = function () {
  let data = boringJSONParse.apply(this, arguments);
  if (typeof data[0]?.metadata?.serverName !== 'undefined') {
    let currentTime = Date.now();
    for (let key in data) {
      if (data[key]['metadata']['custom'] === false && (data[key].clients < minPlayers || Math.ceil((480 - (currentTime - Date.parse(data[key]['createdAt'])) / 1e3) / 60) < minTime)) {
        data[key].locked = true;
      }
    }
  } else if (data?.adReward && data?.shortId) {
    id = data.shortId;
  }
  return data;
};
let boringJSONParse = window.JSON.parse;
window.JSON.parse = gigaJSONParse;

let stremzInfo;
function gigaInfiRequest() {
  window.XMLHttpRequest = class extends XMLHttpRequest {
    constructor() {
      super();
      this.send = (...sendArgs) => {
        let oldChange = this.onreadystatechange;
        this.onreadystatechange = (...args) => {
          if (this.readyState === 4 && this.status === 200) {
            if (this.responseURL === 'https://api.twitch.tv/helix/streams?first=10&game_id=356609813') {
              stremzInfo = boringJSONParse(this.response);
              initTwitchMenu();
            } else if (new URL(this.responseURL).pathname === '/helix/users') {
              let stremzNew = boringJSONParse(this.response);
              if (initTwitchMenu()) {
                newStremz(stremzNew);
              }
            } else if (this.responseURL === 'https://api.kirka.io/api/notification' && this.response !== '[]') {
              let data = boringJSONParse(this.response);
              let keys = Object.keys(data);
              if (keys.filter((key) => data[key].object?.message === 'You completed a quest').length > 0) {
                if (!claimedQuest) {
                  claimedQuest = true;
                  checkclaimQuest();
                }
              }
            }
          }
          if (oldChange) oldChange.apply(this, ...args);
        };
        super.send(...sendArgs);
      };
    }
  };
  return window.XMLHttpRequest;
}
let boringXMLHttpRequest = window.XMLHttpRequest;
let gigaXMLHttpRequest = gigaInfiRequest();
window.XMLHttpRequest = gigaXMLHttpRequest;

let inputtoggle = false;
let gigaAddEventListener = function (...args) {
  if (this?.id === 'WMNn' && args[0] === 'keyup' && window.location.pathname !== '/servers/main' && window.location.pathname !== '/servers/custom') {
    boringAddEventListener.apply(this, [args[0], args[1], { capture: false, passive: true }]);
    EventTarget.prototype.addEventListener = boringAddEventListener;
    this.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        inputtoggle = !inputtoggle;
        if (!inputtoggle && this.value === '') this.blur();
      }
    });
  } else boringAddEventListener.apply(this, args);
};
let boringAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = gigaAddEventListener;

let DevToolTips = true;
let DevTooltipsTimeout = 10000;
let DevTooltipsMaxTips = 20;
let devid = 0;
let EnemyhighlightColor = typeof settings.get('EnemyhighlightColor') === 'undefined' ? settingsSetGit('EnemyhighlightColor', '#ff00ff') : settings.get('EnemyhighlightColor');
let TeamhighlightColor = typeof settings.get('TeamhighlightColor') === 'undefined' ? settingsSetGit('TeamhighlightColor', '#0000ff') : settings.get('TeamhighlightColor');
let GameModesShowPOINT = typeof settings.get('GameModesShowPOINT') === 'undefined' ? settingsSetGit('GameModesShowPOINT', true) : settings.get('GameModesShowPOINT');
let GameModesShowTDM = typeof settings.get('GameModesShowTDM') === 'undefined' ? settingsSetGit('GameModesShowTDM', true) : settings.get('GameModesShowTDM');
let GameModesShowPHY = typeof settings.get('GameModesShowPHY') === 'undefined' ? settingsSetGit('GameModesShowPHY', true) : settings.get('GameModesShowPHY');
let GameModesShowDM = typeof settings.get('GameModesShowDM') === 'undefined' ? settingsSetGit('GameModesShowDM', true) : settings.get('GameModesShowDM');
let GameModesShowBW = typeof settings.get('GameModesShowBW') === 'undefined' ? settingsSetGit('GameModesShowBW', true) : settings.get('GameModesShowBW');
let GameModesShowP = typeof settings.get('GameModesShowP') === 'undefined' ? settingsSetGit('GameModesShowP', true) : settings.get('GameModesShowP');
let TwitchHeight = typeof settings.get('TwitchHeight') === 'undefined' ? settingsSetGit('TwitchHeight', 'auto') : settings.get('TwitchHeight');
let TwitchWidth = typeof settings.get('TwitchWidth') === 'undefined' ? settingsSetGit('TwitchWidth', 'auto') : settings.get('TwitchWidth');
let TwitchLeft = typeof settings.get('TwitchLeft') === 'undefined' ? settingsSetGit('TwitchLeft', '10vw') : settings.get('TwitchLeft');
let ShowTwitch = typeof settings.get('ShowTwitch') === 'undefined' ? settingsSetGit('ShowTwitch', true) : settings.get('ShowTwitch');
let TwitchTop = typeof settings.get('TwitchTop') === 'undefined' ? settingsSetGit('TwitchTop', '20vw') : settings.get('TwitchTop');
let guiHeight = typeof settings.get('guiHeight') === 'undefined' ? settingsSetGit('guiHeight', '95%') : settings.get('guiHeight');
let guiWidth = typeof settings.get('guiWidth') === 'undefined' ? settingsSetGit('guiWidth', '51%') : settings.get('guiWidth');
let minPlayers = typeof settings.get('minPlayers') === 'undefined' ? 1 : settings.get('minPlayers');
let minTime = typeof settings.get('minTime') === 'undefined' ? 0 : settings.get('minTime');
let capture = typeof settings.get('capture') === 'undefined' ? false : settings.get('capture');
let cssLinks = typeof settings.get('cssLinks') === 'undefined' ? {} : settings.get('cssLinks');
let fpsCap = typeof settings.get('fpsCap') === 'undefined' ? false : settings.get('fpsCap');
let playerHighLight = !!settings.get('playerHighLight');
let permCrosshair = !!settings.get('permCrosshair');
let hideFlagAds = !!settings.get('hideFlagAds');
let customCss = !!settings.get('customCss');
let gui = document.createElement('div');
let customEnemyColorElem;
let customTeamColorElem;
let frameFuncs = [];
let colorEnemy;
let colorTeam;
let scene;
let flagMaterial;
let animate;
let animateState;
let streamsmenu;
let notificationsonclick;
let GuiResizeObserver;
let TwitchResizeObserver;
let permcrossstyle;
let cssSelect;
let clockInterval;
let timeContainer;
let statsUpdated = false;
let claimedQuest = false;
let inGame = false;
let flagmodeset = false;
let scoped = false;
let ShouldHiglight = false;
let menuVisible = false;
let gitclick = false;
let discclick = false;
let SaveGuiSize = () => {
  if (guiWidth !== gui.style.width) {
    guiWidth = settingsSetGit('guiWidth', gui.style.width);
  }
  if (guiHeight !== gui.style.height) {
    guiHeight = settingsSetGit('guiHeight', gui.style.height);
  }
};

if (playerHighLight) {
  frameFuncs.push(playerHighLightFunc);
}

WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {
  apply(target, thisArg, argArray) {
    if (argArray[0] && argArray[0].type === 'Scene') {
      if (argArray[0].children[0].type === 'AmbientLight') {
        scene = argArray[0];
        ShouldHiglight = true;
        setTimeout(() => {
          scene.children.forEach((e) => {
            if (e.type === 'Sprite' && !e.material.depthTest && e.material.map?.image?.width === 149) {
              flagMaterial = e.material;
              flagmodeset = true;
              if (hideFlagAds) {
                if (!frameFuncs.includes(hideFlagAdsFunc)) {
                  frameFuncs.push(hideFlagAdsFunc);
                  window.addEventListener('mousedown', IsScoped);
                  window.addEventListener('mouseup', IsNotScoped);
                }
              }
            }
          });
        }, 1000);
      }
    }
    return Reflect.apply(...arguments);
  },
});

function MoveTwitchMenu(TwitchHead) {
  let lsmpos1 = 0;
  let lsmpos2 = 0;
  let lsmpos3 = 0;
  let lsmpos4 = 0;
  let p = TwitchHead.getElementsByClassName('head')[0];
  if (p) p.onmousedown = TwitchDrag;

  function TwitchDrag(peepoHappy) {
    peepoHappy = peepoHappy || window.event;
    peepoHappy.preventDefault();
    lsmpos3 = peepoHappy.clientX;
    lsmpos4 = peepoHappy.clientY;
    document.onmouseup = TwitchStopDragPlz;
    document.onmousemove = TwitchDragging;
  }

  function TwitchDragging(xip) {
    xip = xip || window.event;
    xip.preventDefault();
    lsmpos1 = lsmpos3 - xip.clientX;
    lsmpos2 = lsmpos4 - xip.clientY;
    lsmpos3 = xip.clientX;
    lsmpos4 = xip.clientY;
    TwitchHead.style.top = `${TwitchHead.offsetTop - lsmpos2}px`;
    TwitchHead.style.left = `${TwitchHead.offsetLeft - lsmpos1}px`;
  }

  function TwitchStopDragPlz() {
    document.onmouseup = null;
    document.onmousemove = null;
    TwitchTop = settingsSetGit('TwitchTop', TwitchHead.style.top);
    TwitchLeft = settingsSetGit('TwitchLeft', TwitchHead.style.left);
  }
}

function SaveTwitchSize() {
  if (TwitchWidth !== streamsmenu.style.width) {
    TwitchWidth = settingsSetGit('TwitchWidth', streamsmenu.style.width);
    streamsmenu.style.setProperty('--bkc-stremz-menu-width', streamsmenu.style.width);
  }
  if (TwitchHeight !== streamsmenu.style.height) {
    TwitchHeight = settingsSetGit('TwitchHeight', streamsmenu.style.height);
  }
}

TwitchResizeObserver = new ResizeObserver(SaveTwitchSize);

function newStremz(data) {
  let twitchinfo = getTwitchInfo(data['data'][0].id);
  if (twitchinfo && !streamsmenu.querySelector(`img[src="${data['data'][0].profile_image_url}"]`)) {
    let item = document.createElement('div');
    let viewers = `${twitchinfo.viewer_count} ${twitchinfo.viewer_count === 1 ? 'viewer' : 'viewers'}`;
    item.className = 'item';
    item.title = `
Click to watch ${data['data'][0].display_name} stream kirka.io on twitch
Title:  ${twitchinfo.title}
Started at:  ${new Date(twitchinfo.started_at).toLocaleString()}
Streaming to:  ${viewers}
Tags:  ${twitchinfo.tags.toString()}
Language:  ${twitchinfo.language}
      𝙍𝙞𝙜𝙝𝙩 𝙘𝙡𝙞𝙘𝙠 𝙩𝙤 𝙘𝙤𝙥𝙮 𝙡𝙞𝙣𝙠 𝙩𝙤 𝙘𝙡𝙞𝙥𝙗𝙤𝙖𝙧𝙙 ⠀⠀
    `;
    item.innerHTML = `
<img src="${data['data'][0].profile_image_url}" alt="avatar" class="avatar" style="height: 2.188rem;width: 2.188rem;margin-top: .3rem;border-radius: 20px;border: 2px solid #7235cb;"/>
<div class="content" style="display: flex;flex-direction: column;align-items: flex-start;margin-left: .7rem;text-shadow: 0 2px 0 rgba(0,0,0,.5);">
<div id="bkc-twitch-name" style="display: flex;flex-direction: row;flex-wrap: nowrap;align-content: center;justify-content: center;align-items: center;">  
<div style="font-weight: 700;" class="name">${data['data'][0].display_name}</div>${data['data'][0].broadcaster_type === 'partner' ? '<svg width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px" style="fill: rgb(191,148,255);"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 3.5L8 2L3.5 3.5L2 8L3.5 12.5L8 14L12.5 12.5L14 8L12.5 3.5ZM7.00008 11L11.5 6.5L10 5L7.00008 8L5.5 6.5L4 8L7.00008 11Z"></path></svg>' : ''}
</div>
<div class="count">${twitchinfo.title}</div>
<div class="count">${viewers} • ${twitchinfo.time}</div>
</div>
`;
    item.onmouseup = (e) => {
      if (e.button === 0) shell.openExternal(`https://www.twitch.tv/${data['data'][0].display_name}`);
      else if (e.button === 2) {
        clipboard.writeText(`https://www.twitch.tv/${data['data'][0].display_name}`);
        BKC.tip('Link Copied');
      }
    };
    streamsmenu.querySelector('div.list').appendChild(item);
  }
}

function getTwitchInfo(userid) {
  for (let i = 0; i < stremzInfo?.data?.length; i++) {
    if (stremzInfo.data[i].user_id === userid) {
      if (!stremzInfo.data[i].time) {
        let time = Date.now() - Date.parse(stremzInfo.data[i]['started_at']);
        let s = Math.round((time + Number.EPSILON) / 1e3);
        let m = Math.round((time + Number.EPSILON) / 6e4);
        let h = Number((time / 36e5).toFixed(1));
        let d = Number((time / 864e5).toFixed(1));
        if (s < 60) {
          stremzInfo.data[i].time = `live for ${s} ${s === 1 ? 'sec' : 'secs'}`;
        } else if (m < 60) {
          stremzInfo.data[i].time = `live for ${m} ${m === 1 ? 'min' : 'mins'}`;
        } else if (h < 24) {
          stremzInfo.data[i].time = `live for ${h} ${h === 1 ? 'hr' : 'hrs'}`;
        } else {
          stremzInfo.data[i].time = `live for ${d} ${d === 1 ? 'day' : 'days'}`;
        }
      }
      return stremzInfo.data[i];
    }
  }
}

function initTwitchMenu() {
  let interface = document.querySelector('.interface.text-2');
  if (interface) {
    if (!document.querySelector('#live-streams-menu')) {
      streamsmenu = document.createElement('div');
      streamsmenu.style = `z-index:998!important;min-width: 15.5rem;min-height: 4rem;position:absolute;resize:both;overflow: auto hidden!important;opacity:1!important;pointer-events:all!important;
      top:${TwitchTop};left:${TwitchLeft};--bkc-stremz-menu-width:${TwitchWidth};width:${TwitchWidth};height:${TwitchHeight};${ShowTwitch ? 'display:block!important;' : 'display:none!important;'}`;
      streamsmenu.id = 'live-streams-menu';
      streamsmenu.innerHTML = `
      <div class="head" style="display: flex; align-items: center; font-size: 1.5rem; font-weight: 700; text-shadow: 0 3px 1px rgba(0, 0, 0, 0.5); border-bottom: 2px solid #191919; padding: 10px 10px 10px 1rem; background: var(--secondary-2)">
      LIVE STREAMS<svg style="fill: currentColor; height: 2.375rem; width: 2.063rem; margin-left: 1.125rem" xmlns="http://www.w3.org/2000/svg" class="icon-twitch svg-icon svg-icon--twitch">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons.6e41b8dd.svg#twitch"></use>
      </svg>
      </div>
      <div class="list"></div>
      <div class="item">Stream kirka on twitch to show up here</div>
      `;
      streamsmenu = interface.appendChild(streamsmenu);
      let kirkaItem = streamsmenu.querySelector('.item');
      kirkaItem.onmouseup = (e) => {
        if (e.button === 0) shell.openExternal('https://www.twitch.tv/directory/game/Kirka.io');
        else if (e.button === 2) {
          clipboard.writeText(`https://www.twitch.tv/directory/game/Kirka.io`);
          BKC.tip('Link Copied');
        }
      };
      kirkaItem.title = `Click to visit kirka.io on twitch
      𝙍𝙞𝙜𝙝𝙩 𝙘𝙡𝙞𝙘𝙠 𝙩𝙤 𝙘𝙤𝙥𝙮 𝙡𝙞𝙣𝙠 𝙩𝙤 𝙘𝙡𝙞𝙥𝙗𝙤𝙖𝙧𝙙 ⠀⠀
`;
      TwitchResizeObserver.observe(streamsmenu);
      MoveTwitchMenu(streamsmenu);
    }
    return streamsmenu;
  }
}

function toTitleCase(str) {
  let rts = '';
  let p = str.replace(/_/g, ' ').split(' ');
  for (let i = 0; i < p.length; i++) {
    rts += `${p[i].charAt(0).toUpperCase()}${p[i].substr(1).toLowerCase()} `;
  }
  return rts.trim();
}

async function CheckQuest(_index) {
  if (localStorage.token === '') return;
  let requests = [];
  let failed = [];
  let types = _index || ['hourly', 'daily', 'event'];
  types.forEach((type) => {
    requests.push(
      fetch('https://api.kirka.io/api/quests', {
        headers: {
          accept: 'application/json, text/plain, */*',
          authorization: 'Bearer ' + localStorage.token,
          'content-type': 'application/json;charset=UTF-8',
          csrf: 'token',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
        referrer: 'https://kirka.io/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `{"type": "${type}"}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      })
    );
  });
  let allQuests = await Promise.allSettled(requests);
  allQuests.forEach(async (result, index) => {
    if (result.status === 'rejected' || result.value.status >= 400) failed.push(types[index]);
    else {
      let quests = await result.value.json();
      for (let quest of quests) {
        if (quest.progress.completed && !quest.progress.rewardTaken) {
          let request = await fetch('https://api.kirka.io/api/rewards/take', {
            headers: {
              accept: 'application/json, text/plain, */*',
              authorization: 'Bearer ' + localStorage.token,
              'content-type': 'application/json;charset=UTF-8',
              csrf: 'token',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-site',
            },
            referrer: 'https://kirka.io/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: JSON.stringify({ source: 'quest:' + quest.id }),
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
          });
          if (request.ok) {
            BKC.tip(`${toTitleCase(quest.type)} Quest Completed:
${quest.amount} ${toTitleCase(quest.name)} ${quest.weapon !== 'undefined' ? quest.weapon : ''}
XP:  ${quest['rewards'][0].amount}   COINS:  ${quest['rewards'][1].amount}`);
          } else {
            if (!failed.includes(types[index])) failed.push(types[index]);
            BKC.tip(`Failed Claiming ${toTitleCase(quest.type)}
Quest: ${toTitleCase(quest.name)}
Trying Again In 15 Seconds`);
          }
        }
      }
    }
  });
  if (failed.length) return [...failed];
}

function checkclaimQuest(type) {
  if (!inGame) {
    CheckQuest(type)
      .then((result) => {
        if (Array.isArray(result)) {
          setTimeout(() => {
            checkclaimQuest(result);
          }, 15000);
        }
      })
      .catch((error) => BKC.tip(error));
  }
}

function clock() {
  if (!clockInterval) {
    clockInterval = setInterval(() => {
      let titTok = document.querySelector('#free-clock');
      if (titTok) titTok.innerHTML = new Date().toLocaleTimeString();
    }, 1000);
  }
}

async function getStats() {
  if (!id) {
    id = document.querySelector('.username')?.innerHTML.slice(1);
  }
  let statsContainer = document.querySelector('#bkc-daily-stats-container');
  if (!id || !statsContainer) return 'NAAHHHH AINTNOWAY';

  let stats = await fetch('https://api.kirka.io/api/user/getProfile', {
    headers: {
      accept: 'application/json, text/plain, */*',
      authorization: 'Bearer ' + localStorage.token,
      'cache-control': 'no-cache',
      'content-type': 'application/json;charset=UTF-8',
      csrf: 'token',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    referrer: 'https://kirka.io/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: `{"id":"${id}","isShortId":true}`,
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });

  if (!stats.ok) return false;
  stats = await stats.json();
  let dailyStats = typeof settings.get('dailyStats') === 'undefined' ? {} : settings.get('dailyStats');
  let date = new Date().toLocaleString('en-US', { timeZone: 'America/Denver', day: 'numeric', month: 'numeric', year: 'numeric' });

  if (!dailyStats[id] || date !== dailyStats[id].date) {
    dailyStats[id] = {
      games: stats.stats.games,
      wins: stats.stats.wins,
      kills: stats.stats.kills,
      deaths: stats.stats.deaths,
      headshots: stats.stats.headshots,
      scores: stats.stats.scores,
      totalXp: stats.totalXp,
      coins: stats.coins,
      diamonds: stats.diamonds,
      kd: 0,
      date,
    };
    settings.set('dailyStats', dailyStats);
  }
  stats.stats.kd = Math.round(((stats['stats']['kills'] - dailyStats[id]['kills']) / (stats['stats']['deaths'] - dailyStats[id]['deaths']) + Number.EPSILON) * 100) / 100;
  if (Number.isNaN(stats.stats.kd)) stats.stats.kd = 0;
  for (const key in dailyStats[id]) {
    if (key !== 'date') {
      let statElem = gui?.querySelector(`#bkc-${key}`);
      if (!statElem) {
        let newStat = document.createElement('div');
        newStat.className = 'module';
        newStat.innerHTML = `<label id="bkc-${key}-stat">${toTitleCase(key)}: </label><span id="bkc-${key}">${(stats[key] || stats['stats'][key]) - dailyStats[id][key]}</span>`;
        statsContainer.appendChild(newStat);
      } else {
        statElem.innerHTML = (stats[key] || stats['stats'][key]) - dailyStats[id][key];
      }
    }
  }
  return 'W';
}

function fetchStats(fCount) {
  if (!inGame) {
    getStats()
      .then((result) => {
        if (result !== 'W') {
          let retryDelay = result === 'NAAHHHH AINTNOWAY' ? 1000 : ++fCount > 2 ? 15000 : 5000;
          setTimeout(() => fetchStats(fCount), retryDelay);
          BKC.tip(`Failed Fetching Stats Trying Again In ${retryDelay} Seconds`);
        }
      })
      .catch((error) => BKC.tip(error));
  }
}

const Questobserver = new MutationObserver(() => {
  let remElement;
  let notis = document.querySelectorAll('html body div#app div#notifications span div.vue-notification-wrapper div span.text');
  for (let i = 0; i < notis.length; i++) {
    remElement = notis[i].parentElement.parentElement;
    if (notis[i]?.innerHTML === 'You completed a quest' && remElement.style.display !== 'none') {
      remElement.setAttribute('style', 'display: none!important');
    } else if (/Failed to connect to the room/i.test(notis[i]?.innerHTML) && !window.location.href.startsWith('https://kirka.io/servers/') && remElement.style.display !== 'none') {
      remElement.setAttribute('style', 'display: none!important');
      document.querySelector('.icon-btn.text-1.SERVERS').click();
    }
  }
});

function NotificationsOpenMenus() {
  let n;
  let p = document.querySelector('#notifications');
  if (p) {
    n = p.onclick = (e) => {
      let text = (e.target?.innerHTML || e.target.parentElement.nextSibling.innerHTML).toLowerCase();
      if (text) {
        if (/friend.*request/g.test(text) && window.location.href !== 'https://kirka.io/friends') {
          document.querySelector('.icon-btn.text-1.FRIENDS').click();
        } else if (/item.*sold/g.test(text) && window.location.href !== 'https://kirka.io/inventory') {
          document.querySelector('.icon-btn.text-1.INVENTORY').click();
        } else if (/hourly Quest Claimed/gi.test(text) && window.location.href !== 'https://kirka.io/quests/hourly') {
          document.querySelector('.icon-btn.text-1.QUESTS').click();
        }
      }
    };
    Questobserver.observe(p, {
      childList: true,
      attributes: true,
      subtree: true,
    });
  }
  return !!n;
}

function moveTime() {
  // moves ingame time to tab button menu thing
  if (!timeContainer) {
    timeContainer = document.querySelector('#app > div.game-interface > div.desktop-game-interface > div.state-cont > div.left');
    let tabInfo = document.querySelectorAll('#app > div.game-interface > div.desktop-game-interface > div.tab-info > div.head.text-2,#app > div.game-interface > div.desktop-game-interface > div.tab-parkour-info > div.head.text-2')[0];
    let serverThing = tabInfo?.querySelectorAll('div.server-id,div.label.blue')[0];
    if (serverThing && timeContainer) {
      timeContainer = tabInfo.insertBefore(timeContainer, serverThing);
    }
  }
  return timeContainer;
}

const SomeObserver = new MutationObserver(() => {
  if (inGame) {
    if (moveTime()) SomeObserver.disconnect();
    return;
  }

  if (/kirka[.]io[/]servers/.test(window.location.href) && !document.querySelector('#view > div > div > div.content > div.servers > div > div.list-cont > div#bkc-minmax-selects > div.mods.tabmods')) {
    SetGameModesCheckBoxes();
  }

  if (!notificationsonclick) {
    notificationsonclick = NotificationsOpenMenus();
  }

  if (!document.querySelector('#clientJoinButton') && document.querySelector('.play-content')) {
    let btn = document.createElement('button');
    btn.id = 'clientJoinButton';
    btn.style = 'background-color: var(--primary-1);--hover-color: var(--primary-2);--top: var(--primary-2);--bottom: var(--primary-3);display: flex;justify-content: center;align-items: center;border: none;position: absolute;color: var(--white);font-size: 1rem;transition: all .3s ease;font-family: Rowdies;padding: .9em 1.4em;transform: skew(-10deg);font-weight: 900;overflow: hidden;text-transform: uppercase;border-radius: .2em;outline: none;text-shadow: 0 0.1em 0 #000;-webkit-text-stroke: 1px var(--black);box-shadow: 0 0.15rem 0 rgba(0,0,0,.315);cursor: pointer;box-shadow: 0 5.47651px 0 rgba(0,0,0,.5);text-shadow: -1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 1px 1px rgba(0,0,0,.486);width: 150px;height: 50px;bottom: 20px;right: 100%;margin-right: 10px;font-size: 20px;';
    btn.innerText = 'Join Link';
    btn.onclick = () => {
      window.open(clipboard.readText());
    };
    document.getElementsByClassName('play-content')[0].append(btn);
  }

  if (!discclick) {
    let discButton = document.querySelector('.soc-icon.svg-icon.svg-icon--discord');
    if (discButton) {
      discButton.parentElement.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          shell.openExternal('https://discord.com/invite/cNwzjsFHpg');
        },
        {
          capture: true,
          useCapture: true,
          passive: false,
        }
      );
      discclick = !!discclick;
    }
  }

  if (!gitclick) {
    let gitButton = document.querySelector('.soc-icon.svg-icon.svg-icon--gamepad2');
    if (gitButton) {
      gitButton.parentElement.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          shell.openExternal('https://github.com/42infi/better-kirka-client/releases');
        },
        {
          capture: true,
          useCapture: true,
          passive: false,
        }
      );
      gitclick = !!gitclick;
    }
  }

  if (!statsUpdated && (id || document.querySelector('.username')?.innerHTML)) {
    statsUpdated = true;
    fetchStats(0);
  }

  let freeClockElem = document.querySelector('#ad-bottom');
  if (freeClockElem) {
    freeClockElem.id = 'free-clock';
    freeClockElem.innerHTML = new Date().toLocaleTimeString();
    freeClockElem.className = 'free-clock';
    freeClockElem.style = 'position:absolute;overflow:hidden;text-align:center;top:0.25rem;';
    clock();
  }

  if (!document.querySelector('#bkc-back-forward-button')) {
    let homeButton = document.querySelector('#view > div > div > div.top-bar > div.left > div.home');
    if (homeButton) {
      let backForwardButton = document.createElement('div');
      let backbutton = document.createElement('a');
      let forwardbutton = document.createElement('a');
      backForwardButton.id = 'bkc-back-forward-button';
      backbutton.id = 'bkc-menu-back-button';
      forwardbutton.id = 'bkc-menu-forward-button';
      backbutton.title = 'Back';
      forwardbutton.title = 'Forward';
      backbutton.innerHTML = `
      <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
      <path d="m 12,12 h 2 v 12 h -2 z m 3.5,6 8.5,6 V 12 z" style="fill:#fff"></path>
      </svg>
      `;
      forwardbutton.innerHTML = `
      <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
      <path d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" style="fill:#fff"></path>
      </svg>
      `;
      backbutton.onclick = () => window.history.back();
      forwardbutton.onclick = () => window.history.forward();
      backbutton = backForwardButton.appendChild(backbutton);
      forwardbutton = backForwardButton.appendChild(forwardbutton);
      backForwardButton = homeButton.parentElement.insertBefore(backForwardButton, homeButton);
    }
  }
});

SomeObserver.observe(document, { childList: true, subtree: true });

const MainObserverr = new MutationObserver(() => {
  let endmodal = document.querySelector('.end-modal');
  if (!inGame && /kirka[.]io[/]game/.test(window.location.href) && !endmodal) {
    inGame = true;
    window.JSON.parse = boringJSONParse;
    window.XMLHttpRequest = boringXMLHttpRequest;
    if (!animate && frameFuncs.length) animateState('true');
    if (TwitchResizeObserver) TwitchResizeObserver.disconnect();
    if (clockInterval) clockInterval = clearInterval(clockInterval);
    document.removeEventListener('keyup', keyup);
    if (timeContainer) SomeObserver.disconnect();
  } else if (inGame && (endmodal || !/kirka[.]io[/]game/.test(window.location.href))) {
    ShouldHiglight = false;
    inGame = false;
    window.XMLHttpRequest = gigaXMLHttpRequest;
    window.JSON.parse = gigaJSONParse;
    EventTarget.prototype.addEventListener = gigaAddEventListener;
    inputtoggle = false;
    if (animate) animateState();
    gitclick = false;
    discclick = false;
    if (flagmodeset) {
      flagmodeset = false;
      frameFuncsRemove(hideFlagAdsFunc);
      window.removeEventListener('mousedown', IsScoped);
      window.removeEventListener('mouseup', IsNotScoped);
    }
    SomeObserver.observe(document, { childList: true, subtree: true });
    claimedQuest = false;
    statsUpdated = false;
    Sessionids = [];
    document.addEventListener('keyup', keyup);
    timeContainer = null;
  }
});

window.addEventListener('load', () => {
  let app = document.querySelector('html body div#app');
  if (app) {
    MainObserverr.observe(app, {
      childList: true,
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
    });
  }
});

// new adblock
Object.defineProperty(window, 'aiptag', {
  set(_v) {},
  get() {},
});

document.addEventListener('DOMContentLoaded', () => {
  applyCss();
  gui.id = 'gui';
  let guistyles = `
  #gui {
    border: none;
    background-color: rgba(24, 25, 28, 0.95);
    box-shadow: 0 0 8px 2px #000;
    position: absolute;
    left: 5%;
    top: 2.5%;
    z-index: 300;
    color: #fff;
    font-family: 'Titillium Web', serif;
    line-height: 1.6;
    border-radius: 3px;
    max-height: 95%;
    max-width: 90%;
    min-width: 25.2%;
    min-height: 45%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    place-content: stretch space-between;
    align-items: flex-start;
    resize: both;
    overflow: auto;
    margin: auto;
    --bkc-new-back-hover: rgb(133, 133, 133);
    --bkc-show-delete-back-hover: rgb(133, 133, 133);
    --bkc-delete-back-hover: rgba(19, 19, 19, 0.5);
    --bkc-new-border-hover: 0.2rem 0 0 0.2rem;
    --bkc-show-delete-border-hover: 0 0.2rem 0.2rem 0;
}
.heading {
    min-height: 2.3rem;
    max-height: 3.3rem;
    justify-content: center;
    align-items: center;
    margin: 0px 0px 0px 0;
    font-size: 24px;
    border-bottom: 2px solid #8c8c8c;
    min-width: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    padding: 0.1rem 0;
}
.footer,
.heading {
    background-color: #18191c;
    font-family: 'Titillium Web', serif;
    font-weight: 700;
    text-align: center;
    pointer-events: none;
}
.module-wrapper {
    display: flex;
    flex-wrap: wrap;
    max-height: 90%;
    align-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding: 0 0.5rem;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
}
.module {
    overflow-wrap: anywhere;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    place-content: center;
    padding-left: 0.5rem;
    border-radius: 0.3rem;
    margin: 0.5rem 0;
}

.footer {
    min-height: 2.3rem;
    max-height: 3.3rem;
    justify-content: center;
    align-items: center;
    margin: 0;
    min-width: 100%;
    overflow: hidden;
    display: flex;
    padding: 0.1rem 0;
    font-size: 11px;
    border-top: 2px solid #8c8c8c;
    line-height: 1.6rem;
}

input:disabled {
    background: #fff;
    border: 1px solid #000;
    width: 50px;
}
.module:hover,
div#custom-css-wrapper:hover {
    background-color: rgb(0, 0, 0, 0.1);
}
div.tabs > div.mods.tabmods > div > label.custom-checkbox > input {
    position: absolute;
    z-index: -1;
    opacity: 0;
}
div.tabs > div.mods.tabmods > div > label.custom-checkbox > span {
    display: inline-flex;
    align-items: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
div.tabs > div.mods.tabmods > div > label.custom-checkbox > input:checked + span:before {
    background-color: #ffb914;
    border-color: #b6830e;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='hsl(42, 85%, 100%)' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
}
div.tabs > div.mods.tabmods > div > label.custom-checkbox > span:before {
    content: "";
    display: inline-block;
    width: 1.3em;
    height: 1.3em;
    flex-shrink: 0;
    flex-grow: 0;
    border: 0.15rem solid #3c4b68;
    border-radius: 0.25em;
    margin-right: 0.5em;
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 50% 50%;
    background-color: #2f3957;
}
div#live-streams-menu > div.list {
    max-height: 95vh !important;
    overflow: hidden hidden !important;
    padding: .5rem;
    font-size: 1.3rem;
}
input.gui-color-input {
    -webkit-appearance: none !important;
    border: none !important;
    width: 3vw !important;
    height: 3vh !important;
    padding: 0 !important;
    background-color: #00000000 !important;
    cursor: pointer !important;
    --b-radius: 0.4rem;
    border-radius: 0.4rem !important;
}
input.gui-color-input::-webkit-color-swatch-wrapper {
    padding: 0 !important;
    border-radius: calc(var(--b-radius) - 0.1rem) !important;
}
input.gui-color-input::-webkit-color-swatch {
    border: none !important;
    border-radius: calc(var(--b-radius) - 0.2rem) !important;
    box-shadow: rgba(0, 0, 0, 0.5) 2px 1px 6px !important;
}
div.module-wrapper div.module input[type='checkbox'] {
    margin: auto;
}
div.module label {
    margin: 0 0.5rem;
    height: 100%;
}
html > body > div#app > div#view {
    user-select: text !important;
}
.loading-scene,
#qc-cmp2-container,
#cmpPersistentLink {
    display: none !important;
}
button#bkc-save:hover, button#bkc-browse:hover {
    background-color: var(--bkc-new-back-hover) !important;
}
button#bkc-delete:hover {
    background-color: var(--bkc-delete-back-hover) !important;
}
button#bkc-new:hover {
    background-color: var(--bkc-new-back-hover) !important;
    border-radius: var(--bkc-new-border-hover) !important;
}
button#bkc-show-delete:hover {
    background-color: var(--bkc-show-delete-back-hover) !important;
    border-radius: var(--bkc-show-delete-border-hover) !important;
}
.module.high {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    place-content: center space-between;
    align-items: center;
    margin-left: 1rem !important;
}
.bkc-drop {
    box-shadow: 0 0 1px 2px rgba(255,255,255,0.8),0 0 8px 100vw rgba(0,0,0,0.4)!important;
    outline: #8c8c8c dashed .2rem!important;
}
@media screen and (min-width: 0px) {
    #live-streams-menu {
      margin:0 0 0 0!important;
  }
  .live-streams {
    display:none!important;
  }
}
#gui *:focus {
    outline-color: #8c8c8c;
}
button#bkc-new:focus, button#bkc-show-delete:focus {
    border: 1px solid rgb(118,118,118);
    z-index: 1;
}

div#bkc-daily-stats-wrapper {
  overflow-wrap: unset;
  flex-direction: column;
  flex-wrap: nowrap;
  place-content: center center;
  padding-left: 0rem;
  margin: 0.5rem 0;
  background-color: rgba(0,0,0,0.3);
  border: 1px solid rgb(133, 133, 133);
  box-shadow: rgba(0, 0, 0, 0.5) 2px 1px 6px !important;
  border-radius: 0.3rem;
  pointer-events: none;
}
div#bkc-daily-stats-header {
  margin: auto;
}
div#bkc-daily-stats-wrapper > div.module {
  place-content: center space-around;
  flex-wrap: wrap;
  padding: 0;
  flex-direction: row;
  word-break: keep-all;
  overflow-wrap: unset;
  min-width: 17rem;
  max-width: 21.5rem;
  border-top: 2px solid #8c8c8c;
  border-radius: 0;
  margin: 0;
  display: flex;
}
div#bkc-daily-stats-container > div.module {
  border-radius: 0rem;
  padding: 0;
  min-width: 8rem;
  margin: 0.1rem;
  word-break: keep-all;
  overflow-wrap: unset;
}
div#bkc-daily-stats-container > div.module > label {
  margin-left: 0;
}
div#bkc-minmax-selects {
  display: flex;
  height: 2.3rem;
  width: 100%;
  background-color: var(--secondary-2);
  border-top: 1px solid var(--secondary-1);
  color: var(--white);
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
}

#bkc-min-players-label, #bkc-min-time-label {
  margin: 0.5rem;
}

.mods.tabmods {
  display: flex;
  margin: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
}

.mods.tabmods div label.custom-checkbox.checkbox-size {
  display: flex;
  color: var(--white);
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: space-evenly;
  align-items: center;
}

.mods.tabmods div label.custom-checkbox.checkbox-size span {
  margin-right: 0;
  margin-left: .2rem;
}

.mods.tabmods div label, .mods.tabmods div label input {
  cursor: pointer;
}

.home {
  border-top-left-radius: 0rem!important;
}

#bkc-back-forward-button,#bkc-menu-back-button {
  border-top-left-radius: .313rem;
}

div#bkc-back-forward-button {
  display: flex;
  justify-content: flex-start;
  width: max-content;
  background-color: var(--secondary-4);
}

#bkc-menu-forward-button, #bkc-menu-back-button {
  cursor: pointer;
  width: 2.563rem;
  height: 2.188rem;
  transition: background-color .3s ease;
  border-right: .125rem solid #2f3957;
}

#bkc-menu-forward-button:hover, #bkc-menu-back-button:hover {
  background-color: var(--secondary-5);
}

div#live-streams-menu>div.list>div.item {
  display: flex;
  margin-top: .4rem;
  cursor: pointer;
  border-radius: 10px;
  padding-left: 10px;
  padding-bottom: .3rem;
  text-overflow: ellipsis;
  overflow: hidden;
}
div#live-streams-menu>div.list>div.item:first-child {
margin-top: 0.3rem;
}
div#live-streams-menu>div.list>div.item>div.content>div.count {
text-overflow: ellipsis!important;
white-space: nowrap;
overflow: hidden;
max-width:calc(var(--bkc-stremz-menu-width) - 80px)!important;
}
`;

  gui.innerHTML = `
  <style id="BKC-permcrosshair"></style>
  <style id="BKC-Styles">
          @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap');
          ${guistyles}
  </style>
  
  <div id="infi" class="heading">Client Settings</div>
  <div class="module-wrapper">
          <div id="bkc-css-container" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-content: center; justify-content: flex-start; align-items: stretch; margin-right: 0.5rem; margin: 0.5rem 0">
                  <div id="custom-css-wrapper" style="display: flex; flex-direction: row; flex-wrap: nowrap; align-content: center; justify-content: flex-start; align-items: center; padding: 0 0.5rem; border-radius: 0.3rem">
                          <input type="checkbox" id="customCSS" name="customCSS" />
                          <label id="custom-css-header" style="margin: 0 0 0 0.5rem; white-space: nowrap">Custom Css:</label>
                          <div id="bkc-custom-css-header-button-wrapper" style="display: flex; flex-direction: row; flex-wrap: nowrap; align-content: center; justify-content: flex-start; align-items: center; margin: auto 0; height: 1.786rem; width: max-content; border-width: 1px; border-style: solid; border-color: rgb(133, 133, 133); box-shadow: rgba(0, 0, 0, 0.5) 2px 1px 7px !important; border-radius: 0.3rem">
                                  <button id="bkc-new" title="Add New" style="width: 2rem; display: inline-flex; flex-direction: row; flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center; line-height: unset; text-transform: none; text-indent: 0px; text-align: start; cursor: pointer; border-width: 0 1px 0 0; border-color: #00000000; font-weight: 100; border-radius: 0px; color: #fff; background-color: inherit">＋</button>
                                  <button id="bkc-show-delete" title="Delete" style="display: inline-flex; flex-direction: row; flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center; line-height: unset; text-indent: 0px; text-shadow: none; text-align: start; background-color: inherit; cursor: pointer; border-width: 0 0 0 1px; font-weight: 100; font-size: unset; color: #fff; width: 2rem">&#128465;</button>
                          </div>
                  </div>
                  <button id="bkc-delete" title="Delete" style="display: none; flex-flow: row nowrap; place-content: center; align-items: center; line-height: unset; background-color: inherit; cursor: pointer; font-weight: bolder; color: currentcolor; margin: 1.5rem 0.5rem 0.5rem; height: 1.5rem; border-radius: 0.3rem; border-width: 1px; border-style: solid; white-space: nowrap; box-shadow: rgba(0, 0, 0, 0.5) 2px 1px 6px !important"><span>Delete Selected Css &#013; &#128465;</span></button>
          </div>
  
          <div id="add-new-css-menu" style="display: none; margin: 0.5rem; flex-flow: column nowrap; place-content: flex-start; align-items: flex-start; border-radius: 0.3rem; padding: 1rem; box-shadow: rgba(0, 0, 0, 0.5) 2px 1px 6px !important; background-color: inherit; border: 1px solid rgb(133, 133, 133)">
                  <div class="required-warning" style="display: none; flex-flow: row nowrap; place-content: center center; align-items: center; color: red; padding-bottom: 1rem; width: 100%; font-weight: bolder">
                          <span id="required-warning-span">Name & Url required</span>
                  </div>
                  <div class="thing" style="width: 100%;display: flex;flex-wrap: nowrap;">
                          <label style="margin-right: 0.5rem;">Name:</label>
                          <input type="text" id="css-new-title-input" style="width: 100%; background-color: inherit; border: 1px solid rgb(133, 133, 133); border-radius: 0.3rem; color: #fff" />
                  </div>
                  <div class="thing" style="width: 100%;display: flex;flex-wrap: nowrap;margin-top: 0.5rem;">
                          <label style="margin: 0 0.5rem 0 0">Url:</label>
                          <input type="text" id="css-new-url-input" style="width: 100%; background-color: inherit; border: 1px solid rgb(133, 133, 133); border-radius: 0.3rem; color: #fff" />
                  </div>
  
                  <div class="thing" style="width: 100%;margin-top: 0.5rem;display: flex;flex-direction: row;flex-wrap: nowrap;align-content: center;justify-content: flex-start;align-items: center;">
                          <button id="bkc-browse" style="cursor: pointer;filter: grayscale(1);line-height: unset;padding-top: 0;box-shadow: rgba(0, 0, 0, 0.5) 2px 1px 6px !important;background-color: inherit;border: 1px solid rgb(133, 133, 133);border-radius: 0.3rem;color: #fff;" title="Choose File Or Drag And Drop Css File Onto Menu">browse 📁⼁ drag & drop</button>        
                          <button id="bkc-save" style="cursor: pointer;margin-left: 0.5rem;line-height: unset;padding-top: 0;box-shadow: rgba(0, 0, 0, 0.5) 2px 1px 6px !important;background-color: inherit;border: 1px solid rgb(133, 133, 133);border-radius: 0.3rem;color: #fff;">save</button>
                          <input type="file" accept="text/css" id="bkc-file-picker" style="display:none"></input>
                  </div>
          </div>
  
          <div class="module">
                  <input type="checkbox" id="highlight" name="highlight" />
                  <label for="highlight">Highlight Players</label>
          </div>
  
          <div class="module high">
                  <label for="customColor">Custom Enemy Highlight Color: </label>
                  <input type="color" id="EnemyhighlightColor" class="gui-color-input" />
          </div>
  
          <div class="module high">
                  <label for="customColor">Custom Team Highlight Color: </label>
                  <input type="color" id="TeamhighlightColor" class="gui-color-input" />
          </div>
  
          <div class="module">
                  <input type="checkbox" id="fpsCap" name="fpsCap" />
                  <label for="fpsCap">Cap FPS</label>
          </div>
  
          <div class="module">
                  <input type="checkbox" id="hideflag" name="hideflag" />
                  <label for="hideflag">Hide Flag ADS</label>
          </div>
  
          <div class="module">
                  <input type="checkbox" id="crosshair" name="crosshair" />
                  <label for="crosshair">Perm. Crosshair</label>
          </div>
  
          <div class="module">
                  <input type="checkbox" id="capture" name="capture" />
                  <label for="capture">Window Capture</label>
          </div>
  
          <div class="module">
                  <input type="checkbox" id="ShowTwitch" name="ShowTwitch" />
                  <label title="Show Live Kirka Twitch Streams &#013; Click And Drag The Titlebar To Move The Menu  &#013; Click And Drag The Bottom Right Corner To Resize The Menu" for="ShowTwitch">Show Live Kirka Twitch Streams Menu</label>
          </div>
          <div id="bkc-daily-stats-wrapper" class="module"><div id="bkc-daily-stats-header">Daily Stats</div>
          <div id="bkc-daily-stats-container" class="module"></div>
          </div>
  </div>
  <div class="footer">Toggle With "PageUp" Key</div>
`;

  //prettier-ignore
  gui.onclick = (e) => {
    if (e.target.id === 'ShowTwitch') {
      ShowTwitch = e.target.checked;
      settings.set('ShowTwitch', ShowTwitch);
      let stremz = document.querySelector('#live-streams-menu');
      if (stremz) {
        stremz.style = `position:absolute;resize:both;overflow: auto hidden!important;opacity:1!important;z-index:3!important;min-height:5vh!important;pointer-events:all!important;top:${TwitchTop};left:${TwitchLeft};width:${TwitchWidth};height:${TwitchHeight};${ShowTwitch ? 'display:block!important;' : 'display:none!important;'}`;
      }
    } 
    
    else if (e.target.id === 'crosshair') {
      permCrosshair = e.target.checked;
      settings.set('permCrosshair', permCrosshair);
      permCrosshairToggleFunc();
    } 
    
    else if (e.target.id === 'hideflag') {
      hideFlagAds = e.target.checked;
      settings.set('hideFlagAds', hideFlagAds);
      if (hideFlagAds) {
        if (flagmodeset) {
          if (!frameFuncs.includes(hideFlagAdsFunc)) {
            frameFuncs.push(hideFlagAdsFunc);
            window.addEventListener('mousedown', IsScoped);
            window.addEventListener('mouseup', IsNotScoped);
          }
        }
      } else {
        frameFuncsRemove(hideFlagAdsFunc);
        if (flagMaterial) {
          flagMaterial.visible = true;
        }
        window.removeEventListener('mousedown', IsScoped);
        window.removeEventListener('mouseup', IsNotScoped);
      }
    } 
    
    else if (e.target.id === 'highlight') {
      playerHighLight = e.target.checked;
      settings.set('playerHighLight', playerHighLight);
      if (playerHighLight) {
        if (!frameFuncs.includes(playerHighLightFunc)) {
          frameFuncs.push(playerHighLightFunc);
        }
      } else {
        frameFuncsRemove(playerHighLightFunc);
      }
    } 
    
    else if (e.target.id === 'customCSS') {
      customCss = e.target.checked;
      settings.set('customCss', customCss);
      applyCss();
    } 
    
    else if (e.target.id === 'fpsCap') {
      fpsCap = e.target.checked;
      settings.set('fpsCap', fpsCap);
      BKC.tip('setting will apply after client restart');
    } 
    
    else if (e.target.id === 'capture') {
      capture = e.target.checked;
      settings.set('capture', capture);
      BKC.tip('setting will apply after client restart');
    } 
    
    else if (e.target.id === 'bkc-new') {
      if (cssAddNewContainer.style.display !== 'flex') {
        cssAddNewContainer.style.display = 'flex';
      } else {
        resetCssWrapper();
      }
    } 
    
    else if (e.target.id === 'bkc-show-delete') {
      if (cssDelete.style.display === 'none') {
        cssDelete.style.display = 'flex';
      } else {
        cssDelete.style.display = 'none';
      }
    } 
    
    else if (e.target.id === 'bkc-delete' || e.target.parentElement.id === 'bkc-delete') {
      if (cssLinks[cssSelect.options[cssSelect.selectedIndex].title]) {
        delete cssLinks[cssSelect.options[cssSelect.selectedIndex].title];
      }
      cssSelect.removeChild(cssSelect.options[cssSelect.selectedIndex]);
      cssLinks.currentCss = cssSelect.value ? cssLinks[cssSelect.options[cssSelect.selectedIndex].title] : null;
      settings.set('cssLinks', cssLinks);
      cssDelete.style.display = 'none';
      applyCss();
    } 
    
    else if (e.target.id === 'bkc-save') {
      if (!cssTitleInput.value || !cssUrlInput.value) {
        if (cssRequiredWarningSpan.innerHTML !== 'Name & Url Required') {
          cssRequiredWarningSpan.innerHTML = 'Name & Url Required';
        }
        if (cssRequiredWarning.style.display !== 'flex') {
          cssRequiredWarning.style.display = 'flex';
        }
      } else if (cssLinks[cssTitleInput.value]) {
        if (cssRequiredWarningSpan.innerHTML !== 'Css Link Already Saved With This Name') {
          cssRequiredWarningSpan.innerHTML = 'Css Link Already Saved With This Name';
        }
        if (cssRequiredWarning.style.display !== 'flex') {
          cssRequiredWarning.style.display = 'flex';
        }
      } else {
        cssLinks[cssTitleInput.value] = {
          title: cssTitleInput.value,
          url: cssUrlInput.value,
        };
        addNewCssOption(cssLinks[cssTitleInput.value], true);
        resetCssWrapper();
        cssLinks.currentCss = cssLinks[cssSelect.options[cssSelect.selectedIndex].title];
        settings.set('cssLinks', cssLinks);
        applyCss();
      }
    } 
    
    else if (e.target.id === 'bkc-browse') {
      cssFilePicker.click();
    }
  };

  gui.style = `display:none;width:${guiWidth};height:${guiHeight};`;

  gui = document.body.appendChild(gui);

  permcrossstyle = gui.querySelector('#BKC-permcrosshair');
  permCrosshairToggleFunc();

  function AnotherFunction(a) {
    return {
      r: a.r * Number.MAX_SAFE_INTEGER,
      g: a.g * Number.MAX_SAFE_INTEGER,
      b: a.b * Number.MAX_SAFE_INTEGER,
    };
  }

  function GetUsableColor(a) {
    if (a.r !== a.g && a.r !== a.b && a.g !== a.r && a.g !== a.b) {
      return AnotherFunction(hexToRgb(hslToHex(hexToH(rgbToHex(a.r, a.g, a.b)), 100, 50)));
    }
    return AnotherFunction(a);
  }

  customEnemyColorElem = document.getElementById('EnemyhighlightColor');
  customTeamColorElem = document.getElementById('TeamhighlightColor');

  customEnemyColorElem.value = EnemyhighlightColor;
  customTeamColorElem.value = TeamhighlightColor;

  colorEnemy = GetUsableColor(hexToRgb(customEnemyColorElem.value));
  colorTeam = GetUsableColor(hexToRgb(customTeamColorElem.value));

  customEnemyColorElem.oninput = () => {
    settings.set('EnemyhighlightColor', customEnemyColorElem.value);
    colorEnemy = GetUsableColor(hexToRgb(customEnemyColorElem.value));
  };

  customTeamColorElem.oninput = () => {
    settings.set('TeamhighlightColor', customTeamColorElem.value);
    colorTeam = GetUsableColor(hexToRgb(customTeamColorElem.value));
  };

  let t = document.querySelector('#view > div > div > div.top-bar > div.left');
  if (t && !document.querySelector('#searchfrnds')) {
    let fbtn = document.createElement('input');
    fbtn.placeholder = 'Search...';
    fbtn.className = 'input';
    fbtn.id = 'searchfrnds';
    fbtn.style.width = '100%';
    fbtn.style.margin = 'auto 0.3rem';
    fbtn.style.cursor = 'text';
    t.parentNode.insertBefore(fbtn, t.nextSibling);
    fbtn.addEventListener('keypress', (evt) => {
      if (evt.key === 'Enter') {
        window.find(evt.target.value, false, false, true, false, true);
        scrollIntoView(window.getSelection());
      }
    });
  }

  function addNewCssOption(obj, set = false) {
    let newoptions = document.createElement('option');
    newoptions.style = 'color:rgb(0, 0, 0)';
    newoptions.title = obj.title;
    newoptions.url = obj.url;
    newoptions.innerHTML = `${obj.title} - ${obj.url}`;
    newoptions = cssSelect.appendChild(newoptions);
    if (cssLinks?.currentCss?.title === obj.title || set) {
      newoptions.selected = true;
    }
  }

  if (!cssSelect) {
    cssSelect = document.createElement('select');
    cssSelect.id = 'custom-css-select';
    cssSelect.style = 'max-width:10vw;min-width:10vw;margin:0 0.5rem;color:rgb(255, 255, 255);background-color:initial;border-radius:.3rem;box-shadow:rgba(0, 0, 0, 0.5) 2px 1px 6px!important;';
    for (const cssOptions in cssLinks) {
      if (cssLinks[cssOptions] !== cssLinks.currentCss) addNewCssOption(cssLinks[cssOptions]);
    }
    cssSelect = document.querySelector('#custom-css-wrapper').insertBefore(cssSelect, document.querySelector('#bkc-custom-css-header-button-wrapper'));
  }

  let cssFilePicker = document.querySelector('#bkc-file-picker');
  let cssDelete = document.querySelector('#bkc-delete');
  let cssUrlInput = document.querySelector('#css-new-url-input');
  let cssTitleInput = document.querySelector('#css-new-title-input');
  let cssRequiredWarning = document.querySelector('.required-warning');
  let cssAddNewContainer = document.querySelector('#add-new-css-menu');
  let cssRequiredWarningSpan = document.querySelector('#required-warning-span');

  if (settings.get('menuOpen') === undefined || settings.get('menuOpen')) {
    toggleGui();
  }

  function resetCssWrapper() {
    if (cssRequiredWarning.style.display !== 'none') {
      cssRequiredWarning.style.display = 'none';
    }
    if (cssAddNewContainer.style.display !== 'none') {
      cssAddNewContainer.style.display = 'none';
    }
    cssUrlInput.value = '';
    cssTitleInput.value = '';
  }

  function applyCss() {
    let p = document.querySelector('#custom-css');
    if (p) document.head.removeChild(p);
    if (customCss && cssLinks.currentCss) {
      let cssLinkElem = document.createElement('link');
      cssLinkElem.href = cssLinks.currentCss.url;
      cssLinkElem.rel = 'stylesheet';
      cssLinkElem.id = 'custom-css';
      document.head.appendChild(cssLinkElem);
    }
  }

  cssSelect.oninput = () => {
    if (cssSelect.value) {
      cssLinks.currentCss = cssLinks[cssSelect.options[cssSelect.selectedIndex].title];
      resetCssWrapper();
      settings.set('cssLinks', cssLinks);
      applyCss();
    }
  };

  cssFilePicker.oninput = () => {
    if (cssFilePicker.value) {
      if (cssFilePicker.files[0].type === 'text/css') {
        cssUrlInput.value = `file:///${cssFilePicker.files[0].path.replace(/\\/g, '/')}`;
      } else {
        BKC.tip('Invalid FileType');
      }
    }
  };

  document.getElementById('crosshair').checked = permCrosshair;
  document.getElementById('hideflag').checked = hideFlagAds;
  document.getElementById('highlight').checked = playerHighLight;
  document.getElementById('customCSS').checked = customCss;
  document.getElementById('ShowTwitch').checked = ShowTwitch;
  document.getElementById('fpsCap').checked = fpsCap;
  document.getElementById('capture').checked = capture;
});

function keyup(e) {
  if (e.key === 'PageUp') {
    toggleGui();
  }
}

document.addEventListener('keyup', keyup);

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

function cssSelectKeyDown(mwNMWnmWnMwNMandM) {
  if (mwNMWnmWnMwNMandM.key === 'PageUp' || mwNMWnmWnMwNMandM.key === 'PageDown') {
    mwNMWnmWnMwNMandM.preventDefault();
    mwNMWnmWnMwNMandM.stopPropagation();
  }
}

let droptimeout;
function cssAddFromDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  cssDropEnd();
  let cssAddNewContainer = document.querySelector('#add-new-css-menu');
  if (e.dataTransfer.files[0].type === 'text/css') {
    if (cssAddNewContainer.style.display !== 'flex') {
      cssAddNewContainer.style.display = 'flex';
    }
    document.querySelector('#css-new-url-input').value = `file:///${e.dataTransfer.files[0].path.replace(/\\/g, '/')}`;
  } else {
    BKC.tip('Invalid FileType');
  }
}

function cssWhileDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  if (droptimeout) droptimeout = clearTimeout(droptimeout);
  if (!gui.classList.contains('bkc-drop')) gui.classList.add('bkc-drop');
}

function cssDropEnd() {
  if (droptimeout) droptimeout = clearTimeout(droptimeout);
  droptimeout = setTimeout(() => {
    if (gui.classList.contains('bkc-drop')) gui.classList.remove('bkc-drop');
  }, 100);
}

function toggleGui() {
  menuVisible = !menuVisible;
  if (menuVisible) {
    document.exitPointerLock();
    gui.style.display = 'flex';
    if (!GuiResizeObserver) {
      GuiResizeObserver = new ResizeObserver(SaveGuiSize);
    }
    GuiResizeObserver.observe(gui);
    cssSelect.addEventListener('keydown', cssSelectKeyDown, false);
    gui.addEventListener('drop', cssAddFromDrop, false);
    gui.addEventListener('dragover', cssWhileDrop, false);
    gui.addEventListener('dragenter', cssWhileDrop, false);
    gui.addEventListener('dragleave', cssDropEnd, false);
  } else {
    GuiResizeObserver.disconnect();
    gui.style.display = 'none';
    cssSelect.removeEventListener('keydown', cssSelectKeyDown, false);
    gui.removeEventListener('drop', cssAddFromDrop, false);
    gui.removeEventListener('dragover', cssWhileDrop, false);
    gui.removeEventListener('dragenter', cssWhileDrop, false);
    gui.removeEventListener('dragleave', cssDropEnd, false);
  }
  settings.set('menuOpen', menuVisible);
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

const proxy = Function.prototype.constructor;

Function.prototype.constructor = function (...args) {
  if (args[0] === 'while (true) {}' || args[0] === 'debugger') return proxy.apply(this);
  return proxy.apply(this, arguments);
};
