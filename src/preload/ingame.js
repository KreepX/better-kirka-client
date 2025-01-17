/* eslint-disable function-paren-newline */
/* eslint-disable no-return-assign */
/* eslint-disable no-void */
/* eslint-disable no-useless-escape */
/* eslint-disable guard-for-in */
/* eslint-disable getter-return */
/* eslint-disable no-extend-native */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-nested-ternary */

const { clipboard, shell } = require('electron');
const Store = require('electron-store');
const fs = require('fs');

const settings = new Store();

const BKC = {
  cleartip(id, timeoutID) {
    if (timeoutID) {
      timeoutID = clearTimeout(timeoutID);
      id.parentElement?.removeChild(id);
    }
  },
  tip() {
    let span = document?.getElementsByClassName('vue-notification-group')[0]?.getElementsByTagName('span')[0];
    if (span) {
      let tipchilds = span?.childNodes;
      if (tipchilds?.length >= DevTooltipsMaxTips) {
        let trimLen = tipchilds.length - 1 - DevTooltipsMaxTips;
        for (let i = 0; i < trimLen; i++) {
          let p = span?.firstChild;
          if (p) span.removeChild(p);
        }
      }

      let isNested = (val) => String(val).split('[object').length > 1;
      let tipString = '';
      Array.prototype.slice.call(arguments).forEach((arg) => {
        if (Array.isArray(arg)) return (tipString += `${!isNested(arg) ? arg.toString() : JSON.stringify(arg)}\n`);
      
        if (typeof arg === 'object')
          return (tipString += `${Object.entries(arg)
            .map((p) => `${p[0]}: ${!isNested(p[1]) ? p[1] : JSON.stringify(p[1])}`)
            .join('\n')}\n`);
      
        return (tipString += `${arg}\n`);
      });

      let newtip = document.createElement('div');
      newtip.setAttribute('data-id', tipchilds ? tipchilds.length + 1 : '1');
      newtip.className = 'vue-notification-wrapper vn-fade-move';
      newtip.style = 'transition-timing-function:ease;transition-delay:0s;transition-property:all;';
      newtip.id = `BKC-dev-tip${++devid}`;
      newtip.innerHTML = getTipInnerHtml(tipString);
      newtip = span.appendChild(newtip);
      let timeoutID = setTimeout(() => {
        BKC.cleartip(newtip, timeoutID);
      }, DevTooltipsTimeout);
      newtip.addEventListener('click', () => {
        BKC.cleartip(newtip, timeoutID);
      });
    }
  },
};

window.addEventListener('error', (event) => {
  if (/ingame\.js/.test(event.filename)) {
    console.error(event);
    if (DevToolTips) {
      if (BKC.error) return BKC.error(event.message);
      if (window._?.throttle) {
        BKC.error = window._.throttle(BKC.tip, 1000, { leading: false });
        BKC.error(event.message);
      }
    }
  }
});

if (typeof settings.get('pendingImport') !== 'undefined') {
  let savedStorage = settings.get('pendingImport');
  Object.assign(localStorage, savedStorage);
  settings.delete('pendingImport');
  window.location.reload();
}

let ogStringify = window.JSON.stringify;
let gigafydStringify = function () {
  if (marketPrice && arguments[0].price) {
    arguments[0].price = marketPrice;
    marketPrice = null;
    window.JSON.stringify = ogStringify;
  }
  return ogStringify.apply(this, arguments);
};

function gigaInfiRequest() {
  window.XMLHttpRequest = class extends XMLHttpRequest {
    constructor() {
      super();
      this.send = (...sendArgs) => {
        let oldChange = this.onreadystatechange;
        this.onreadystatechange = (...args) => {
          if (this.readyState === 4 && this.status === 200) {
            if (this.responseURL === 'https://api.kirka.io/api/user') {
              let data = JSON.parse(this.response);
              id = data.shortId;
            } else if (this.responseURL === 'https://api.twitch.tv/helix/streams?first=10&game_id=356609813') {
              stremzInfo = JSON.parse(this.response);
              initTwitchMenu();
            } else if (new URL(this.responseURL).pathname === '/helix/users') {
              let stremzNew = JSON.parse(this.response);
              if (initTwitchMenu()) {
                newStremz(stremzNew);
              }
            } else if (this.responseURL === 'https://api.kirka.io/api/notification' && this.response !== '[]') {
              let data = JSON.parse(this.response);
              if (Object.keys(data).filter((key) => data[key].object?.message === 'You completed a quest').length > 0) {
                if (!claimedQuest) {
                  claimedQuest = true;
                  checkclaimQuest();
                }
              }
            } else if (this.responseURL === 'https://api.kirka.io/api/inventory') {
              skinzInfo = JSON.parse(this.response);
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

let meow = function () {
  if (arguments[0].name === 'hover') {
    arguments[0].src = MenuhoverAudio || arguments[0].src;
    window._.cleanUpOldUnusedInits();
  } else if (arguments[0].name === 'error') {
    arguments[0].volume = 0;
  }
  return originalHowl.apply(this, arguments);
};

let stremzInfo;
let skinzInfo;
let id;
let marketPrice;
let originalHowl;
let DevToolTips = true;
let DevTooltipsTimeout = 10000;
let DevTooltipsMaxTips = 20;
let devid = 0;
let GameModes =
  typeof settings.get('GameModes') === 'undefined'
    ? {
        DM: true,
        BW: true,
        TDM: true,
        POINT: true,
        PHY: true,
      }
    : settings.get('GameModes');

/* single white pixel */
let cookiezi = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABEAIAAADA54+dAAAAC0lEQVQI12P4DwYAFPIF+zx10voAAAAASUVORK5CYII=';
let globalChatVisibleToggleKey = typeof settings.get('globalChatVisibleToggleKey') === 'undefined' ? '7' : settings.get('globalChatVisibleToggleKey');
let globalChatInputToggleKey = typeof settings.get('globalChatInputToggleKey') === 'undefined' ? '8' : settings.get('globalChatInputToggleKey');
let enemyHighlightColor = typeof settings.get('enemyHighlightColor') === 'undefined' ? '#ff00ff' : settings.get('enemyHighlightColor');
let lobbyPlayerHighlight = typeof settings.get('lobbyPlayerHighlight') === 'undefined' ? false : settings.get('lobbyPlayerHighlight');
let globalChatOpenSocket = typeof settings.get('globalChatOpenSocket') === 'undefined' ? true : settings.get('globalChatOpenSocket');
let teamHighlightColor = typeof settings.get('teamHighlightColor') === 'undefined' ? '#0000ff' : settings.get('teamHighlightColor');
let randomFavoriteSkins = typeof settings.get('randomFavoriteSkins') === 'undefined' ? false : settings.get('randomFavoriteSkins');
let gameMuzzleHighlight = typeof settings.get('gameMuzzleHighlight') === 'undefined' ? false : settings.get('gameMuzzleHighlight');
let lobbyPlayerTexture = typeof settings.get('lobbyPlayerTexture') === 'undefined' ? false : settings.get('lobbyPlayerTexture');
let lobbyWeapHighlight = typeof settings.get('lobbyWeapHighlight') === 'undefined' ? false : settings.get('lobbyWeapHighlight');
let lobbyPlayerVisible = typeof settings.get('lobbyPlayerVisible') === 'undefined' ? true : settings.get('lobbyPlayerVisible');
let lobbyShadowVisible = typeof settings.get('lobbyShadowVisible') === 'undefined' ? true : settings.get('lobbyShadowVisible');
let lobbyPlayerColor = typeof settings.get('lobbyPlayerColor') === 'undefined' ? '#ffffff' : settings.get('lobbyPlayerColor');
let gameWeapHighlight = typeof settings.get('gameWeapHighlight') === 'undefined' ? false : settings.get('gameWeapHighlight');
let gameArmsHighlight = typeof settings.get('gameArmsHighlight') === 'undefined' ? false : settings.get('gameArmsHighlight');
let gameFlagHighlight = typeof settings.get('gameFlagHighlight') === 'undefined' ? false : settings.get('gameFlagHighlight');
let globalChatVisible = typeof settings.get('globalChatVisible') === 'undefined' ? true : settings.get('globalChatVisible');
let extraAdsZoomAmount = typeof settings.get('extraAdsZoomAmount') === 'undefined' ? 1 : settings.get('extraAdsZoomAmount');
let gameMuzzleColor = typeof settings.get('gameMuzzleColor') === 'undefined' ? '#ffffff' : settings.get('gameMuzzleColor');
let lobbyWeapTexture = typeof settings.get('lobbyWeapTexture') === 'undefined' ? false : settings.get('lobbyWeapTexture');
let extraAdsZoomHold = typeof settings.get('extraAdsZoomHold') === 'undefined' ? true : settings.get('extraAdsZoomHold');
let lobbyWeapVisible = typeof settings.get('lobbyWeapVisible') === 'undefined' ? true : settings.get('lobbyWeapVisible');
let lobbyWeapColor = typeof settings.get('lobbyWeapColor') === 'undefined' ? '#ffffff' : settings.get('lobbyWeapColor');
let lobbyPlayerWire = typeof settings.get('lobbyPlayerWire') === 'undefined' ? false : settings.get('lobbyPlayerWire');
let allFavoriteSkins = typeof settings.get('allFavoriteSkins') === 'undefined' ? {} : settings.get('allFavoriteSkins');
let gameArmsTexture = typeof settings.get('gameArmsTexture') === 'undefined' ? false : settings.get('gameArmsTexture');
let gameWeapTexture = typeof settings.get('gameWeapTexture') === 'undefined' ? false : settings.get('gameWeapTexture');
let showClanInvites = typeof settings.get('showClanInvites') === 'undefined' ? true : settings.get('showClanInvites');
let gameFlagColor = typeof settings.get('gameFlagColor') === 'undefined' ? '#ffffff' : settings.get('gameFlagColor');
let gameWeapColor = typeof settings.get('gameWeapColor') === 'undefined' ? '#ffffff' : settings.get('gameWeapColor');
let gameArmsColor = typeof settings.get('gameArmsColor') === 'undefined' ? '#ffffff' : settings.get('gameArmsColor');
let extraAdsZoomKey = typeof settings.get('extraAdsZoomKey') === 'undefined' ? '' : settings.get('extraAdsZoomKey');
let MenuhoverAudio = typeof settings.get('MenuhoverAudio') === 'undefined' ? null : settings.get('MenuhoverAudio');
let nerfChatLenght = typeof settings.get('nerfChatLenght') === 'undefined' ? 50 : settings.get('nerfChatLenght');
let lobbyWeapWire = typeof settings.get('lobbyWeapWire') === 'undefined' ? false : settings.get('lobbyWeapWire');
let TwitchHeight = typeof settings.get('TwitchHeight') === 'undefined' ? 'auto' : settings.get('TwitchHeight');
let lobbyRainbow = typeof settings.get('lobbyRainbow') === 'undefined' ? false : settings.get('lobbyRainbow');
let gameWeapWire = typeof settings.get('gameWeapWire') === 'undefined' ? false : settings.get('gameWeapWire');
let gameArmsWire = typeof settings.get('gameArmsWire') === 'undefined' ? false : settings.get('gameArmsWire');
let TwitchWidth = typeof settings.get('TwitchWidth') === 'undefined' ? 'auto' : settings.get('TwitchWidth');
let gameRainbow = typeof settings.get('gameRainbow') === 'undefined' ? false : settings.get('gameRainbow');
let TwitchLeft = typeof settings.get('TwitchLeft') === 'undefined' ? '10vw' : settings.get('TwitchLeft');
let ShowTwitch = typeof settings.get('ShowTwitch') === 'undefined' ? true : settings.get('ShowTwitch');
let TwitchTop = typeof settings.get('TwitchTop') === 'undefined' ? '20vw' : settings.get('TwitchTop');
let minPlayers = typeof settings.get('minPlayers') === 'undefined' ? 1 : settings.get('minPlayers');
let capture = typeof settings.get('capture') === 'undefined' ? false : settings.get('capture');
let cssLinks = typeof settings.get('cssLinks') === 'undefined' ? {} : settings.get('cssLinks');
let fpsCap = typeof settings.get('fpsCap') === 'undefined' ? false : settings.get('fpsCap');
let minTime = typeof settings.get('minTime') === 'undefined' ? 0 : settings.get('minTime');
let gamePlayerHighLight = !!settings.get('gamePlayerHighLight');
let permCrosshair = !!settings.get('permCrosshair');
let hideFlagAds = !!settings.get('hideFlagAds');
let customCss = !!settings.get('customCss');
let gui = document.createElement('div');
let favoriteSkins;
let seenSkins;
let animating;
let lobbyAnimating;
let streamsmenu;
let notificationsonclick;
let GuiResizeObserver;
let permcrossstyle;
let cssSelect;
let clockInterval;
let timeContainer;
let droptimeout;
let lessLaggyGuiOnInput;
let rapidChests;
let defaultsMap = new WeakMap();
let clanSelectors = new Map();
let rrr = 255;
let ggg = 0;
let bbb = 0;
let statsUpdated = false;
let claimedQuest = false;
let claimedReward = false;
let zooming = false;
let inGame = false;
let menuVisible = false;
let SaveGuiSize = () => {
  settings.set('guiWidth', gui.style.width);
  settings.set('guiHeight', gui.style.height);
};
let TwitchResizeObserver = new ResizeObserver(SaveTwitchSize);

const SomeObserver = new MutationObserver(() => {
  if (inGame) {
    if (window.mWnwM?.mWnwM?.room?.name === 'PointRoom') {
      document.onmousedown = hideFlagAdsFunc;
      document.onmouseup = hideFlagAdsFunc;
    }
    if (!animating) animating = window.requestAnimationFrame(animate);
    if (moveTime() && seenSkinsListener()) SomeObserver.disconnect();
    return;
  }

  if (!originalHowl && typeof window?.Howl?.prototype?.init === 'function') {
    originalHowl = window.Howl.prototype.init;
    window.Howl.prototype.init = meow;
    window._.cleanUpOldUnusedInits = window._.debounce(function () {
      window.Howler.unload();
    }, 1000);
  }

  let current = window?.app?.__vue__?.$router?.history?.current;
  if (current) {
    if (current?.name === 'levels') {
      let lvlContainer = document.querySelector('#view > div > div.container > div.content > div.levels');
      let lvlRewardsBar = lvlContainer?.querySelector('#Bkc-levels-rewards');
      let lvlRewardsBarButton = lvlContainer?.querySelector('#Bkc-levels-rewards-button');
      let lvlVue = lvlContainer?.__vue__;
      if (lvlRewardsBarButton || !lvlVue) return;

      lvlRewardsBarButton = lvlContainer.firstChild.appendChild(document.createElement('button'));
      lvlRewardsBarButton.id = 'Bkc-levels-rewards-button';
      lvlRewardsBarButton.innerText = 'show timeline';

      lvlRewardsBarButton.onclick = () => {
        function setRewardsStyles(text) {
          lvlRewardsBarButton.innerText = text;
          lvlContainer.classList.add('bkc-timeline');
          let lvlProg = lvlRewardsBar.children[lvlVue.user.level - 2].children;
          lvlProg[1].style.width = '1rem';
          lvlProg[1].style.left = `${lvlProg[0].offsetLeft}px`;
          lvlContainer.scrollLeft = lvlRewardsBar.children[lvlVue.user.level - 4].offsetLeft;
        }

        if (lvlRewardsBarButton.innerText.toLowerCase() === 'hide timeline') {
          lvlRewardsBarButton.innerText = 'show timeline';
          lvlContainer.classList.remove('bkc-timeline');
          return;
        }

        if (lvlRewardsBar) return setRewardsStyles('hide timeline');
        lvlRewardsBarButton.style.pointerEvents = 'none';
        lvlRewardsBarButton.innerHTML = 'loading...⠀<div class="bkc-loader"></div>';

        setTimeout(() => {
          lvlRewardsBar = lvlContainer.appendChild(document.createElement('div'));
          lvlRewardsBar.id = 'Bkc-levels-rewards';
          let lvls = Object.keys(lvlVue.objectReward);
          let imgPos = 'bottom: 2rem;';
          let xpRemaining = lvlVue.user.xpUntilNextLevel - lvlVue.user.xpSinceLastLevel;
          lvls.forEach((lvl) => {
            // eslint-disable-next-line eqeqeq
            let isCurrentlvl = lvl == lvlVue.user.level;
            let reward = lvlVue.objectReward[lvl][0];
            let lvlLessEq = lvl <= lvlVue.user.level;
            let lvlTxt = reward.name === 'AR-9' || reward.name === 'SCAR' || reward.name === 'Tomahawk' ? reward.name : `${reward.name} x${reward.amount}`;
            imgPos = imgPos === 'bottom: 2rem;' ? 'top: 2rem;' : 'bottom: 2rem;';
            return (lvlRewardsBar.innerHTML += `
            <div class="${lvl < lvlVue.user.level ? 'text-1' : 'text-1 no-act'}">
              <div class="${lvl > lvlVue.user.level ? 'lvl no-active' : 'lvl'}">${lvl}</div>
              ${isCurrentlvl ? `<span id="bkc-reward-spacer-progress" style=""></span>` : ''}
              <span id="bkc-reward-spacer">${isCurrentlvl ? `${xpRemaining}xp` : ''}</span>
              <div class="level-bottom" style="${imgPos}">
                <div class="level-card text-1 ${lvlLessEq ? 'disable-shadow' : ''}">
                  <img src="/assets/img/1.d2f7d4d4.webp" alt="bg" class="bg"/>
                  <div class="box-border"></div>
                  <div class="label">${lvlTxt}</div>
                  <div class="content">
                  <img src="${reward.img}" alt="box" class="item-img"/>
                  </div>${lvlLessEq ? '<div class="disable"></div>' : ''}
                </div>
              </div>
            </div>`);
          });
          setRewardsStyles('hide timeline');
          lvlRewardsBarButton.style.pointerEvents = '';
        });
      };
      lvlRewardsBarButton.onmouseenter = playHoverAudio;
    }

    if (current?.name === 'inventory') {
      let subjects = document.querySelector('#view div div div.content div.inventory > div.content > div.subjects');
      let invDiv = window.view.__vue__.$children[1].$el;
      let marketModaling = document.querySelector('[data-modal="market-item"]');
      if (subjects && (invDiv.__vue__.activeTabKey === 0 || invDiv.__vue__.activeTabKey === 2)) {
        if (randomFavoriteSkins && favoriteSkins) {
          appendFavedMarker();
          appendFavedButtons();
        }

        let tabs = document.querySelectorAll('.tab-bar .tab');
        subjects.onclick = FavedButtonsHandler.bind(invDiv);
        tabs[0].onclick = window.app.__vue__.$store._actions['user/getInventory'][0];
        tabs[2].onclick = window.app.__vue__.$store._actions['user/getInventory'][0];

        if (!invDiv.__vue__.openModalInspect) {
          invDiv.__vue__.openModalInspect = true;
          window.view.__vue__.$router.options.routes
            .find((a) => a?.name === 'servers')
            .component()
            .then((b) => {
              invDiv.__vue__.openModalInspect = function (item) {
                b.default.components.Chat.components.GlobalMessages.methods.openModalInspect.call(window.app.__vue__, item);
              };
            });
        }

        let cloneBut = document.querySelector('.hover-btns-group button.button');
        if (!cloneBut) return;
        document.querySelectorAll('.hover-btns-group').forEach((butWrapper) => {
          if (butWrapper?.querySelector('.inspect-btn')) return;
          let inspectBut = cloneBut.cloneNode(true);
          inspectBut.className = 'button bottom-inv inspect-btn rectangle';
          inspectBut.style = `
          background-color: var(--blue-4);
          --hover-color: var(--blue-5);
          --top: var(--blue-5);
          --bottom: var(--blue-6);`;
          inspectBut.children[1].innerText = 'INSPECT';
          inspectBut = butWrapper.children ? butWrapper.insertBefore(inspectBut, butWrapper.firstChild) : butWrapper.appendChild(inspectBut);
        });
      } else if (subjects?.onclick) {
        subjects.onclick = null;
      }
      if (marketModaling) customMarketPrice(invDiv);
    } else if (
      current.matched[0]?.name === 'servers' &&
      !document.querySelector('#view > div > div > div.content > div.servers > div > div.list-cont > div#bkc-minmax-selects > div.mods.tabmods')
    ) {
      SetGameModesCheckBoxes();
    }
  }

  if (!notificationsonclick) notificationsonclick = NotificationsOpenMenus();

  if (!document.querySelector('#clientJoinButton') && document.querySelector('.play-content')) {
    let btn = document.createElement('button');
    btn.id = 'clientJoinButton';
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
    cursor: pointer;box-shadow: 0 5.47651px 0 rgba(0,0,0,.5);
    text-shadow: -1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 1px 1px rgba(0,0,0,.486);
    width: 150px;
    height: 50px;
    bottom: 20px;
    right: 100%;
    margin-right: 10px;
    font-size: 20px;`;
    btn.innerText = 'Join Link';
    btn.onclick = (e) => {
      let store = window.app.__vue__.$store;
      let gameId = clipboard.readText().split('/').reverse()[0];
      if (!e.button === 0 || !Object.keys(store._modules.root.state.game.regions).includes(gameId.split('~')[0])) return;
      store._actions['game/connectByIdRoom'][0](gameId);
    };
    document.getElementsByClassName('play-content')[0].append(btn);
  }

  if (!statsUpdated && document.querySelector('.username')?.innerHTML) {
    statsUpdated = true;
    fetchStats(0);
  }

  function clock() {
    if (!clockInterval) {
      clockInterval = setInterval(() => {
        let titTok = document.querySelector('#free-clock');
        if (titTok) titTok.innerHTML = new Date().toLocaleTimeString();
      }, 1000);
    }
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
      backbutton.onmouseenter = playHoverAudio;
      forwardbutton.onmouseenter = playHoverAudio;
      backbutton = backForwardButton.appendChild(backbutton);
      forwardbutton = backForwardButton.appendChild(forwardbutton);
      backForwardButton = homeButton.parentElement.insertBefore(backForwardButton, homeButton);
    }
  }

  /*let leaderboardReward = document.querySelector('#app > div.interface.text-2 > div.cont-banner')?.__vue__?.$slots?.default[0]?.componentInstance;
  if (leaderboardReward?.head === 'DAILY LEADERBOARD') leaderboardReward.pickUp();*/

  if (!claimedReward && document.querySelector('#auth-user > div > div.card-cont.user-info > div.progress-label > div.circle-red')) {
    claimedReward = true;
    window.app.__vue__.$store._actions['user/pickupRewards'][0]({ category: 'level' });
    BKC.tip(`Level ${window.view.__vue__.user.level} reward claimed`);
  }

  let modal = document.querySelector('div.vm--container');
  let modalName = modal?.__vue__?.name;

  if (modalName === 'settings') {
    let inputLabels = modal.querySelectorAll('.wrapper-input.wWmMn[placeholder="Paste image url..."]');
    if (inputLabels?.length === 9) {
      inputLabels.forEach((label, index) => {
        let input = label?.querySelector('input');
        if (input && !label?.querySelector('.bkc-textures')) {
          let inputImageCache = typeof settings.get('inputImageCache') === 'undefined' ? [[], [], [], [], [], [], [], [], []] : settings.get('inputImageCache');
          let inputDatalist = document.createElement('datalist');
          let names = `bkc-textures${index}`;
          input.onmousedown = clearInputImage;
          input.onblur = fillInputImage;
          input.name = names;
          input.setAttribute('list', names);
          inputDatalist.id = names;
          inputDatalist.className = 'bkc-textures';
          inputDatalist.innerHTML = inputImageCache[index].toString().split(',').join('');
          inputDatalist = label.appendChild(inputDatalist);
          input.oninput = () => checkInputImage(input, inputDatalist, index);
          if (input.value) checkInputImage(input, inputDatalist, index);
        }
      });
    }
  }

  if (modalName === 'level-up' || (modalName === 'clan-invitation' && !showClanInvites)) {
    modal = modal.parentElement.removeChild(modal);
    modal.__vue__.close();
  }

  if (modalName === 'clan-invitation' && showClanInvites) {
    appendClanInvites();
  } else if (modalName === 'create-modal' && !document.querySelector('#bkc-quick-test') && document.querySelector('.select-all')) {
    let gen = modal.querySelector('div.general-content.text-2');
    let quickTestHeader = gen.firstChild;
    let freebutton = modal.querySelector('.select-all');
    let game = window.app.__vue__.$store._modules.root.state.game;
    let mods = Object.keys(game.mods);
    mods.forEach((mode) => {
      if (mode !== 'MapEditorRoom') {
        let quickTestButtons = gen.insertBefore(freebutton.cloneNode(true), gen.firstChild);
        quickTestButtons.id = 'bkc-quick-test';
        quickTestButtons.children[1].innerText = game.mods[mode].name;
        quickTestButtons.onclick = (e) => {
          game.minutes = 60;
          game.privacy = 'private';
          Object.keys(game.weapons).forEach((weapon) => {
            game.weapons[weapon].active = true;
          });
          Object.keys(game.maps).forEach((map) => {
            game.maps[map].active = true;
          });
          mods.forEach((mod) => {
            if (game.mods[mod].name.toUpperCase() === e.target.children[1].innerText.trim()) game.mods[mod].active = true;
            else game.mods[mod].active = false;
          });
          modal.__vue__.$children[0].create();
        };
      }
    });
    quickTestHeader = gen.insertBefore(quickTestHeader.cloneNode(true), gen.firstChild);
    quickTestHeader.innerText = 'Quick Test';
    quickTestHeader.style.marginBottom = '0.5rem';
  } else if (modalName === 'chest-open') {
    if (!rapidChests)
      rapidChests = setInterval(() => {
        let chests = modal?.querySelector('div.chest-container')?.__vue__;
        let chestNextBut = modal?.querySelector('button.next');
        if (!chests) return;
        if (chests.animation === 'animation') chests.open = 'circle-resize';

        chests.nextChest = function () {
          this.open = 'circle-resize-disable';
          this.animation = '';
        }.bind(chests);

        if (!chestNextBut) return;
        chestNextBut.onclick = () => {
          chests.opening = false;
          if (chests.chestsState[chests.activeChestName]?.amount) {
            chests.clickChest();
          }
        };
      }, Infinity);
  } else if (rapidChests) rapidChests = clearInterval(rapidChests);
});

function animateLobby() {
  if (inGame) return;
  window.requestAnimationFrame(animateLobby);
  let current = window?.app?.__vue__?.$router?.history?.current;
  if (!current) return;
  let rgbColor = lobbyRainbow ? getRGBcycle() : null;
  let app = window.app.__vue__;
  let updateLocation = current.name === 'home' || current.name === 'inventory';
  let scenerio1 = app.$store._modules.root.context.state?.user?.mwWN?.lobby;

  if (current.name === 'profile-id') scenerio1 = window.view.__vue__?.$children[1]?.$children[0]?.player || scenerio1;
  else if (current.name === 'inventory') scenerio1 = app.$store._modules.root.context.state?.user?.mwWN?.inventory || scenerio1;
  else if (current.name === 'leaderboard') scenerio1 = window.view.__vue__.$children.find((a) => a?.$el?.className === 'hub-container')?.$children.find((a) => a?.players)?.players || scenerio1;
  else if (current.name === 'game') scenerio1 = app.$children.filter((a) => a?.$children[0]?.Wmn)?.[0]?.$children[0].Wmn; // endscreen

  if (!scenerio1?.players) return;
  scenerio1.players.forEach((player, index) => {
    let playerShadow = player.shadow;
    let playerLight = player.WwNnM.model?.parent.children[0].position;
    let playerModel = player.WwNnM.model?.children[0].children[0].children[1];
    let playerMat = playerModel?.material;
    let weapon = player.weapons[player.wName].model;
    weapon = weapon?.children[weapon.children.length - 1] || weapon;
    let weaponMat = weapon?.material;
    let weaponMatImg = weaponMat?.map?.image;
    let playerMatImg = playerMat?.map?.image;

    if (playerLight && playerLight.x !== 1) playerLight.x = 1;
    if (playerShadow && playerShadow.visible !== lobbyShadowVisible) playerShadow.visible = lobbyShadowVisible;
    if (weaponMatImg) {
      if (!defaultsMap.has(weapon)) {
        defaultsMap.set(weapon, {
          color: {
            r: weaponMat.color.r,
            g: weaponMat.color.g,
            b: weaponMat.color.b,
          },
          emissive: {
            r: weaponMat.emissive.r,
            g: weaponMat.emissive.g,
            b: weaponMat.emissive.b,
          },
          src: weaponMatImg.src,
        });
      }

      let weapDefaults = defaultsMap.get(weapon);
      if (index === 0 && updateLocation && weaponMatImg.src !== weapDefaults.src && weaponMatImg.src !== cookiezi) weapDefaults.src = weaponMatImg.src;

      if (weapon.visible !== lobbyWeapVisible) weapon.visible = lobbyWeapVisible;
      if (lobbyWeapVisible) {
        let weapColor = lobbyWeapHighlight ? rgbColor || lobbyWeapColor : weapDefaults.color;
        let weapEmissive = weapColor !== weapDefaults.color ? weapColor : weapDefaults.emissive;
        let currMapSrc = weapColor !== weapDefaults.color && !lobbyWeapTexture ? cookiezi : weapDefaults.src;
        if (weaponMat.map.version !== 1) weaponMat.map.version = 1;
        if (weaponMat.wireframe !== lobbyWeapWire) weaponMat.wireframe = lobbyWeapWire;
        if (weaponMatImg.src !== currMapSrc) weaponMat = osuClassic(weaponMat, currMapSrc);
        if (!weaponMat.color.equals(weapColor)) weaponMat.color.setRGB(weapColor.r, weapColor.g, weapColor.b);
        if (!weaponMat.emissive.equals(weapEmissive)) weaponMat.emissive.setRGB(weapEmissive.r, weapEmissive.g, weapEmissive.b);
      }
    }

    if (!playerMatImg) return;
    if (!defaultsMap.has(playerModel)) {
      defaultsMap.set(playerModel, {
        color: {
          r: playerMat.color.r,
          g: playerMat.color.g,
          b: playerMat.color.b,
        },
        emissive: {
          r: playerMat.emissive.r,
          g: playerMat.emissive.g,
          b: playerMat.emissive.b,
        },
        src: playerMatImg.src,
      });
    }

    let playerDefaults = defaultsMap.get(playerModel);
    if (updateLocation && playerMatImg?.src && playerMatImg.src !== playerDefaults.src && playerMatImg.src !== cookiezi) playerDefaults.src = playerMatImg.src;

    if (playerModel.visible !== lobbyPlayerVisible) playerModel.visible = lobbyPlayerVisible;
    if (!lobbyPlayerVisible) return;
    let playerColor = lobbyPlayerHighlight ? rgbColor || lobbyPlayerColor : playerDefaults.color;
    let playerEmissive = playerColor !== playerDefaults.color ? playerColor : playerDefaults.emissive;
    let playerImg = playerColor !== playerDefaults.color && !lobbyPlayerTexture ? cookiezi : playerDefaults.src;
    if (playerMat.wireframe !== lobbyPlayerWire) playerMat.wireframe = lobbyPlayerWire;
    if (playerMatImg.src !== playerImg) playerMat = osuClassic(playerMat, playerImg);
    if (playerMat.map.version !== 1) playerMat.map.version = 1;
    if (!playerMat.color.equals(playerColor)) playerMat.color.setRGB(playerColor.r, playerColor.g, playerColor.b);
    if (!playerMat.emissive.equals(playerEmissive)) playerMat.emissive.setRGB(playerEmissive.r, playerEmissive.g, playerEmissive.b);
  });
}

lobbyAnimating = window.requestAnimationFrame(animateLobby);
SomeObserver.observe(document, { childList: true, subtree: true });

const MainObserverr = new MutationObserver(() => {
  let endmodal = document.querySelector('.end-modal');
  if (!inGame && /kirka[.]io[/]game/.test(window.location.href) && !endmodal) {
    inGame = true;
    window.JSON.stringify = ogStringify;
    window.XMLHttpRequest = boringXMLHttpRequest;
    if (TwitchResizeObserver) TwitchResizeObserver.disconnect();
    if (clockInterval) clockInterval = clearInterval(clockInterval);
    if (timeContainer && seenSkinsListener()) SomeObserver.disconnect();
    stremzInfo = null;
    lobbyAnimating = cancelAnimationFrame(lobbyAnimating);
    if (!animating) animating = window.requestAnimationFrame(animate);
    sniperButton();
  } else if (inGame && (endmodal || !/kirka[.]io[/]game/.test(window.location.href))) {
    inGame = false;
    animating = cancelAnimationFrame(animating);
    window.XMLHttpRequest = gigaXMLHttpRequest;
    SomeObserver.observe(document, { childList: true, subtree: true });
    claimedQuest = false;
    claimedReward = false;
    statsUpdated = false;
    timeContainer = null;
    lobbyAnimating = window.requestAnimationFrame(animateLobby);
    document.onmousedown = null;
    document.onmouseup = null;
    console.dirxml('gg');
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

  window._.mixin({
    afterEvery(cnt, bigBobs) {
      var ogCnt = cnt;
      return function () {
        if (--cnt < 1) {
          cnt = ogCnt;
          return bigBobs.apply(this, arguments);
        }
      };
    },
  });
});

// new adblock
Object.defineProperty(window, 'aiptag', {
  set(_v) {},
  get() {
    return void `
⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠛⠛⠋⠉⠈⠉⠉⠉⠉⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣿⣿⣿⣿
⣿⣿⣿⣿⡏⣀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿
⣿⣿⣿⢏⣴⣿⣷⠀⠀⠀⠀⠀⢾⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿
⣿⣿⣟⣾⣿⡟⠁⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣷⢢⠀⠀⠀⠀⠀⠀⠀⢸⣿
⣿⣿⣿⣿⣟⠀⡴⠄⠀⠀⠀⠀⠀⠀⠙⠻⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⣿
⣿⣿⣿⠟⠻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠶⢴⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⣿
⣿⣁⡀⠀⠀⢰⢠⣦⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⡄⠀⣴⣶⣿⡄⣿
⣿⡋⠀⠀⠀⠎⢸⣿⡆⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⠗⢘⣿⣟⠛⠿⣼
⣿⣿⠋⢀⡌⢰⣿⡿⢿⡀⠀⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⡇⠀⢸⣿⣿⣧⢀⣼
⣿⣿⣷⢻⠄⠘⠛⠋⠛⠃⠀⠀⠀⠀⠀⢿⣧⠈⠉⠙⠛⠋⠀⠀⠀⣿⣿⣿⣿⣿
⣿⣿⣧⠀⠈⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠀⠀⠀⠀⢀⢃⠀⠀⢸⣿⣿⣿⣿
⣿⣿⡿⠀⠴⢗⣠⣤⣴⡶⠶⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡸⠀⣿⣿⣿⣿
⣿⣿⣿⡀⢠⣾⣿⠏⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠉⠀⣿⣿⣿⣿
⣿⣿⣿⣧⠈⢹⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿
⣿⣿⣿⣿⡄⠈⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣦⣄⣀⣀⣀⣀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠙⣿⣿⡟⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠁⠀⠀⠹⣿⠃⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⢐⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠿⠛⠉⠉⠁⠀⢻⣿⡇⠀⠀⠀⠀⠀⠀⢀⠈⣿⣿⡿⠉⠛⠛⠛⠉⠉
⣿⡿⠋⠁⠀⠀⢀⣀⣠⡴⣸⣿⣇⡄⠀⠀⠀⠀⢀⡿⠄⠙⠛⠀⣀⣠⣤⣤⠄⠀`;
  },
});

document.addEventListener('DOMContentLoaded', () => {
  applyCss();
  gui.id = 'gui';

  gui.innerHTML = `
  <style id="BKC-Styles">
  @import url("https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap");
  ${fs.readFileSync(`${settings.get('dirname')}/css/gui.css`)}
  </style>
  ${fs.readFileSync(`${settings.get('dirname')}/html/gui.html`)}
  `;

  //prettier-ignore
  gui.onclick = (e) => {

    if (e.target.className === 'bkc-gui-tabbar-button') {
      gui.querySelectorAll('.module-wrapper > .bkc-menu-tab-active,.bkc-gui-tab > .bkc-menu-tab-active')
        .forEach((activeElements) => activeElements.classList.remove('bkc-menu-tab-active'));
      
      gui.querySelectorAll(`.module-wrapper > .${e.target.id}`)
        .forEach((element) => element.classList.add('bkc-menu-tab-active'));
      
      e.target.classList.add('bkc-menu-tab-active');
      settings.set('activeGuiTab', `${e.target.id}`);
    }

    if (e.target.id === 'ShowTwitch') {
      ShowTwitch = e.target.checked;
      settings.set('ShowTwitch', ShowTwitch);
      let stremz = document.querySelector('#live-streams-menu');
      if (stremz) {
        stremz.style = `
        position:absolute;
        resize:both;
        overflow: auto hidden!important;
        opacity:1!important;
        z-index:3!important;
        min-height:5vh!important;
        pointer-events:all!important;
        top:${TwitchTop};
        left:${TwitchLeft};
        width:${TwitchWidth};
        height:${TwitchHeight};
        display:${ShowTwitch ? 'block' : 'none'}!important;`;
      }
    } 
    
    else if (e.target.id === 'showClanInvites') {
      showClanInvites = e.target.checked;
      settings.set('showClanInvites', showClanInvites);
    } 
      
    else if (e.target.id === 'lobbyRainbow') {
      lobbyRainbow = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'lobbyWeapWire') {
      lobbyWeapWire = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'lobbyWeapHighlight') {
      lobbyWeapHighlight = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'lobbyPlayerHighlight') {
      lobbyPlayerHighlight = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'lobbyPlayerWire') {
      lobbyPlayerWire = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'gameRainbow') {
      gameRainbow = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'gameWeapWire') {
      gameWeapWire = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'gameArmsWire') {
      gameArmsWire = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 

    else if (e.target.id === 'lobbyPlayerVisible') {
      lobbyPlayerVisible = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 

    else if (e.target.id === 'lobbyWeapVisible') {
      lobbyWeapVisible = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'lobbyShadowVisible') {
      lobbyShadowVisible = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'gameWeapHighlight') {
      gameWeapHighlight = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'gameArmsHighlight') {
      gameArmsHighlight = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'gameMuzzleHighlight') {
      gameMuzzleHighlight = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'gameArmsTexture') {
      gameArmsTexture = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'gameWeapTexture') {
      gameWeapTexture = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'lobbyWeapTexture') {
      lobbyWeapTexture = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'lobbyPlayerTexture') {
      lobbyPlayerTexture = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    } 
      
    else if (e.target.id === 'gameFlagHighlight') {
      gameFlagHighlight = e.target.checked;
      settings.set(`${e.target.id}`, e.target.checked);
    }
      
    else if (e.target.id === 'Bkc-export') {
      let gameSettingsObj = {};
      for (let key in localStorage) {
        if (key.startsWith('m')) {
          if (localStorage[key].startsWith('"') && localStorage[key].endsWith('"')) {
            gameSettingsObj[key] = localStorage[key].slice(1, -1);
          } else {
            gameSettingsObj[key] = localStorage[key];
          }
        }
      }
      clipboard.writeText(JSON.stringify(gameSettingsObj, null, 2));
      BKC.tip('Exported Settings To Clipboard');
    } 
      
    else if (e.target.id === 'Bkc-import') {
      let data = JSON.parse(clipboard.readText());
      if (data) {
        Object.assign(localStorage, data);
        window.location.reload();
      }
    }
      
    else if (e.target.id === 'Bkc-import-file') {
      document.querySelector('#Bkc-import-file-input').click();
    }
      
    else if (e.target.id === 'Bkc-export-file') {
      let gameSettingsObj = {};
      for (let key in localStorage) {
        if (key.startsWith('m')) {
          if (localStorage[key].startsWith('"') && localStorage[key].endsWith('"')) {
            gameSettingsObj[key] = localStorage[key].slice(1, -1);
          } else {
            gameSettingsObj[key] = localStorage[key];
          }
        }
      } 
      let eo = document.createElement('a');
      eo.href = URL.createObjectURL(new Blob([JSON.stringify(gameSettingsObj, null, 2)], {type: 'application/json'}));
      eo.download = "Kirka-Settings.json";
      eo.click();
    } 
      
    else if (e.target.id === 'randomskin') {
      randomFavoriteSkins = e.target.checked;
      settings.set('randomFavoriteSkins', randomFavoriteSkins);
    } 
      
    else if (e.target.id === 'crosshair') {
      permCrosshair = e.target.checked;
      settings.set('permCrosshair', permCrosshair);
      permCrosshairToggleFunc();
    } 
    
    else if (e.target.id === 'hideflag') {
      hideFlagAds = e.target.checked;
      settings.set('hideFlagAds', hideFlagAds);
      if (hideFlagAds && window.mWnwM?.mWnwM?.room?.name === 'PointRoom') {
        document.onmousedown = hideFlagAdsFunc;
        document.onmouseup = hideFlagAdsFunc;
      } else {
        document.onmousedown = null;
        document.onmouseup = null;
      }
    } 
    
    else if (e.target.id === 'highlight') {
      gamePlayerHighLight = e.target.checked;
      settings.set('gamePlayerHighLight', gamePlayerHighLight);
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
    
    else if (e.target.id === 'extraAdsZoomHold') {
      extraAdsZoomHold = e.target.checked;
      settings.set('extraAdsZoomHold', extraAdsZoomHold);
    } 
    
    else if (e.target.id === 'globalChatOpenSocket') {
      globalChatOpenSocket = e.target.checked;
      settings.set('globalChatOpenSocket', globalChatOpenSocket);
      if (globalChatOpenSocket) {
        if (!WebRocket.socket) WebRocket.connect();
        return;
      }
      if (WebRocket?.socket instanceof WebSocket) return WebRocket.disconnect();
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

  //prettier-ignore
  gui.style = `display:none;width:${
    typeof settings.get('guiWidth') === 'undefined' ? '51%' : settings.get('guiWidth')
    };height:${
    typeof settings.get('guiHeight') === 'undefined' ? '95%' : settings.get('guiHeight')
    };`;

  gui = document.body.appendChild(gui);

  let activeGuiTab = typeof settings.get('activeGuiTab') === 'undefined' ? 'bkc-tab-game' : settings.get('activeGuiTab');

  //prettier-ignore
  gui.querySelectorAll('.module-wrapper > .bkc-menu-tab-active,.bkc-gui-tab > .bkc-menu-tab-active')
    .forEach((activeElements) => activeElements.classList.remove('bkc-menu-tab-active'));

  //prettier-i-hate-you
  //prettier-ignore
  gui.querySelectorAll(`.bkc-gui-tab > #${activeGuiTab},.module-wrapper > .${activeGuiTab}`)
    .forEach((element) => element.classList.add('bkc-menu-tab-active'));

  permcrossstyle = gui.querySelector('#BKC-permcrosshair');
  permCrosshairToggleFunc();

  function guiOnInput(e) {
    if (e.target.value) {
      let settingValue = e.target.value;
      let settingTarget = e.target.id;
      // prettier-u-turned-it-into-a-brick
      if (e.target.id === 'lobbyWeapColor') {
        lobbyWeapColor = wParamTolParam(settingValue);
        settings.set(`${settingTarget}`, settingValue);
      } else if (e.target.id === 'lobbyPlayerColor') {
        lobbyPlayerColor = wParamTolParam(settingValue);
        settings.set(`${settingTarget}`, settingValue);
      } else if (e.target.id === 'gameWeapColor') {
        gameWeapColor = wParamTolParam(settingValue);
        settings.set(`${settingTarget}`, settingValue);
      } else if (e.target.id === 'gameArmsColor') {
        gameArmsColor = wParamTolParam(settingValue);
        settings.set(`${settingTarget}`, settingValue);
      } else if (e.target.id === 'gameMuzzleColor') {
        gameMuzzleColor = wParamTolParam(settingValue);
        settings.set(`${settingTarget}`, settingValue);
      } else if (e.target.id === 'teamHighlightColor') {
        teamHighlightColor = wParamTolParam(settingValue);
        settings.set(`${settingTarget}`, settingValue);
      } else if (e.target.id === 'enemyHighlightColor') {
        enemyHighlightColor = wParamTolParam(settingValue);
        settings.set(`${settingTarget}`, settingValue);
      } else if (e.target.id === 'gameFlagColor') {
        gameFlagColor = wParamTolParam(settingValue);
        settings.set(`${settingTarget}`, settingValue);
      } else if (e.target.id === 'extraAdsZoomAmount') {
        extraAdsZoomAmount = Number(settingValue);
        extraAdsZoomAmountSpan.innerText = extraAdsZoomAmount;
        if (inGame && window.mWnwM?.mWnwM?.room?.name !== 'MapEditorRoom') {
          let z = window.mWnwM?.renderingSystem.camera.scale;
          if (z) z.z = extraAdsZoomAmount;
        }
        settings.set(`${settingTarget}`, settingValue);
      } else if (e.target.id === 'Bkc-import-file-input') {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (ee) => {
          let data = JSON.parse(ee.target.result);
          if (data) {
            Object.assign(localStorage, data);
            window.location.reload();
          }
        };
        reader.onerror = () => BKC.tip('Failed Importing File');
      } else if (e.target === nerfChatLenghtInput) {
        nerfChatLenght = Math.ceil(e.target.value);
        if (nerfChatLenghtSpan.innerText !== nerfChatLenght) nerfChatLenghtSpan.innerText = nerfChatLenght;
        settings.set('nerfChatLenght', nerfChatLenght);
      } else if (e.target === cssSelect && cssSelect.value) {
        cssLinks.currentCss = cssLinks[cssSelect.options[cssSelect.selectedIndex].title];
        resetCssWrapper();
        settings.set('cssLinks', cssLinks);
        applyCss();
      } else if (e.target === cssFilePicker && cssFilePicker.value) {
        if (cssFilePicker.files[0].type === 'text/css') {
          cssUrlInput.value = `file:///${cssFilePicker.files[0].path.replace(/\\/g, '/')}`;
        } else {
          BKC.tip('Invalid FileType');
        }
      }
    }
  }

  function guiinput(e) {
    if (window._?.throttle) {
      if (!lessLaggyGuiOnInput)
        lessLaggyGuiOnInput = window._.throttle(guiOnInput, 100, {
          leading: false,
        });
      lessLaggyGuiOnInput(e);
    }
  }

  let lobbyWeapColorElem = document.getElementById('lobbyWeapColor');
  let lobbyPlayerColorElem = document.getElementById('lobbyPlayerColor');
  let gameWeapColorElem = document.getElementById('gameWeapColor');
  let gameArmsColorElem = document.getElementById('gameArmsColor');
  let gameMuzzleColorElem = document.getElementById('gameMuzzleColor');
  let customEnemyColorElem = document.getElementById('enemyHighlightColor');
  let customTeamColorElem = document.getElementById('teamHighlightColor');
  let gameFlagColorElem = document.getElementById('gameFlagColor');

  lobbyWeapColorElem.value = lobbyWeapColor;
  lobbyPlayerColorElem.value = lobbyPlayerColor;
  gameWeapColorElem.value = gameWeapColor;
  gameArmsColorElem.value = gameArmsColor;
  gameMuzzleColorElem.value = gameMuzzleColor;
  customEnemyColorElem.value = enemyHighlightColor;
  customTeamColorElem.value = teamHighlightColor;
  gameFlagColorElem.value = gameFlagColor;

  lobbyWeapColor = wParamTolParam(lobbyWeapColor);
  lobbyPlayerColor = wParamTolParam(lobbyPlayerColor);
  gameWeapColor = wParamTolParam(gameWeapColor);
  gameArmsColor = wParamTolParam(gameArmsColor);
  gameMuzzleColor = wParamTolParam(gameMuzzleColor);
  enemyHighlightColor = wParamTolParam(enemyHighlightColor);
  teamHighlightColor = wParamTolParam(teamHighlightColor);
  gameFlagColor = wParamTolParam(gameFlagColor);

  let nerfChatLenghtInput = document.getElementById('nerfChatLenght');
  let nerfChatLenghtSpan = document.getElementById('nerfChatLenghtSpan');
  let globalChatVisibleToggleKeyElem = document.getElementById('globalChatVisibleToggleKey');
  let globalChatInputToggleKeyElem = document.getElementById('globalChatInputToggleKey');
  let extraAdsZoomKeyElem = document.getElementById('extraAdsZoomKey');
  let extraAdsZoomAmountElem = document.getElementById('extraAdsZoomAmount');
  let extraAdsZoomAmountSpan = document.getElementById('extraAdsZoomAmountSpan');

  nerfChatLenghtInput.value = nerfChatLenght;
  extraAdsZoomAmountElem.value = extraAdsZoomAmount;
  extraAdsZoomKeyElem.value = extraAdsZoomKey;
  globalChatVisibleToggleKeyElem.value = globalChatVisibleToggleKey;
  globalChatInputToggleKeyElem.value = globalChatInputToggleKey;

  nerfChatLenghtSpan.innerText = nerfChatLenght;
  extraAdsZoomAmountSpan.innerText = extraAdsZoomAmount;

  function getKeyCodeButton(e) {
    let zKey = e?.code || e?.button;
    let Key = e?.key;
    if (e.target === extraAdsZoomKeyElem && zKey) {
      extraAdsZoomKey = e?.code || e.button;
      extraAdsZoomKeyElem.value = extraAdsZoomKey;
      extraAdsZoomKeyElem.blur();
      return settings.set('extraAdsZoomKey', extraAdsZoomKey);
    }
    if (!Key) return;
    if (e.target === globalChatInputToggleKeyElem) {
      globalChatInputToggleKey = Key;
      globalChatInputToggleKeyElem.value = Key;
    } else if (e.target === globalChatVisibleToggleKeyElem) {
      globalChatVisibleToggleKey = Key;
      globalChatVisibleToggleKeyElem.value = Key;
    }
    settings.set(`${e.target}`, Key);
  }

  function clearInputs(e) {
    if (e.button === 0 && [extraAdsZoomKeyElem, globalChatInputToggleKeyElem, globalChatVisibleToggleKeyElem].includes(e.target)) e.target.value = '';
  }

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
    fbtn.onfocus = () => {
      function toggleInputDisabled(state) {
        document.querySelectorAll('.input').forEach((input) => {
          if (input === fbtn) return;
          if (state && typeof input.defaultDisabled !== 'undefined') return (input.disabled = input.defaultDisabled);
          if (!input.defaultDisabled) input.defaultDisabled = input.disabled;
          input.disabled = true;
        });
      }
      toggleInputDisabled();
      t.parentElement.nextElementSibling.classList.add('bkc-searching');
      fbtn.onkeyup = (evt) => {
        if (evt.key !== 'Enter') return;
        window.find(evt.target.value, false, false, true, false, true);
        scrollIntoViewIfNeeded(window.getSelection());
      };
      fbtn.onblur = () => {
        t.parentElement.nextElementSibling.classList.remove('bkc-searching');
        toggleInputDisabled(true);
        fbtn.onblur = null;
        fbtn.onkeyup = null;
      };
    };
  }

  function addNewCssOption(obj, set) {
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
    for (const cssOptions in cssLinks) {
      if (cssLinks[cssOptions] !== cssLinks.currentCss) addNewCssOption(cssLinks[cssOptions]);
    }
    cssSelect = document.querySelector('#custom-css-wrapper').appendChild(cssSelect);
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

  document.getElementById('crosshair').checked = permCrosshair;
  document.getElementById('hideflag').checked = hideFlagAds;
  document.getElementById('highlight').checked = gamePlayerHighLight;
  document.getElementById('customCSS').checked = customCss;
  document.getElementById('ShowTwitch').checked = ShowTwitch;
  document.getElementById('fpsCap').checked = fpsCap;
  document.getElementById('extraAdsZoomHold').checked = extraAdsZoomHold;
  document.getElementById('globalChatOpenSocket').checked = globalChatOpenSocket;
  document.getElementById('capture').checked = capture;
  document.getElementById('randomskin').checked = randomFavoriteSkins;
  document.getElementById('showClanInvites').checked = showClanInvites;
  document.getElementById('lobbyPlayerVisible').checked = lobbyPlayerVisible;
  document.getElementById('lobbyWeapVisible').checked = lobbyWeapVisible;
  document.getElementById('lobbyShadowVisible').checked = lobbyShadowVisible;
  document.getElementById('lobbyRainbow').checked = lobbyRainbow;
  document.getElementById('lobbyWeapWire').checked = lobbyWeapWire;
  document.getElementById('lobbyPlayerWire').checked = lobbyPlayerWire;
  document.getElementById('lobbyPlayerHighlight').checked = lobbyPlayerHighlight;
  document.getElementById('lobbyWeapHighlight').checked = lobbyWeapHighlight;
  document.getElementById('gameWeapHighlight').checked = gameWeapHighlight;
  document.getElementById('gameArmsHighlight').checked = gameArmsHighlight;
  document.getElementById('gameMuzzleHighlight').checked = gameMuzzleHighlight;
  document.getElementById('gameArmsTexture').checked = gameArmsTexture;
  document.getElementById('gameWeapTexture').checked = gameWeapTexture;
  document.getElementById('lobbyWeapTexture').checked = lobbyWeapTexture;
  document.getElementById('lobbyPlayerTexture').checked = lobbyPlayerTexture;
  document.getElementById('gameRainbow').checked = gameRainbow;
  document.getElementById('gameWeapWire').checked = gameWeapWire;
  document.getElementById('gameArmsWire').checked = gameArmsWire;
  document.getElementById('gameFlagHighlight').checked = gameFlagHighlight;

  function keydown(e) {
    if (!e.repeat && e.key === 'PageUp') {
      e.preventDefault();
      toggleGui();
    }
  }

  document.addEventListener('keydown', keydown, false);

  function cssAddFromDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    cssDropEnd();
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
      if (!GuiResizeObserver) GuiResizeObserver = new ResizeObserver(SaveGuiSize);
      GuiResizeObserver.observe(gui);
      gui.addEventListener('drop', cssAddFromDrop, false);
      gui.addEventListener('dragover', cssWhileDrop, false);
      gui.addEventListener('dragenter', cssWhileDrop, false);
      gui.addEventListener('dragleave', cssDropEnd, false);
      gui.onkeyup = getKeyCodeButton;
      gui.onmousedown = clearInputs;
      extraAdsZoomKeyElem.onmouseup = getKeyCodeButton;
      gui.oninput = guiinput;
    } else {
      GuiResizeObserver.disconnect();
      gui.style.display = 'none';
      gui.removeEventListener('drop', cssAddFromDrop, false);
      gui.removeEventListener('dragover', cssWhileDrop, false);
      gui.removeEventListener('dragenter', cssWhileDrop, false);
      gui.removeEventListener('dragleave', cssDropEnd, false);
      gui.onkeyup = null;
      gui.onmousedown = null;
      extraAdsZoomKeyElem.onmouseup = null;
      gui.oninput = null;
    }
    settings.set('menuOpen', menuVisible);
  }
});

/*function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}*/

function wParamTolParam(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null;
}

const proxy = Function.prototype.constructor;

Function.prototype.constructor = function (...args) {
  if (args[0] === 'while (true) {}' || args[0] === 'debugger') return proxy.apply(this);
  return proxy.apply(this, arguments);
};

function scrollIntoViewIfNeeded(selection) {
  function getScrollableNode(o) {
    if (o?.nodeType === 1) return o;
    if (!o?.previousSibling) return;
    return getScrollableNode(o.previousSibling);
  }

  if (typeof selection !== 'object') return;
  selection = selection.getRangeAt(0).cloneRange().startContainer;
  if (selection.nodeType === 1) selection = selection.childNodes[selection.startOffset];

  selection = getScrollableNode(selection) || selection?.parentNode;
  if (selection) selection.scrollIntoViewIfNeeded();
  return selection;
}

function permCrosshairToggleFunc() {
  if (permCrosshair) {
    permcrossstyle.innerHTML = `
    img#crosshair-static {
      opacity:1!important;
      visibility:visible!important;
      display:block!important;
    }`;
  } else {
    permcrossstyle.innerHTML = '';
  }
}

function getRGBcycle() {
  if (rrr > 0 && bbb === 0) {
    rrr--;
    ggg++;
  }
  if (ggg > 0 && rrr === 0) {
    ggg--;
    bbb++;
  }
  if (bbb > 0 && ggg === 0) {
    rrr++;
    bbb--;
  }
  return {
    r: rrr / 255,
    g: ggg / 255,
    b: bbb / 255,
  };
}

function osuClassic(mat, image) {
  let i = new Image();
  i.src = image;
  mat.map.version = 0;
  let t = mat.map.clone();
  t.image = i;
  mat.map = t;
  mat.map.version = 1;
  return mat;
}

function animate() {
  if (!inGame || window.mWnwM?.mWnwM?.room?.name === 'MapEditorRoom') {
    animating = window.cancelAnimationFrame(animate);
    return;
  }

  animating = window.requestAnimationFrame(animate);

  let peanutMnMs = window.mWnwM?.WMmNw._components;
  if (!peanutMnMs) return;
  let rgbColor = gameRainbow ? getRGBcycle() : null;
  let sisManager = window.mWnwM?.mWnwM?.systemManager._systems;
  let localPlayerClass = peanutMnMs[38]?.wnWmN;
  let muzzleFlash = peanutMnMs[window._.findKey(peanutMnMs, 'model')]?.model.children[2]?.children.find((Muzzle) => Muzzle.name === 'Muzzle').children[0];
  let megaWeapMap = peanutMnMs[window._.findKey(peanutMnMs, 'weapons')]?.weapons;
  let muzzleFlashMat = muzzleFlash?.material;
  if (muzzleFlashMat && window.mWnwM.mWnwM.systemManager._executeSystems[0].mouse?.btns[0]) {
    if (!defaultsMap.has(muzzleFlash)) {
      defaultsMap.set(muzzleFlash, {
        color: {
          b: muzzleFlashMat.color.b,
          g: muzzleFlashMat.color.g,
          r: muzzleFlashMat.color.r,
        },
      });
    }
    let muzzlecolor = gameMuzzleHighlight ? rgbColor || gameMuzzleColor : defaultsMap.get(muzzleFlash).color;
    if (!muzzleFlashMat.color.equals(muzzlecolor)) muzzleFlashMat.color.setRGB(muzzlecolor.r, muzzlecolor.g, muzzlecolor.b);
  }

  if (megaWeapMap)
    [Object.keys(megaWeapMap).find((models) => megaWeapMap[models]?.removed === false)].forEach((weap) => {
      let yourWeapon = megaWeapMap[weap]?.model;
      let yourWeaponMat = yourWeapon?.children[yourWeapon.children.length - 1].material;
      let yourWeaponMapImg = yourWeaponMat?.map?.image;
      if (yourWeaponMapImg) {
        if (!defaultsMap.has(yourWeapon)) {
          defaultsMap.set(yourWeapon, {
            color: {
              b: yourWeaponMat.color.b,
              g: yourWeaponMat.color.g,
              r: yourWeaponMat.color.r,
            },
            src: yourWeaponMapImg.src,
          });
        }

        let weapDefaults = defaultsMap.get(yourWeapon);
        let weapColor = gameWeapHighlight ? rgbColor || gameWeapColor : weapDefaults.color;
        let currMapSrc = weapColor !== weapDefaults.color && !gameWeapTexture ? cookiezi : weapDefaults.src;
        if (yourWeaponMat.wireframe !== gameWeapWire) yourWeaponMat.wireframe = gameWeapWire;
        if (yourWeaponMapImg.src !== currMapSrc) yourWeaponMat = osuClassic(yourWeaponMat, currMapSrc);
        if (!yourWeaponMat.color.equals(weapColor)) yourWeaponMat.color.setRGB(weapColor.r, weapColor.g, weapColor.b);
      }
    });

  if (!sisManager) return;

  let arms = sisManager[0]?.queries.player.results[0]._components[window._.findKey(sisManager[0].queries.player.results[0]._components, 'model')]?.model;

  if (window.mWnwM.mWnwM?.room?.name === 'PointRoom') {
    let flagMaterial =
      window.mWnwM.mWnwM.systemManager._executeSystems[2].wMNWn?.material ||
      window.mWnwM.renderingSystem.scene.children.find((type) => type?.type === 'Sprite' && type.material.map?.image?.width === 149)?.material;
    if (flagMaterial) {
      let flagColor = gameFlagHighlight ? gameFlagColor : { b: 1, r: 1, g: 1 };
      if (!flagMaterial.color.equals(flagColor)) flagMaterial.color.setRGB(flagColor.r, flagColor.g, flagColor.b);
    }
  }

  if (arms?.children[0]?.visible) {
    let armsMat = arms.children[0]?.material;
    let armsMatMapImg = armsMat?.map?.image;
    if (armsMatMapImg) {
      if (!defaultsMap.has(arms)) {
        defaultsMap.set(arms, {
          color: {
            b: armsMat.color.b,
            g: armsMat.color.g,
            r: armsMat.color.r,
          },
          src: armsMatMapImg.src,
        });
      }
      let armsDefaults = defaultsMap.get(arms);
      let armsColor = gameArmsHighlight ? rgbColor || gameArmsColor : armsDefaults.color;
      let armsImg = armsColor !== armsDefaults.color && !gameArmsTexture ? cookiezi : armsDefaults.src;
      if (armsMat.wireframe !== gameArmsWire) armsMat.wireframe = gameArmsWire;
      if (armsMatMapImg.src !== armsImg) armsMat = osuClassic(armsMat, armsImg);
      if (!armsMat.color.equals(armsColor)) armsMat.color.setRGB(armsColor.r, armsColor.g, armsColor.b);
    }
  }

  let otherPlayers = sisManager[2]?._queries?.players?.entities || sisManager[3]._queries.players?.entities;
  if (!otherPlayers) return;
  let otherPlayersMap = window.mWnwM.mWnwM.room.state.players.$items;
  otherPlayers.forEach((players) => {
    let player = players._components;
    let mat = player[0].value.children[0].children[0].children[1].material;
    if (!mat) return;

    if (!defaultsMap.has(player))
      defaultsMap.set(player, {
        color: {
          b: mat.color.b,
          g: mat.color.g,
          r: mat.color.r,
        },
      });

    if (gamePlayerHighLight) {
      if (!localPlayerClass.team || localPlayerClass.team !== player['50'].team) {
        if (otherPlayersMap.get(player['50'].sessionId).spawnProtected === false) {
          if (!mat.color.equals(enemyHighlightColor)) {
            mat.color.setRGB(enemyHighlightColor.r, enemyHighlightColor.g, enemyHighlightColor.b);
          }
        } else {
          mat.color.fromArray([1, 0, 0], 0);
        }
      } else if (!mat.color.equals(teamHighlightColor)) {
        mat.color.setRGB(teamHighlightColor.r, teamHighlightColor.g, teamHighlightColor.b);
      }
    } else {
      let playerDefaults = defaultsMap.get(player);
      if (mat.color.equals(playerDefaults.color)) return;
      mat.color.setRGB(playerDefaults.color.r, playerDefaults.color.g, playerDefaults.color.b);
    }
  });
}

function hideFlagAdsFunc() {
  if (window.mWnwM?.mWnwM?.room.name === 'PointRoom') {
    let flagMaterial =
      window.mWnwM?.mWnwM.systemManager._executeSystems[2].wMNWn?.material ||
      window.mWnwM?.renderingSystem.scene.children.find((type) => type?.type === 'Sprite' && type.material.map?.image?.width === 149)?.material;
    if (hideFlagAds) {
      flagMaterial.visible = !window.mWnwM.mWnwM.systemManager._executeSystems[0].mouse?.btns[2];
    } else {
      flagMaterial.visible = true;
    }
  }
}

function SetGameModesCheckBoxes() {
  let Sessionids = [];

  function pointsFlagAndChill(e, setting) {
    if (e.target?.className?.animVal === 'bkc-option') {
      document.onmousedown = null;
      let r = e.target.getAttribute('value');
      this.p.style.display = 'none';
      this.w.value = r;
      this.l.value = r;
      return r;
    }

    if (e.target?.className === 'bkc-region-option') {
      document.onmousedown = null;
      let r = e.target.innerText;
      this.a.innerText = r;
      this.p.style.display = 'none';
      return r;
    }

    if (e.target === this.g) {
      document.onmousedown = (ee) => {
        if (!ee.path.includes(this.g)) {
          document.onmousedown = null;
          this.p.style.display = 'none';
        }
      };

      if (this.p.style.display !== 'flex') {
        this.p.style.display = 'flex';
        if (bkcRegion !== e.target) {
          let left = this.g.offsetLeft;
          if (this.g === bkcMinTime) ++left;
          this.p.style.left = left + 'px';
          this.p.style.top = bkcMinSelect.offsetHeight + bkcMinSelect.offsetTop + 'px';
        }
      } else {
        this.p.style.display = 'none';
        document.onmousedown = null;
      }
    }
    return setting;
  }

  function ShowHideGameModes() {
    let servers = document.querySelector('div#view > div.background > div.container > div.content > div.servers').__vue__;
    let rooms = window.app.__vue__.$store._modules.root.state.game.rooms;
    document.querySelectorAll('div.servers div.container-games div.list-cont div.list div.server .map').forEach((map, _indexfoxx) => {
      let mapText = map.innerText;
      map = map.parentElement.parentElement;
      function getsessionid() {
        if (currentRoom.metadata.custom === true) {
          let s = left?.querySelector('#bkc-session-id');
          if (currentRoom?.roomId) {
            if (!s) {
              s = document.createElement('div');
              s.setAttribute(map.attributes[0].name, '');
              s.className = 'session-id';
              s.innerHTML = currentRoom.roomId;
              s.id = 'bkc-session-id';
              if (!timesSpan) s = left.appendChild(s);
              else s = left.insertBefore(s, timesSpan);
            } else if (s.innerHTML !== currentRoom.roomId) s.innerHTML = currentRoom.roomId;
            return s;
          }
        } else {
          let p;
          let s = left?.querySelectorAll('div.session-id');
          s.forEach((troll) => {
            if (troll?.id === 'bkc-session-id') left.removeChild(troll);
            else p = troll;
          });
          return p;
        }
      }

      let right = map?.querySelector('div.right');
      let left = map?.querySelector('div.left');
      let q = left.querySelector('div.session-id')?.innerHTML;
      let currentRoom = !servers.activeTab ? rooms.find((a) => a.roomId === q) : rooms.find((a) => a?.metadata?.serverName?.trim() === mapText);
      if (!currentRoom) return;
      let bkcJwfCheckBox = right?.querySelector('#bkc-JWF-cb');
      let playerCnt = right?.querySelector('div.online');
      let timesSpan = left?.querySelector('span#bkc-map-time');
      let sessionIdDiv = getsessionid();
      let ThisIdd = sessionIdDiv?.innerHTML;
      let mins = servers.minutesLeft(currentRoom);
      let milliMins = mins.split(' ')[0];
      let longMins = !Number.isNaN(milliMins) ? Number(milliMins) : mins;
      let shortMins = longMins > 0 ? `${longMins} ${longMins !== 1 ? 'mins' : 'min'}` : longMins === 'In Warmup' ? 'warmup' : 'finished';

      if ((currentRoom.clients < minPlayers || (longMins !== 'In Warmup' && longMins < minTime) || shortMins === 'finished') && currentRoom.locked !== true) {
        currentRoom.locked = true;
        rooms.push(rooms.splice(rooms.indexOf(currentRoom), 1)[0]);
      }

      if (!Number.isNaN(currentRoom.clients + currentRoom.maxClients)) {
        if (currentRoom.clients >= minPlayers && currentRoom.clients < currentRoom.maxClients && !currentRoom.locked) {
          if (playerCnt.style.color !== 'var(--green-1)') playerCnt.style.color = 'var(--green-1)';
          if (playerCnt?.title !== 'available') playerCnt.title = 'available';
        } else if (currentRoom.clients < minPlayers) {
          if (playerCnt.style.color !== 'var(--red-3)') playerCnt.style.color = 'var(--red-3)';
          if (playerCnt?.title !== 'below min players') playerCnt.title = 'below min players';
        } else {
          if (playerCnt.style.color !== 'var(--primary-1)') playerCnt.style.color = 'var(--primary-1)';
          if (playerCnt?.title !== 'below min time, lobby full or game has ended') playerCnt.title = 'below min time, lobby full or game has ended';
        }
      }

      if (right) {
        if (!bkcJwfCheckBox) {
          var x = document.createElement('INPUT');
          x.type = 'checkbox';
          x.className = 'input-checkbox  button';
          x.id = 'bkc-JWF-cb';
          x.title = 'Join Lobby When Available';
          right.appendChild(x);
          x.addEventListener('change', function () {
            let thisId = this.parentElement.parentElement.getElementsByClassName('session-id')[0].innerHTML;
            if (this.checked) {
              if (thisId && !Sessionids.includes(thisId)) Sessionids.unshift(thisId);
            } else {
              let index = Sessionids.indexOf(thisId);
              if (index > -1) Sessionids.splice(index, 1);
            }
          });
        } else if (Sessionids.length) {
          if (Sessionids.includes(ThisIdd)) {
            bkcJwfCheckBox.checked = true;
            if (!map.classList.contains('locked')) map.getElementsByClassName('button join')[0].click();
          } else bkcJwfCheckBox.checked = false;
        }
      }
      if (ThisIdd) {
        if (!timesSpan) {
          let teatime = document.createElement('span');
          teatime.id = 'bkc-map-time';
          teatime.innerHTML = shortMins;
          left.appendChild(teatime);
        } else if (timesSpan.innerHTML !== shortMins) timesSpan.innerHTML = shortMins;
      }
    });

    if (this.a && this.a?.innerText !== servers.selectedRegion) {
      this.a.innerText = servers.selectedRegion;
      this.p.className = `server-${servers.selectedRegion}`;
    }
  }

  let server = document.querySelector('#view div.background div.container div.content div.servers');
  let list = server?.querySelector('div.container-games div.list-cont div.list');
  if (!list || document.querySelector('#bkc-minmax-selects')) return;

  let app = document.querySelector('#app');
  let modesCont = document.createElement('div');
  let bkcMinSelect = document.createElement('div');
  let bkcRegion = document.createElement('div');
  let bkcRegionSpan = bkcRegion.appendChild(document.createElement('span'));
  bkcRegion.id = 'bkc-regional-menu';
  modesCont.className = 'mods tabmods';
  let bkcRegionDropdown = bkcRegion.appendChild(
    (() => {
      let menu = document.createElement('div');
      menu.id = 'bkc-region-dropdown';
      let pp = app.__vue__.$children.find((a) => a?.canFilterRegions).canFilterRegions;
      Object.keys(pp).forEach((g) => {
        let p = document.createElement('div');
        p.id = pp[g].type;
        p.className = 'bkc-region-option';
        p.innerHTML = pp[g].type;
        menu.appendChild(p);
      });
      return menu;
    })()
  );

  let rgion = document.querySelector('#play').__vue__.$options.parent?.selectedRegion;
  bkcRegionSpan.innerText = rgion || '....';
  bkcRegionDropdown.className = rgion ? `server-${rgion}` : '';
  bkcMinSelect.id = 'bkc-minmax-selects';
  bkcMinSelect.innerHTML = getBkcMinSelectInnerHtml();

  let currentModes = server.__vue__.defaultModeOptions.map((a) => a.value);

  function updateModes() {
    server.__vue__.WnMNwes = Object.keys(GameModes).filter((a) => GameModes[a]);
  }

  currentModes.forEach((a) => {
    if (typeof GameModes[a] === 'undefined') GameModes[a] = true;
  });

  Object.keys(GameModes).forEach((mode) => {
    if (!currentModes.includes(mode)) return delete GameModes[mode];
    let moddiv = document.createElement('div');
    moddiv.className = mode;
    moddiv.innerHTML = `
    <label for="${mode}" class="custom-checkbox checkbox-size">
    <input name="${mode}" id="${mode}" type="checkbox" class="${mode}-checkbox">
    <span> ${mode} </span>
    </label>
    `;
    moddiv = modesCont.appendChild(moddiv);
    modesCont.getElementsByClassName(`${mode}-checkbox`)[0].checked = GameModes[mode];
  });

  settings.set('GameModes', GameModes);
  updateModes();

  let tabs = list.parentElement.querySelector('.tabs');
  let filters = document.querySelector('.filters');
  let filtersLabel = filters.querySelector('.filter-name label');
  let filtersInput = filters.querySelector('.filter-name input');
  let dataV = tabs.firstChild.getAttributeNames().join('').split('class').join('');
  Object.keys(filtersInput.dataset).forEach((a) => filtersInput.removeAttribute(`data-${a}`));
  Object.keys(filtersLabel.dataset).forEach((a) => filtersLabel.removeAttribute(`data-${a}`));
  filtersLabel.setAttribute(dataV, '');
  filtersInput.setAttribute(dataV, '');
  filtersLabel.classList.add('tab');
  filtersInput.classList.add('text-2');
  filters.removeChild(filters.lastChild);
  bkcRegion = tabs.appendChild(bkcRegion);
  tabs.appendChild(filtersLabel);

  modesCont = bkcMinSelect.appendChild(modesCont);

  let bkcMinPlayers = bkcMinSelect.querySelector('#bkc-minmax-left');
  let bkcMinTime = bkcMinSelect.querySelector('#bkc-minmax-right');
  let bkcMinTimeValueInput = bkcMinTime.querySelector('.bkc-min-players-time-text');
  let bkcMinPlayersValueInput = bkcMinPlayers.querySelector('.bkc-min-players-time-text');
  let bkcMinPlayersSlider = bkcMinPlayers.querySelector('#bkc-min-players');
  let bkcMinTimeSlider = bkcMinTime.querySelector('#bkc-min-time');

  bkcMinPlayersSlider.value = minPlayers;
  bkcMinPlayersValueInput.value = minPlayers;
  bkcMinTimeSlider.value = minTime;
  bkcMinTimeValueInput.value = minTime;

  let _8minPowerNap = new Map([
    [
      bkcMinPlayers,
      {
        g: bkcMinPlayers,
        p: bkcMinPlayers.querySelector('.bkc-gamemodes-players-dropdown'),
        l: bkcMinPlayersValueInput,
        w: bkcMinPlayersSlider,
      },
    ],
    [
      bkcMinTime,
      {
        g: bkcMinTime,
        p: bkcMinTime.querySelector('.bkc-gamemodes-players-dropdown'),
        l: bkcMinTimeValueInput,
        w: bkcMinTimeSlider,
      },
    ],
    [
      bkcRegion,
      {
        g: bkcRegion,
        p: bkcRegionDropdown,
        a: bkcRegionSpan,
      },
    ],
  ]);

  let boundShowHideGameModes = ShowHideGameModes.bind(_8minPowerNap.get(bkcRegion));

  bkcMinPlayers.onclick = (e) => {
    minPlayers = pointsFlagAndChill.call(_8minPowerNap.get(bkcMinPlayers), e, minPlayers);
    settings.set('minPlayers', minPlayers);
    boundShowHideGameModes();
  };

  bkcMinTime.onclick = (e) => {
    minTime = pointsFlagAndChill.call(_8minPowerNap.get(bkcMinTime), e, minTime);
    settings.set('minTime', minTime);
    boundShowHideGameModes();
  };

  bkcRegion.onclick = (e) => {
    let reg = pointsFlagAndChill.call(_8minPowerNap.get(bkcRegion), e);
    if (reg) {
      bkcRegionDropdown.className = `server-${reg}`;
      let regionals = app.__vue__.$children.find((a) => a?.changeRegion)?.changeRegion;
      if (!regionals) return BKC.tip('cant find changeRegion');
      regionals(reg);
      boundShowHideGameModes();
    }
  };

  bkcRegion.onmouseenter = playHoverAudio;

  bkcMinSelect.addEventListener('input', (event) => {
    if (event.target?.name && typeof GameModes[event.target.name] !== 'undefined') {
      GameModes[event.target.name] = event.target.checked;
      settings.set('GameModes', GameModes);
      updateModes();
    } else if (event.target.id === 'bkc-min-time') {
      minTime = Math.ceil(event.target.value);
      bkcMinTimeValueInput.value = minTime;
      settings.set('minTime', minTime);
    } else if (event.target.id === 'bkc-min-players') {
      minPlayers = Math.ceil(event.target.value);
      bkcMinPlayersValueInput.value = minPlayers;
      settings.set('minPlayers', minPlayers);
    }
    boundShowHideGameModes();
  });
  bkcMinSelect = filters.parentElement.insertBefore(bkcMinSelect, filters);

  new MutationObserver(() => {
    boundShowHideGameModes();
  }).observe(list, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
  });

  let chatGpt = document.querySelector('div.chat-cont > div.chat.chat > div.messages.messages-cont');
  if (!chatGpt) return;

  new MutationObserver(() => {
    if (chatGpt.__vue__.messages.length > nerfChatLenght) chatGpt.__vue__.messages.splice(0, chatGpt.__vue__.messages.length - nerfChatLenght);
  }).observe(chatGpt, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  let showTradeElement = document.createElement('div');
  let chatInput = document.querySelector('#WMNn');
  showTradeElement.style = `
      width: 100%;
      background: linear-gradient(103.28deg,#262f4b 7.06%,#202639 90.75%);
      height: fit-content;
      position: absolute;
      bottom: 3.65rem;
      padding: 0.5rem;
      opacity: 0;
      pointer-events: none;
      transition: all 0.1s ease 0.2s;
      z-index: 999999;
      `;
  showTradeElement.id = 'bkc-show-trade-element';
  showTradeElement = chatInput.parentElement.insertBefore(showTradeElement, chatInput);
  chatGpt.onmouseup = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    for (let i = 0; i < e.path.length; i++) {
      if (!e.path[i].classList?.contains('message')) continue;
      if (!e.path[i].classList?.contains('trade')) break;
      let p = [...e.path[i].querySelectorAll('span')].filter((span) => span.innerText.startsWith('/trade'));
      if (p.length < 1) break;
      chatInput.value = p[0].innerText;
      showTradeElement.innerHTML = e.path[i].innerHTML;
      let Bouton = showTradeElement.querySelector('button');
      Bouton.parentElement.innerHTML = Bouton.innerText;
      showTradeElement.classList.add('show-trade-visible');
      let modalItems = [];
      let buttontxts = [];
      e.path[i].querySelectorAll('button').forEach((but) => buttontxts.push(but.__vue__.$slots.default[0].text));
      chatGpt.__vue__.messages
        .filter((mess) => mess.parts[1])
        .forEach((smallMess) => {
          smallMess.parts.filter((massiveMess) => buttontxts.includes(massiveMess.data.name) && !modalItems.includes(massiveMess.data) && modalItems.push(massiveMess.data));
        });
      showTradeElement.onmousedown = (ere) => {
        if (ere.target.tagName !== 'BUTTON') return;
        let chatblur = chatInput.onblur;
        let calzone = modalItems.findIndex((item) => item.name.toLowerCase() === ere.target.innerText.toLowerCase());
        if (calzone > -1) {
          chatInput.onblur = null;
          chatGpt.__vue__.openModalInspect(modalItems[calzone]);
          ere.target.focus();
          ere.target.onblur = () => {
            ere.target.onblur = null;
            chatInput.focus();
            chatInput.onblur = chatblur;
          };
        }
      };
      chatInput.focus();
      chatInput.onblur = () => {
        chatInput.onblur = null;
        showTradeElement.classList.remove('show-trade-visible');
        if (chatInput.value === p[0].innerText) chatInput.value = '';
      };
      chatGpt.__vue__.resumeAutoScroll();
      break;
    }
  };
}

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
    TwitchTop = TwitchHead.style.top;
    TwitchLeft = TwitchHead.style.left;
    settings.set('TwitchTop', TwitchTop);
    settings.set('TwitchLeft', TwitchLeft);
  }
}

function SaveTwitchSize() {
  TwitchWidth = streamsmenu.style.width;
  TwitchHeight = streamsmenu.style.height;
  streamsmenu.style.setProperty('--bkc-stremz-menu-width', TwitchWidth);
  settings.set('TwitchWidth', TwitchWidth);
  settings.set('TwitchHeight', TwitchHeight);
}

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
Tags:  ${twitchinfo?.tags ? twitchinfo.tags.toString() : ''}
Language:  ${twitchinfo?.language ? twitchinfo.language : ''}
      𝙍𝙞𝙜𝙝𝙩 𝙘𝙡𝙞𝙘𝙠 𝙩𝙤 𝙘𝙤𝙥𝙮 𝙡𝙞𝙣𝙠 𝙩𝙤 𝙘𝙡𝙞𝙥𝙗𝙤𝙖𝙧𝙙 ⠀⠀
    `;

    item.innerHTML = `
    <img src="
    ${data['data'][0].profile_image_url}"
    alt="avatar" class="avatar" style="height: 2.188rem;width: 2.188rem;margin-top: .3rem;border-radius: 20px;border: 2px solid #7235cb;"/>
    <div class="content" style="display: flex;flex-direction: column;align-items: flex-start;margin-left: .7rem;text-shadow: 0 2px 0 rgba(0,0,0,.5);">
    <div id="bkc-twitch-name" style="display: flex;flex-direction: row;flex-wrap: nowrap;align-content: center;justify-content: center;align-items: center;">
    <div style="font-weight: 700;" class="name">${data['data'][0].display_name}</div>
    ${
      data['data'][0].broadcaster_type === 'partner'
        ? `
      <svg width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px" style="fill: rgb(191,148,255);">
      <path fill-rule="evenodd" clip-rule="evenodd" 
      d="M12.5 3.5L8 2L3.5 3.5L2 8L3.5 12.5L8 14L12.5 12.5L14 8L12.5 3.5ZM7.00008 11L11.5 6.5L10 5L7.00008 8L5.5 6.5L4 8L7.00008 11Z"></path>
      </svg>`
        : ''
    }
    </div>
    <div class="count">${twitchinfo.title}</div>
    <div class="count">${viewers} • ${twitchinfo.time}</div>
    </div>`;

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
      <div class="head" style="
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 700;
      text-shadow: 0 3px 1px rgba(0, 0, 0, 0.5);
      border-bottom: 2px solid #191919;
      padding: 10px 10px 10px 1rem;
      background: var(--secondary-2)
      ">
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

async function getStats() {
  if (typeof window.view.__vue__?.user !== 'object') return 'NAAHHHH AINTNOWAY';

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

  if (randomFavoriteSkins) await window.app.__vue__.$store._actions['user/getInventory'][0]();

  if (!allFavoriteSkins[id]) {
    allFavoriteSkins[id] = {
      SCAR: [],
      Shark: [],
      Revolver: [],
      M60: [],
      MAC10: [],
      LAR: [],
      Bayonet: [],
      VITA: [],
      Weatie: [],
      AR9: [],
      Tomahawk: [],
      BODY_SKIN: [],
      Selected: [],
    };
  }
  favoriteSkins = allFavoriteSkins[id];

  let currentSkin = stats.activeWeapon1Skin.parent.name.replace(/-/, '');
  if (!seenSkins) seenSkins = Object.keys(favoriteSkins);
  else if (!seenSkins.includes(currentSkin)) seenSkins.push(currentSkin);
  applyRandomSkins(currentSkin);
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

function seenSkinsListener() {
  let changeWeaponsContainer = document.querySelector('#change-container');
  if (changeWeaponsContainer) {
    changeWeaponsContainer.addEventListener('mouseup', (e) => {
      let skin = e.target?.innerText || e.target.parentElement.childNodes[0]?.innerText;
      if (skin) skin = skin.replace(/-/, '').trim();
      if (!seenSkins.includes(skin)) seenSkins.push(skin);
    });
    return changeWeaponsContainer;
  }
}

function appendFavedButtons() {
  document.querySelectorAll('#view > div.background > div.container > div.content > div.inventory > div.content > div.subjects > div.subject > div.hover-btns-group').forEach((hoverelement) => {
    if (!hoverelement?.querySelector('.bkc-fav-button')) {
      let bkcfavbut = document.createElement('a');
      bkcfavbut.className = 'bkc-fav-button';
      bkcfavbut.innerHTML = '⭐';
      bkcfavbut.title = 'Add to favorites';
      hoverelement.appendChild(bkcfavbut);
    }
  });
}

function appendFavedMarker(solo) {
  if (favoriteSkins['Selected'].length) {
    let favSpan = document.createElement('span');
    favSpan.innerHTML = '★';
    favSpan.id = 'bkc-fav-selected-span';
    if (solo) return solo.appendChild(favSpan);
    document.querySelectorAll('.item-name').forEach((element) => {
      let parent = element.parentElement.parentElement;
      if (favoriteSkins['Selected'].includes(element?.innerHTML) && !parent?.querySelector('#bkc-fav-selected-span')) {
        parent.appendChild(favSpan.cloneNode(true));
      }
    });
  }
}

function FavedButtonsHandler(e) {
  function isSkinFaved(skin) {
    let defaultskinName = skin.item.name.replace(/_/, '');
    for (let key of Object.keys(favoriteSkins)) {
      let result = favoriteSkins[key].findIndex((item) => item.name === skin.item.name);
      if (result > -1) {
        favoriteSkins[key].splice(result, 1);
        let index = favoriteSkins['Selected'].indexOf(defaultskinName);
        if (index > -1) favoriteSkins['Selected'].splice(index, 1);
        return skin;
      }
    }
    let parent = skin.item.type !== 'BODY_SKIN' ? (skin?.item?.parent !== null ? skin.item.parent.name.replace(/-/g, '') : defaultskinName.replace(/-/g, '')) : 'BODY_SKIN';
    favoriteSkins[parent].push({
      id: skin.item.id,
      name: skin.item.name,
      parentName: parent,
      nameInInventory: defaultskinName,
    });
    favoriteSkins['Selected'].push(defaultskinName);
  }

  if (e.target?.classList.contains('inspect-btn')) {
    let skinText = e.target.parentElement.innerText.split('\n').reverse();
    let skin = { ...getSkin(skinText[0] === '⭐' ? skinText[1] : skinText[0])?.item };
    if (!skin) return BKC.tip('Cant find skin');
    skin.name = skin.name.split('_').join('');
    if (skin.type !== 'BODY_SKIN') skin.parentName = skin?.parent?.name || skin.name;
    return this.__vue__.openModalInspect(skin);
  }

  if (e.target?.className === 'bkc-fav-button') {
    let skintext = e.target.previousSibling?.innerText;
    let favedbutParent = e.target.parentElement.parentElement;
    let favedbut = favedbutParent?.querySelector('#bkc-fav-selected-span');
    if (skintext) {
      let skin = getSkin(skintext);
      if (skin) {
        if (!isSkinFaved(skin)) {
          if (!favedbut) appendFavedMarker(favedbutParent);
        } else if (favedbut) favedbutParent.removeChild(favedbut);
        settings.set('allFavoriteSkins', allFavoriteSkins);
      }
    }
  } else if (e.target.innerText.trim().toUpperCase() === 'TAKE') {
    let skin = getSkin(e.target.nextElementSibling.innerText);
    if (skin) updateSkin(skin);
  }
}

function getSkin(skin) {
  if (Object.keys(favoriteSkins).includes(skin.replace(/-/, ''))) skin = `_${skin}`;
  for (let i = 0; i < skinzInfo?.length; i++) {
    if (skinzInfo[i].item.name === skin) {
      return skinzInfo[i];
    }
  }
}

function updateSkin(skin) {
  let user = window.view.__vue__?.$parent?.user || window.view.__vue__?.user;
  if (!user) return BKC.tip('no user');
  user[skin.item.type === 'BODY_SKIN' ? 'activeBodySkin' : 'activeWeapon1Skin'] = {
    id: skin.item.id,
    name: skin.item.name.replace(/^_/, ''),
    rarity: skin.item.rarity,
    type: skin.item.type,
    parent: skin.item?.parent
      ? {
          id: skin.item.parent.id,
          name: skin.item.parent.name,
          rarity: skin.item.parent.rarity,
          type: skin.item.parent.type,
        }
      : null,
  };
}

async function applyRandomSkins(_currentWeaponSkin) {
  let Dont = [];

  function getRandomSkin(array) {
    let Skin = array[Math.floor((window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * array.length)];
    if (Dont.includes(Skin.id) && array.length > 1) return getRandomSkin(array);
    return Skin;
  }

  function stillHasSkin(skin) {
    let isSkinAlive = skinzInfo.filter((item) => item.item.id === skin.id);
    if (!isSkinAlive.length) {
      let result = favoriteSkins[skin.parentName].findIndex((item) => item?.id === skin.id);
      if (result > -1) {
        favoriteSkins[skin.parentName].splice(result, 1);
        let index = favoriteSkins['Selected'].indexOf(skin.nameInInventory);
        if (index > -1) favoriteSkins['Selected'].splice(index, 1);
      }
      return;
    }
    return isSkinAlive[0];
  }

  if (randomFavoriteSkins && skinzInfo) {
    skinzInfo
      .filter((item) => item.isSelected === true && (item.item.type === 'WEAPON_SKIN' || item.item.type === 'BODY_SKIN' || item.item.type === 'WEAPON_3'))
      .forEach((me) => {
        if (me.item.type !== 'WEAPON_3') Dont.push(me.item.id);
        else if (!seenSkins.includes(me.item.name)) seenSkins.push(me.item.name);
      });

    let context1D = window.app.__vue__.$root.$store._modules.root.state.user.mwWN;
    let fskins = Object.keys(favoriteSkins);
    fskins.pop();

    // prettier-ignore
    for (let skin of
      window._?.sortBy
        ?
        window._.sortBy(fskins, (key) => (
          key === 'BODY_SKIN' || key === _currentWeaponSkin
            ? 0
            : 1
        ))
        :
        fskins.sort((_a, key) => (
          key === 'BODY_SKIN' || key === _currentWeaponSkin
            ? 1
            : -1
        ))
    ) {

      if (seenSkins.includes(skin) && favoriteSkins[skin].length) {
        let randomSkin = getRandomSkin(favoriteSkins[skin]);
        if (Dont.includes(randomSkin.id)) continue;
        // does nothing if ['user/getInventory'] isint called first and game doesnt have inventory.
        // takes skin + updates lobby canvas & avatar image
        if (skin === 'BODY_SKIN' || skin === _currentWeaponSkin) {
          let exist = stillHasSkin(randomSkin);
          if (!exist) continue;
          if (!context1D.inventory?.players) context1D.inventory = context1D.lobby;
          // ^ does nothing except prevent game from throwing a
          // WwnMNm + WwNn combo trying to update inventory canvas
          // makes no difference if it throws or not though just get error notification popups
          let p = JSON.parse(JSON.stringify(exist));
          p.item.name = p.item.name.split('_').join('');
          await window.app.__vue__.$store._actions['user/takeItem'][0](p);
          updateSkin(exist); // <-- fixes inventory + profile canvas
        } else {
          let result = await fetch('https://api.kirka.io/api/inventory/take', {
            headers: {
              accept: 'application/json, text/plain, */*',
              authorization: 'Bearer ' + localStorage.token,
              'content-type': 'application/json;charset=UTF-8',
              csrf: 'token',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-site',
            },
            referrer: 'https://kirka.io/',
            referrerPolicy: 'no-referrer-when-downgrade',
            body: `{"id":"${randomSkin.id}"}`,
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
          });
          if (!result.ok) stillHasSkin(randomSkin);
        }
      }
    }
  }
  seenSkins = ['BODY_SKIN', 'Shark'];
}

const Questobserver = new MutationObserver(() => {
  let hideMessages = ['You completed a quest', 'Take item failed', 'Rate limit exceeded', 'Failed to get notifications'];
  let notis = document.querySelectorAll('html body div#app div#notifications span div.vue-notification-wrapper div span.text');
  for (let i = 0; i < notis.length; i++) {
    let remElement = notis[i].parentElement.parentElement;
    if (hideMessages.includes(notis[i]?.innerHTML) && remElement.style.display !== 'none') {
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
    let tabInfo = document.querySelectorAll(
      '#app > div.game-interface > div.desktop-game-interface > div.tab-info > div.head.text-2,#app > div.game-interface > div.desktop-game-interface > div.tab-parkour-info > div.head.text-2'
    )[0];
    let serverThing = tabInfo?.querySelectorAll('div.server-id,div.label.blue')[0];
    if (serverThing && timeContainer) {
      timeContainer = tabInfo.insertBefore(timeContainer, serverThing);
    }
  }
  return timeContainer;
}

function checkInputImage(e, datalist, index) {
  let valve = e.value.trim();
  if (valve) {
    let AllInputImages = typeof settings.get('inputImageCache') === 'undefined' ? [[], [], [], [], [], [], [], [], []] : settings.get('inputImageCache');
    let inputImageCache = AllInputImages[index];
    let inputOption = `<option value="${valve}"></option>`;
    if (!inputImageCache.includes(inputOption)) {
      let img = document.createElement('img');
      img.onerror = () => {
        img = null;
      };
      img.onload = () => {
        AllInputImages[index].push(inputOption);
        datalist.innerHTML += inputOption;
        settings.set('inputImageCache', AllInputImages);
        img = null;
      };
      img.src = valve;
    }
  }
}

function clearInputImage(e) {
  if (e.target.offsetWidth - e.offsetX < 39 && e.target.value !== '') e.target.value = '';
}

function fillInputImage(e) {
  if (e.target.value !== e.target._value) e.target.value = e.target._value;
}

function playHoverAudio() {
  let uiVol = window.localStorage['mwNMWn/SOUND/VOLUME_UI'];
  if (uiVol) uiVol = JSON.parse(uiVol);
  let Bark = window.Howl.prototype.init({
    src: 'data:audio/mpeg;base64,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',
    name: 'hover',
    volume: uiVol || 1,
  });
  Bark.play();
}

function appendClanInvites() {
  async function acceptRejectClanInvite(requestUrl, clan) {
    let response = await fetch(requestUrl, {
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
      body: `{"inviteId":"${clan.id}"}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    // eslint-disable-next-line no-useless-escape
    if (!response.ok) return console.count(console.log('   (｢•-•)｢ ʷʱʸ?   ', '   i dunno? ¯_(͡• ͜໒ ͡• )_/¯   '));

    if (requestUrl !== 'https://api.kirka.io/api/clans/acceptInvite') return;
    user.clan = clan.clan.name;
    clanInviteCointainer.classList.add('bkc-hide-clan-accept');
  }

  function acceptRejectClanHandler(e) {
    if (e.target.tagName.toLowerCase() === 'button') {
      if (e.target.classList.contains('accept')) {
        acceptRejectClanInvite('https://api.kirka.io/api/clans/acceptInvite', this.clan);
        //wrapper.close();
      } else {
        acceptRejectClanInvite('https://api.kirka.io/api/clans/cancelInvite', this.clan);
      }
      clanInviteCointainer.removeChild(this.newdescription);
      clanInviteCointainer.removeChild(this.newbuttons);
      if (clanInviteCointainer.childNodes.length <= 4) wrapper.close();
    }
  }

  let wrap = document.querySelector('#app div.interface.text-2 div.vm--container');
  let wrapper = wrap?.__vue__;
  if (wrapper.isClosing) return;

  if (!wrapper.closer && wrapper?.close) {
    wrapper.closer = wrapper.close;
    wrapper.close = function () {
      wrapper.isClosing = true;
      wrapper.closer.apply(this, arguments);
      clanSelectors.clear();
    };
  }

  let clanInviteCointainer = wrap?.querySelector('div.container-card');
  let description = clanInviteCointainer?.querySelector('div.description');
  let buttons = clanInviteCointainer?.querySelector('div.btns');
  let user = window.view.__vue__?.user;
  let claninvites = user?.clanInvites;
  if (!claninvites || !description || !buttons) return;

  if (user.clan && !clanInviteCointainer.classList.contains('bkc-hide-clan-accept')) {
    clanInviteCointainer.classList.add('bkc-hide-clan-accept');
  }

  for (let i = 0; i < claninvites?.length; i++) {
    if (clanSelectors.has(claninvites[i].clan.name)) return;
    let newdescription = description.cloneNode(true);
    let newbuttons = buttons.cloneNode(true);
    newdescription.innerHTML = `
        You are invited to the ${claninvites[i].clan.name} clan!
        <br>
        clan scores: ${claninvites[i].clan.allScores}
        ${
          claninvites[i].clan.description !== null
            ? `<br>
        description: ${claninvites[i].clan.description}`
            : ''
        }
        ${
          claninvites[i].clan.discordLink !== null
            ? `<br>
            <div data-v-031-May-26th-2022="" class="discord-cont">
            <svg
              style="height: 2.25rem; width: 2.25rem; fill: currentColor"
              xmlns="http://www.w3.org/2000/svg"
              class="discord-icon svg-icon svg-icon--discord-classic">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons.366c992b.svg#discord-classic"></use>
            </svg>
            DISCORD
          </div>
            `
            : ''
        }
        `;

    newdescription = clanInviteCointainer.appendChild(newdescription);
    newbuttons = clanInviteCointainer.appendChild(newbuttons);
    clanSelectors.set(claninvites[i].clan.name, {
      newdescription,
      newbuttons,
      clan: claninvites[i],
    });

    newbuttons.onclick = (e) => acceptRejectClanHandler.call(clanSelectors.get(claninvites[i].clan.name), e);
    if (claninvites[i].clan.discordLink) {
      newdescription.onmouseup = (e) => {
        if (e.target.className === 'discord-cont' || e.target.tagName === 'use') {
          if (e.button === 0) shell.openExternal(claninvites[i].clan.discordLink);
          else if (e.button === 2) {
            clipboard.writeText(claninvites[i].clan.discordLink);
            BKC.tip('Link Copied');
          }
        }
      };
    }
  }
  description.style.display = 'none';
  buttons.style.display = 'none';
}

function customMarketPrice(inventory) {
  let feefee = inventory?.querySelector('.market-fee');
  let marketInputsWrapper = document.querySelector('#bkc-market-inputs-wrapper');
  if (feefee && !marketInputsWrapper) {
    if (typeof Object.getOwnPropertyDescriptor(inventory.__vue__, 'marketFee') === 'undefined') {
      Object.defineProperty(inventory.__vue__, 'marketFee', {
        get() {
          let jackpot = 0;
          let marketFeeRoulette = Math.ceil(Math.random() * 100) * Math.floor(Math.random() * (this.marketPrice / 10)) + Math.ceil(Math.random() + Math.PI); // monkaW
          if (String(marketFeeRoulette).startsWith(777)) return jackpot;
          return marketFeeRoulette;
        },
      });
    }
    feefee.firstChild.nodeValue = 'Market fee roulette: ';
    let ogMarketPrice = inventory.__vue__.increments[inventory.__vue__.marketItemData.item.rarity];
    inventory.__vue__.marketLimit = Number.MAX_VALUE;
    inventory.__vue__.marketIncrement = 10;
    marketInputsWrapper = document.createElement('div');
    let marketIncrementSelect = marketInputsWrapper.appendChild(document.createElement('select'));
    let marketTextInput = marketInputsWrapper.appendChild(document.createElement('input'));
    marketTextInput.style = [...[...document.styleSheets].find((e) => e.href?.startsWith('https://kirka.io/assets/css/app.')).cssRules].find((f) =>
      f.selectorText?.startsWith('.input[')
    ).style.cssText; // lol
    marketIncrementSelect.style = marketTextInput.style.cssText;
    marketTextInput.value = inventory.__vue__.marketPrice;
    marketInputsWrapper.id = 'bkc-market-inputs-wrapper';
    marketIncrementSelect.id = 'bkc-incrementSlider';
    marketTextInput.id = 'bkc-marketTextInput';
    marketIncrementSelect.innerHTML = `
    <option value="10">10</option>
    <option value="100">100</option>
    <option value="1000">1000</option>
    <option value="10000">10000</option>
    <option value="100000">100000</option>
    <option value="1000000">1000000</option>
    `;
    marketInputsWrapper = feefee.parentElement.insertBefore(marketInputsWrapper, feefee);
    let marketReset = feefee.appendChild(marketInputsWrapper.previousSibling.childNodes[2].cloneNode(true));
    let applyToMarketButton = feefee.nextElementSibling.querySelector('button');
    marketReset.querySelector('.text').innerText = '↻';

    let wheelies = (e) => {
      if (e.target === marketIncrementSelect) {
        if (e.deltaY > 0 && marketIncrementSelect.selectedIndex !== 0) marketIncrementSelect.selectedIndex -= 1;
        else if (e.deltaY < 0 && marketIncrementSelect.lastElementChild !== marketIncrementSelect.selectedOptions[0]) marketIncrementSelect.selectedIndex += 1;
        inventory.__vue__.marketIncrement = Number(marketIncrementSelect.value);
      } else if (e.target === marketTextInput) {
        if (e?.key === 'ArrowUp' || e?.deltaY < 0) inventory.__vue__.marketPrice += inventory.__vue__.marketIncrement;
        else if (e?.key === 'ArrowDown' || e.deltaY > 0) {
          if (inventory.__vue__.marketPrice - inventory.__vue__.marketIncrement <= 0) inventory.__vue__.marketPrice = 0;
          else inventory.__vue__.marketPrice -= inventory.__vue__.marketIncrement;
        }
        marketTextInput.value = inventory.__vue__.marketPrice;
      }
    };

    marketInputsWrapper.onwheel = window._.afterEvery(2, wheelies);
    marketInputsWrapper.onkeydown = wheelies;
    marketInputsWrapper.oninput = (e) => {
      if (e.target === marketTextInput && !Number.isNaN(e.target.value)) {
        inventory.__vue__.marketPrice = Number(e.target.value);
        marketTextInput.value = inventory.__vue__.marketPrice;
      } else if (e.target === marketIncrementSelect) {
        inventory.__vue__.marketIncrement = Number(marketIncrementSelect.value);
      }
    };

    feefee.parentElement.onclick = (e) => {
      if (e.target === marketReset) inventory.__vue__.marketPrice = 0;
      marketTextInput.value = inventory.__vue__.marketPrice;
    };

    applyToMarketButton.onmousedown = () => {
      if (!marketPrice) {
        marketPrice = inventory.__vue__.marketPrice;
        inventory.__vue__.marketPrice = ogMarketPrice;
        window.JSON.stringify = gigafydStringify;
      }
    };
  }
}

function sniperButton() {
  let game = document.querySelector('canvas#game');
  zooming = false;
  if (game) {
    game.onmousedown = gameOnKeyButtonDown;
    game.onmouseup = gameOnKeyButtonUp;
  }
}

function gameOnKeyButtonDown(e) {
  if (!inGame || window.mWnwM?.mWnwM?.room?.name === 'MapEditorRoom') return;
  let eKey = e?.code || e.button;
  if (eKey !== extraAdsZoomKey) return;
  let s = window.mWnwM?.WMmNw._components[55];
  let scoped = s.WNmnwM || s.WNmM || s.mwNMW;
  let camera = window.mWnwM?.renderingSystem.camera.scale;
  if (!extraAdsZoomHold || !camera) return;
  if (scoped) {
    camera.z = extraAdsZoomAmount;
    zooming = true;
  } else {
    camera.z = 1;
    zooming = false;
  }
}

function gameOnKeyButtonUp(e) {
  if (inGame && window.mWnwM?.mWnwM?.room?.name !== 'MapEditorRoom') {
    let eKey = e?.code || e.button;
    let s = window.mWnwM.WMmNw._components[55];
    let scoped = s.WNmnwM || s.WNmM || s.mwNMW;
    let camera = window.mWnwM?.renderingSystem.camera.scale;
    if (scoped) {
      if (eKey === extraAdsZoomKey) {
        if (extraAdsZoomHold) {
          camera.z = 1;
          zooming = false;
        } else if (!zooming) {
          camera.z = extraAdsZoomAmount;
          zooming = true;
        } else {
          camera.z = 1;
          zooming = false;
        }
      }
    } else if (camera) {
      camera.z = 1;
      zooming = false;
    }

    if (eKey === 'Minus') {
      extraAdsZoomAmount = Number((extraAdsZoomAmount -= 0.1).toFixed(1));
      if (extraAdsZoomAmount < 1) extraAdsZoomAmount = 1;
      camera.z = extraAdsZoomAmount;
      extraAdsZoomAmountElem.value = extraAdsZoomAmount;
      extraAdsZoomAmountSpan.innerText = extraAdsZoomAmount;
      settings.set('extraAdsZoomAmount', extraAdsZoomAmount);
    } else if (eKey === 'Equal') {
      extraAdsZoomAmount = Number((extraAdsZoomAmount += 0.1).toFixed(1));
      camera.z = extraAdsZoomAmount;
      extraAdsZoomAmountElem.value = extraAdsZoomAmount;
      extraAdsZoomAmountSpan.innerText = extraAdsZoomAmount;
      settings.set('extraAdsZoomAmount', extraAdsZoomAmount);
    }
  }
}

let extraAdsZoomAmountElem = document.getElementById('extraAdsZoomAmount');
let extraAdsZoomAmountSpan = document.getElementById('extraAdsZoomAmountSpan');

document.addEventListener('keydown', gameOnKeyButtonDown, {
  passive: true,
});

document.addEventListener('keyup', gameOnKeyButtonUp, {
  passive: true,
});

//(function () {
(function () {
  if (window.crypto?.randomUUID) return;
  window.crypto = window.crypto || {};

  if (typeof require === 'function') {
    window.cryptoManiac = require('crypto');
    if (typeof window.cryptoManiac?.randomBytes === 'function')
      return Object.defineProperty(window.crypto, 'randomUUID', {
        value: () => [4, 2, 2, 2, 6].map((a) => window.cryptoManiac.randomBytes(a).toString('hex')).join('-'),
      });
  }

  Object.defineProperty(window.crypto, 'randomUUID', {
    value: () => {
      let a = URL.createObjectURL(new Blob());
      let p = a.split('/').reverse()[0];
      URL.revokeObjectURL(a);
      return p;
    },
  });
})();

Object.defineProperty(window, 'mWnwM', {
  get() {
    return window?.app?.__vue__.$store.state.game?.mWnwM;
  },
});

let eventMap = new Map();
Object.defineProperties(eventMap, {
  removeListener: {
    value() {
      if (this.size)
        this.forEach((arg, targ) => {
          EventTarget.prototype.removeEventListener.call(targ, arg[0], arg[3] || arg[1], arg[2]);
        });
      this.clear();
    },
  },
});

let oldAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function () {
  if (
    arguments[0] === 'keydown' &&
    arguments[2]?.capture === true &&
    arguments[2]?.passive === false &&
    /registerSystem.*registerSystem/s.test(new Error().stack) &&
    (typeof globalChatOpenSocket === 'undefined' || globalChatOpenSocket)
  ) {
    if (!WebRocket.endListener && window.mWnwM?.leaveGame) {
      WebRocket.endListener = window.mWnwM.leaveGame;
      window.mWnwM.leaveGame = function () {
        eventMap.removeListener();
        WebRocket.endListener.apply(this, arguments);
        WebRocket.removeListener();
        WebRocket.clearAll();
      };
    }

    if (WebRocket.connected && WebRocket.protocol !== WebRocket.socket.protocol) WebRocket.socket.close();
    if (eventMap.size) eventMap.removeListener();

    let eventFunc = function (e) {
      if (!e.target.classList.contains('bkc-global-input')) {
        eventMap.get(this)[1].apply(this, arguments);
      }
    };

    eventMap.set(this, [...arguments, eventFunc]);
    WebRocket.onMessage();

    return oldAddEventListener.call(this, arguments[0], eventFunc, arguments[2]);
  }
  return oldAddEventListener.apply(this, arguments);
};

const WebRocket = {
  messages: new WeakMap(),
  trades: {
    pool: [],
    index: 0,
    set(a) {
      if (/\sis\soffering\stheir\s/.test(a)) {
        this.pool.unshift(a.replace(/.*\*\*(.*?)\*\*.*/, '$1'));
      }
    },
    clear() {
      this.pool = [];
      this.index = 0;
    },
    previous(a) {
      return this.pool[this.pool[this.index + 1] ? ++this.index : this.index] || a;
    },
    next(a) {
      return this.pool[this.pool[this.index - 1] ? --this.index : this.index] || a;
    },
  },
  min: 1e3,
  max: 3e4,
  multiply: 1.5,
  attempts: 0,
  connected: false,
  connecting: false,
  reconnecting: null,
  hasDisconnected: false,
  custom: false,
  socket: null,
  endListener: null,
  showLog: true,
  keyDown: {
    listening: false,
    options: {
      passive: false,
    },
  },
  clearAll() {
    this.trades.clear();
    this.messages = new WeakMap();
  },
  clearTimer() {
    this.reconnecting = this.reconnecting ? clearTimeout(this.reconnecting) : undefined;
  },
  interval() {
    return Math.min(this.min * this.multiply ** this.attempts++, this.max);
  },
  reconnect() {
    if (this.connecting || this.connected) return;
    this.connecting = !this.connecting;
    this.dispose();
    this.clearTimer();
    this.reconnecting = setTimeout(() => {
      this.connecting = !this.connecting;
      this.connect();
    }, this.interval());
  },
  disconnect() {
    this.socket.close(3210, '💀🤳');
  },
  dispose() {
    this.socket = null;
  },
  connect() {
    if (!this.protocol) return this.reconnect();
    this.socket = new WebSocket(this.url, this.protocol);

    this.socket.onopen = function () {
      this.connected = true;
      this.attempts = 0;
      this.clearTimer();
      this.socket.onmessage = this.onMessage.bind(this);
      if (this.hasDisconnected) this.log('Websocket reconnected');
    }.bind(this);

    this.socket.onclose = function (e) {
      this.connected = false;
      this.hasDisconnected = true;
      this.log('Websocket closed', e);
      this.clearAll();
      if (e.reason !== '💀🤳') return this.reconnect();
      this.dispose();
    }.bind(this);

    this.socket.onerror = function (e) {
      this.connected = false;
      this.hasDisconnected = true;
      this.log('Websocket error', e);
      this.clearAll();
      this.reconnect();
    }.bind(this);
  },
  fix(thisThing) {
    return thisThing.replace(/\[(.*?)\|.*?]/g, '[$1]').replace(/\s?\*\*/g, '');
  },
  setMessage(msg) {
    let store = window.app.__vue__.$store;
    let chat = store._modules.root.state.chat;
    this.messages.set(msg);
    if (!this.custom) return chat.messages.push(msg);
    store._mutations['chat/setMessage'][0](msg);
  },
  processMessage(event) {
    let newThread = JSON.parse(event.data);
    if (newThread.type === 3) return;

    let Thread32Next = newThread?.user || {
      id: window.crypto.randomUUID(),
    };

    Thread32Next.lvl = Thread32Next.level || null;
    Thread32Next.type = newThread.type;
    Thread32Next.message = this.fix(newThread.message);

    if (newThread.type === 13) {
      Thread32Next.name = 'SERVER';
      this.trades.set(newThread.message);
    }

    this.setMessage(Thread32Next);
  },
  clearMessages() {
    let store = window.app.__vue__.$store;
    store._modules.root.state.chat.messages.forEach((msg) => {
      if (this.messages.has(msg)) store._mutations['chat/clearMessagesById'][0](msg.id);
    });
    this.trades.clear();
  },
  onMessage(event) {
    let input = document.querySelector('div.desktop-game-interface > div.chat.chat-position > div.input-wrapper');
    if (!input) return;
    if (!document.querySelector('.bkc-global-input-wrapper')) {
      this.custom = window.app.__vue__.$store._modules.root.state.game.metadata.custom;

      if (!this.endListener && window.mWnwM?.leaveGame) {
        this.endListener = window.mWnwM.leaveGame;
        window.mWnwM.leaveGame = function () {
          eventMap.removeListener();
          WebRocket.endListener.apply(this, arguments);
          WebRocket.removeListener();
          WebRocket.clearAll();
        };
      }

      if (typeof this.cant === 'undefined') {
        window.app.__vue__.$router.options.routes
          .find((a) => a?.name === 'servers')
          .component()
          .then((a) => {
            this.viewAlert = a.default.computed.viewAlert;
            Object.defineProperty(this, 'cant', {
              get() {
                return this.viewAlert.call(window.view.__vue__);
              },
            });
          });
      }

      let glob = input.parentElement.appendChild(input.cloneNode(true));
      glob.classList.add('bkc-global-input-wrapper');
      glob.firstChild.classList.add('bkc-global-input');
      glob.style.display = 'none';
      glob.lastChild.style.background = 'red';
      glob.lastChild.innerText = 'GLOBAL';
      this.addListener();
      this.setMessage({
        id: window.crypto.randomUUID(),
        role: 'CLIENT',
        name: 'CLIENT',
        lvl: '❗',
        message: !globalChatVisible ? 'Global messages are hidden' : 'Global messages are visible',
      });
    }
    if (event && globalChatVisible) this.processMessage(event);
  },
  listener(e) {
    let inputWrapGame = document.querySelector('div.desktop-game-interface > div.chat.chat-position > div.input-wrapper');
    let inputWrapGlobal = inputWrapGame?.nextSibling;
    if (!inputWrapGame) return;
    if (!inputWrapGlobal) return this.onMessage();
    let inputGame = inputWrapGame.firstChild;
    let inputGlobal = inputWrapGlobal.firstChild;

    if (e.key === globalChatVisibleToggleKey) {
      if (document.activeElement === inputGlobal || document.activeElement === inputGame) e.preventDefault();
      globalChatVisible = !globalChatVisible;
      if (!globalChatVisible) this.clearMessages();

      if (typeof settings !== 'undefined' && typeof Store === 'function' && settings instanceof Store) {
        settings.set('globalChatVisible', globalChatVisible);
      }

      return this.setMessage({
        id: window.crypto.randomUUID(),
        role: 'CLIENT',
        name: 'CLIENT',
        lvl: '❗',
        message: !globalChatVisible ? 'Global chat messages hidden' : 'Global chat messages visible',
      });
    }

    if (e.key === globalChatInputToggleKey) {
      let shouldRefocus = e.target === inputGlobal ? inputGame : e.target === inputGame ? inputGlobal : null;
      inputWrapGame.style.display = inputWrapGlobal.style.display;
      inputWrapGlobal.style.display = inputWrapGlobal.style.display === 'none' ? 'flex' : 'none';
      inputGame.value = '';
      inputGlobal.value = '';

      if (shouldRefocus) {
        e.preventDefault();
        shouldRefocus.focus();
      }

      return this.setMessage({
        id: window.crypto.randomUUID(),
        role: 'CLIENT',
        name: 'CLIENT',
        lvl: '❗',
        message: inputWrapGlobal.style.display === 'flex' ? 'messages will be sent to GLOBAL chat' : 'messages will be sent to GAME chat',
      });
    }

    if (e.key === 'Enter') {
      if (e.target === inputGlobal) {
        let msg = inputGlobal.value;
        inputGlobal.value = '';
        inputGlobal.blur();
        if (!msg) return;
        if (this.cant)
          return this.setMessage({
            id: window.crypto.randomUUID(),
            role: 'xqcL',
            name: 'CLIENT',
            lvl: '❗',
            message: this.cant,
          });

        return this.socket.send(msg);
      }
      if (inputWrapGlobal.style.display === 'flex') {
        inputGlobal.focus();
      }
    }
    if (e.target === inputGlobal) {
      if (e.key === 'ArrowUp') return (inputGlobal.value = this.trades.previous(inputGlobal.value));
      if (e.key === 'ArrowDown') return (inputGlobal.value = this.trades.next(inputGlobal.value));
      if (e.key === 'Tab' || e.key.length === 1) {
        e.preventDefault();
        let g = inputGlobal;
        let caretPos = ++g.selectionStart;
        g.value = `${g.value.substring(0, g.selectionStart)}${e.key === 'Tab' ? '\t' : e.key}${g.value.substring(g.selectionEnd)}`;
        g.selectionStart = caretPos;
        g.selectionEnd = caretPos;
      }
    }
  },
  log() {
    if (!this.showLog) return;
    console.dir.apply(this, arguments);
    if (typeof BKC !== 'undefined' && typeof BKC.tip === 'function') return BKC.tip(...arguments);
    let gameTip = document.querySelector('#notifications')?.__vue__;
    if (!gameTip) return;
    let tid = gameTip.list.length + 1;
    gameTip.list.push({
      id: tid,
      state: 0,
      speed: 300,
      data: '🍑',
      title: '🌮',
      type: 'alert bkc',
      text: arguments[0],
      length: 'length'.length,
    });
    setTimeout(() => gameTip.destroyById(tid), 10000);
  },
  addListener() {
    if (this.keyDown.listening) return;
    this.keyDown.listening = !this.keyDown.listening;
    this.listener = this.listener.bind(this);
    document.addEventListener('keydown', this.listener, this.keyDown.options);
  },
  removeListener() {
    if (!this.keyDown.listening) return;
    this.keyDown.listening = !this.keyDown.listening;
    document.removeEventListener('keydown', this.listener, this.keyDown.options);
  },
};

Object.defineProperties(WebRocket, {
  url: {
    get() {
      return 'wss://chat.kirka.io/';
    },
  },
  protocol: {
    get() {
      return window.localStorage.token;
    },
  },
});

Object.defineProperty(WebRocket.trades, 'size', {
  get() {
    return this.pool.length;
  },
});

/*
let globalChatVisible = true;
let globalChatVisibleToggleKey = '8';
let globalChatInputToggleKey = '7';
*/
//WebRocket.connect();
//})();

if (globalChatOpenSocket) {
  WebRocket.connect();
}

function getBkcMinSelectInnerHtml() {
  return `
  <div id="bkc-minmax-left">
  <label for="vo" id="bkkc"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="2rem"
      height="2rem"
      viewBox="2 2 20 20"
      fill="var(--white)"
    >
      <path
        d="M3 19V18C3 15.7909 4.79086 14 7 14H11C13.2091 14 15 15.7909 15 18V19M15 11C16.6569 11 18 9.65685 18 8C18 6.34315 16.6569 5 15 5M21 19V18C21 15.7909 19.2091 14 17 14H16.5M12 8C12 9.65685 10.6569 11 9 11C7.34315 11 6 9.65685 6 8C6 6.34315 7.34315 5 9 5C10.6569 5 12 6.34315 12 8Z"
        stroke="var(--white)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
    <input type="text" class="bkc-min-players-time-text" disabled="" />
    <div id="bkc-drop-arrow">▼</div></label
  >
  <div
    class="bkc-gamemodes-players-dropdown"
    id="bkc-gamemodes-players-dropdown"
    style="display: none"
  >
    <div class="bkc-options-wrapper">
      <div id="bkc-gamemodes-filter-slider-wrapper">
        <input
          type="range"
          id="bkc-min-players"
          class="bkc-gamemodes-filter-slider"
          name="vol"
          min="1"
          max="50"
          step="0.00000001"
        />
      </div>
      <div id="bkc-gamemodes-filter-options-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="1"
        >
          <path
            d="M16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM17.757 22.536h-2.469v-9.305c-0.901 0.841-1.964 1.463-3.188 1.867v-2.234c0.644-0.211 1.344-0.612 2.099-1.202s1.273-1.278 1.555-2.064h2.003v12.938z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="2"
        >
          <path
            d="M16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM20.342 20.426v2.297h-8.656c0.093-0.867 0.374-1.688 0.843-2.465 0.468-0.776 1.393-1.807 2.774-3.090 1.111-1.037 1.793-1.74 2.045-2.109 0.34-0.51 0.51-1.014 0.51-1.512 0-0.551-0.147-0.975-0.441-1.271s-0.7-0.444-1.219-0.444c-0.512 0-0.92 0.156-1.223 0.467s-0.478 0.827-0.523 1.549l-2.469-0.247c0.146-1.359 0.605-2.335 1.378-2.928s1.739-0.888 2.898-0.888c1.27 0 2.268 0.343 2.994 1.028s1.089 1.538 1.089 2.557c0 0.58-0.104 1.132-0.312 1.656s-0.537 1.074-0.988 1.647c-0.299 0.38-0.839 0.929-1.621 1.644-0.781 0.714-1.276 1.188-1.484 1.422s-0.376 0.463-0.505 0.686h4.91z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="3"
        >
          <path
            d="M16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM18.995 21.357c-0.826 0.797-1.854 1.194-3.086 1.194-1.166 0-2.133-0.335-2.9-1.005-0.769-0.67-1.214-1.545-1.337-2.627l2.391-0.289c0.076 0.607 0.281 1.071 0.616 1.393 0.333 0.321 0.738 0.482 1.213 0.482 0.51 0 0.939-0.194 1.289-0.582 0.348-0.387 0.522-0.909 0.522-1.566 0-0.621-0.167-1.115-0.501-1.479-0.335-0.364-0.742-0.545-1.223-0.545-0.317 0-0.695 0.062-1.136 0.184l0.272-1.997c0.668 0.018 1.178-0.127 1.529-0.434s0.526-0.715 0.526-1.224c0-0.433-0.128-0.777-0.385-1.035-0.258-0.257-0.599-0.386-1.025-0.386-0.421 0-0.779 0.146-1.077 0.438s-0.479 0.72-0.544 1.281l-2.281-0.386c0.158-0.782 0.397-1.407 0.717-1.875s0.765-0.835 1.336-1.103 1.212-0.401 1.921-0.401c1.213 0 2.186 0.387 2.918 1.161 0.604 0.633 0.905 1.348 0.905 2.145 0 1.131-0.619 2.034-1.858 2.708 0.739 0.158 1.33 0.513 1.772 1.063 0.443 0.551 0.664 1.215 0.664 1.994 0.001 1.132-0.412 2.095-1.238 2.891z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="4"
        >
          <path
            d="M16.359 17.583v-4.405l-2.971 4.405h2.971zM16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM20.344 19.739h-1.594v2.595h-2.391v-2.595h-5.281v-2.147l5.598-8.196h2.074v8.187h1.594v2.156z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="5"
        >
          <path
            d="M16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM19.546 20.68c-0.839 1.137-2.003 1.705-3.492 1.705-1.19 0-2.16-0.319-2.911-0.959-0.75-0.641-1.199-1.502-1.346-2.582l2.469-0.256c0.070 0.559 0.278 1 0.623 1.324 0.345 0.326 0.742 0.488 1.192 0.488 0.515 0 0.949-0.209 1.307-0.627 0.355-0.418 0.534-1.049 0.534-1.893 0-0.79-0.178-1.383-0.532-1.778-0.355-0.395-0.818-0.593-1.388-0.593-0.71 0-1.348 0.312-1.911 0.938l-1.997-0.289 1.266-6.711h6.531v2.312h-4.658l-0.397 2.192c0.553-0.273 1.117-0.411 1.693-0.411 1.099 0 2.030 0.399 2.795 1.196s1.146 1.832 1.146 3.103c-0.001 1.062-0.309 2.009-0.924 2.841z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="6"
        >
          <path
            d="M16.062 16.037c-0.476 0-0.877 0.186-1.205 0.558-0.329 0.372-0.493 0.921-0.493 1.647 0 0.803 0.185 1.422 0.555 1.858 0.369 0.437 0.791 0.655 1.267 0.655 0.457 0 0.839-0.18 1.144-0.537s0.457-0.942 0.457-1.757c0-0.838-0.164-1.451-0.492-1.841s-0.74-0.583-1.233-0.583zM16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM19.047 21.607c-0.773 0.797-1.768 1.194-2.98 1.194-1.302 0-2.372-0.505-3.21-1.516s-1.258-2.667-1.258-4.97c0-2.361 0.438-4.063 1.312-5.106s2.008-1.564 3.404-1.564c0.979 0 1.79 0.275 2.432 0.825 0.643 0.551 1.052 1.349 1.228 2.396l-2.391 0.263c-0.059-0.49-0.212-0.853-0.458-1.086-0.247-0.234-0.567-0.351-0.961-0.351-0.523 0-0.966 0.233-1.327 0.701s-0.589 1.44-0.683 2.92c0.615-0.726 1.381-1.089 2.297-1.089 1.032 0 1.916 0.392 2.652 1.176s1.104 1.797 1.104 3.038c0 1.318-0.387 2.374-1.161 3.169z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="7"
        >
          <path
            d="M16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM20.386 11.828c-0.697 0.687-1.405 1.671-2.125 2.955s-1.269 2.648-1.646 4.094c-0.377 1.445-0.562 2.736-0.557 3.873h-2.375c0.040-1.781 0.407-3.6 1.101-5.452 0.692-1.853 1.617-3.51 2.775-4.97h-5.626v-2.297h8.453v1.797z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
  </div>
  <div id="bkc-minmax-right">
  <label for="vo" id="bkkc"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="2rem"
      height="2rem"
      viewBox="0 0 512 512"
    >
      <path
        fill="var(--white)"
        d="M104.53 28.72c-.676 0-1.356.012-2.03.03-16.186.435-31.577 6.108-44.375 15.25-34.13 24.378-50.547 75.233-18.563 118.72 25.234 34.303 14.237 79.597-11.874 104.905l13.03 13.406c32.24-31.247 45.253-86.76 13.907-129.374C28.415 116.022 42.253 78.324 69 59.22c13.374-9.554 29.767-14.01 46.28-10.75 15.853 3.126 32.335 13.31 46.907 35l-59.875 34.655 24.344 42.28c-49.898 63.943-58.988 154.445-16 229.126 56.487 98.133 181.517 131.802 279.281 75.19 97.765-56.614 131.237-182.057 74.75-280.19-42.912-74.55-125.41-111.868-205.437-100.686l-24.438-42.438-56.437 32.657c-16.916-25.592-38.054-39.714-59.47-43.938-4.813-.95-9.63-1.405-14.374-1.406zm170.126 81.124c79.9 0 144.813 64.347 144.813 144.25 0 79.9-64.913 144.844-144.814 144.844-79.9 0-144.25-64.945-144.25-144.844 0-79.9 64.35-144.25 144.25-144.25zm-9.094 25.187v88.19c-13.248 4.192-23.156 16.79-23.156 31.218 0 17.726 14.962 32.125 32.688 32.125 16.82 0 30.63-12.968 32-29.438l76.53-54.875-10.905-15.188-70.283 50.407c-4.103-6.774-10.542-11.993-18.187-14.345V135.03h-18.688zm-42.187 11.314l-16.188 9.344 14.344 24.843 16.19-9.374-14.345-24.812zm103.063 0l-14.344 24.812 16.187 9.375 14.345-24.843-16.188-9.343zm-150.125 40.22l-9.344 16.186 24.81 14.344 9.345-16.188-24.813-14.344zm98.78 53.874c7.628 0 13.438 6.375 13.438 14 0 7.626-5.81 13.437-13.436 13.437-7.627 0-14-5.81-14-13.438 0-7.626 6.372-14 14-14zm-119.437 4.5v18.687h28.656v-18.688h-28.656zm209.813 0v18.687h28.686v-18.688H365.47zM191.78 291.5l-24.81 14.313L176.312 322l24.812-14.344-9.344-16.156zm166.25 0l-9.342 16.156L373.5 322l9.344-16.188L358.03 291.5zm-136.5 36.563l-14.343 24.812 16.188 9.344 14.344-24.814-16.19-9.344zm106.75 0l-16.186 9.343 14.344 24.813 16.187-9.345-14.344-24.813zm-62.717 16.812v28.656h18.687v-28.655h-18.688z"
      ></path>
    </svg>
    <input type="text" class="bkc-min-players-time-text" disabled="" />
    <div id="bkc-drop-arrow" class="bkc-time-drop-arrow">▼</div></label
  >
  <div
    class="bkc-gamemodes-players-dropdown"
    id="bkc-gamemodes-time-dropdown"
    style="display: none"
  >
    <div class="bkc-options-wrapper">
      <div id="bkc-gamemodes-filter-slider-wrapper">
        <input
          type="range"
          id="bkc-min-time"
          class="bkc-gamemodes-filter-slider"
          name="vol"
          min="1"
          max="60"
          step="0.00000001"
        />
      </div>
      <div id="bkc-gamemodes-filter-options-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="1"
        >
          <path
            d="M16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM17.757 22.536h-2.469v-9.305c-0.901 0.841-1.964 1.463-3.188 1.867v-2.234c0.644-0.211 1.344-0.612 2.099-1.202s1.273-1.278 1.555-2.064h2.003v12.938z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="2"
        >
          <path
            d="M16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM20.342 20.426v2.297h-8.656c0.093-0.867 0.374-1.688 0.843-2.465 0.468-0.776 1.393-1.807 2.774-3.090 1.111-1.037 1.793-1.74 2.045-2.109 0.34-0.51 0.51-1.014 0.51-1.512 0-0.551-0.147-0.975-0.441-1.271s-0.7-0.444-1.219-0.444c-0.512 0-0.92 0.156-1.223 0.467s-0.478 0.827-0.523 1.549l-2.469-0.247c0.146-1.359 0.605-2.335 1.378-2.928s1.739-0.888 2.898-0.888c1.27 0 2.268 0.343 2.994 1.028s1.089 1.538 1.089 2.557c0 0.58-0.104 1.132-0.312 1.656s-0.537 1.074-0.988 1.647c-0.299 0.38-0.839 0.929-1.621 1.644-0.781 0.714-1.276 1.188-1.484 1.422s-0.376 0.463-0.505 0.686h4.91z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="3"
        >
          <path
            d="M16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM18.995 21.357c-0.826 0.797-1.854 1.194-3.086 1.194-1.166 0-2.133-0.335-2.9-1.005-0.769-0.67-1.214-1.545-1.337-2.627l2.391-0.289c0.076 0.607 0.281 1.071 0.616 1.393 0.333 0.321 0.738 0.482 1.213 0.482 0.51 0 0.939-0.194 1.289-0.582 0.348-0.387 0.522-0.909 0.522-1.566 0-0.621-0.167-1.115-0.501-1.479-0.335-0.364-0.742-0.545-1.223-0.545-0.317 0-0.695 0.062-1.136 0.184l0.272-1.997c0.668 0.018 1.178-0.127 1.529-0.434s0.526-0.715 0.526-1.224c0-0.433-0.128-0.777-0.385-1.035-0.258-0.257-0.599-0.386-1.025-0.386-0.421 0-0.779 0.146-1.077 0.438s-0.479 0.72-0.544 1.281l-2.281-0.386c0.158-0.782 0.397-1.407 0.717-1.875s0.765-0.835 1.336-1.103 1.212-0.401 1.921-0.401c1.213 0 2.186 0.387 2.918 1.161 0.604 0.633 0.905 1.348 0.905 2.145 0 1.131-0.619 2.034-1.858 2.708 0.739 0.158 1.33 0.513 1.772 1.063 0.443 0.551 0.664 1.215 0.664 1.994 0.001 1.132-0.412 2.095-1.238 2.891z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="4"
        >
          <path
            d="M16.359 17.583v-4.405l-2.971 4.405h2.971zM16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM20.344 19.739h-1.594v2.595h-2.391v-2.595h-5.281v-2.147l5.598-8.196h2.074v8.187h1.594v2.156z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="5"
        >
          <path
            d="M16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM19.546 20.68c-0.839 1.137-2.003 1.705-3.492 1.705-1.19 0-2.16-0.319-2.911-0.959-0.75-0.641-1.199-1.502-1.346-2.582l2.469-0.256c0.070 0.559 0.278 1 0.623 1.324 0.345 0.326 0.742 0.488 1.192 0.488 0.515 0 0.949-0.209 1.307-0.627 0.355-0.418 0.534-1.049 0.534-1.893 0-0.79-0.178-1.383-0.532-1.778-0.355-0.395-0.818-0.593-1.388-0.593-0.71 0-1.348 0.312-1.911 0.938l-1.997-0.289 1.266-6.711h6.531v2.312h-4.658l-0.397 2.192c0.553-0.273 1.117-0.411 1.693-0.411 1.099 0 2.030 0.399 2.795 1.196s1.146 1.832 1.146 3.103c-0.001 1.062-0.309 2.009-0.924 2.841z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="6"
        >
          <path
            d="M16.062 16.037c-0.476 0-0.877 0.186-1.205 0.558-0.329 0.372-0.493 0.921-0.493 1.647 0 0.803 0.185 1.422 0.555 1.858 0.369 0.437 0.791 0.655 1.267 0.655 0.457 0 0.839-0.18 1.144-0.537s0.457-0.942 0.457-1.757c0-0.838-0.164-1.451-0.492-1.841s-0.74-0.583-1.233-0.583zM16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM19.047 21.607c-0.773 0.797-1.768 1.194-2.98 1.194-1.302 0-2.372-0.505-3.21-1.516s-1.258-2.667-1.258-4.97c0-2.361 0.438-4.063 1.312-5.106s2.008-1.564 3.404-1.564c0.979 0 1.79 0.275 2.432 0.825 0.643 0.551 1.052 1.349 1.228 2.396l-2.391 0.263c-0.059-0.49-0.212-0.853-0.458-1.086-0.247-0.234-0.567-0.351-0.961-0.351-0.523 0-0.966 0.233-1.327 0.701s-0.589 1.44-0.683 2.92c0.615-0.726 1.381-1.089 2.297-1.089 1.032 0 1.916 0.392 2.652 1.176s1.104 1.797 1.104 3.038c0 1.318-0.387 2.374-1.161 3.169z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="7"
        >
          <path
            d="M16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM20.386 11.828c-0.697 0.687-1.405 1.671-2.125 2.955s-1.269 2.648-1.646 4.094c-0.377 1.445-0.562 2.736-0.557 3.873h-2.375c0.040-1.781 0.407-3.6 1.101-5.452 0.692-1.853 1.617-3.51 2.775-4.97h-5.626v-2.297h8.453v1.797z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="var(--white)"
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          version="1.1"
          class="bkc-option"
          value="8"
        >
          <path
            d="M16.214 16.662c-0.604 0-1.053 0.209-1.349 0.629-0.296 0.419-0.443 0.873-0.443 1.363 0 0.686 0.174 1.22 0.522 1.604s0.783 0.576 1.305 0.576c0.51 0 0.932-0.186 1.266-0.555s0.501-0.901 0.501-1.599c0-0.608-0.17-1.097-0.51-1.466-0.34-0.368-0.771-0.552-1.292-0.552zM16.179 14.708c0.467 0 0.84-0.14 1.12-0.418 0.279-0.279 0.42-0.665 0.42-1.158 0-0.464-0.139-0.835-0.416-1.114s-0.643-0.418-1.098-0.418c-0.473 0-0.849 0.141-1.129 0.422s-0.42 0.655-0.42 1.119c0 0.493 0.139 0.878 0.415 1.154 0.278 0.275 0.647 0.413 1.108 0.413zM16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM19.315 21.699c-0.759 0.746-1.768 1.119-3.026 1.119-1.172 0-2.146-0.309-2.926-0.926-0.919-0.729-1.379-1.727-1.379-2.996 0-0.698 0.173-1.34 0.52-1.924s0.892-1.035 1.637-1.353c-0.639-0.269-1.104-0.639-1.393-1.11-0.291-0.471-0.436-0.986-0.436-1.548 0-0.959 0.335-1.751 1.006-2.377s1.625-0.938 2.861-0.938c1.225 0 2.176 0.313 2.852 0.938 0.678 0.626 1.016 1.418 1.016 2.377 0 0.597-0.155 1.127-0.466 1.592-0.312 0.464-0.748 0.82-1.311 1.065 0.713 0.288 1.255 0.708 1.626 1.26s0.557 1.189 0.557 1.911c0 1.195-0.38 2.164-1.138 2.91z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
  </div>
      `;
}

function getTipInnerHtml(mMsg) {
  return `<div class="alert-default error" style="white-space:break-spaces;display:flex;align-items:center;padding:.9rem 1.1rem;margin-bottom:.5rem;color:var(--white);cursor:pointer;box-shadow:0 0 .7rem rgba(0,0,0,.25);border-radius:.2rem;background:linear-gradient(262.54deg,#202639 9.46%,#223163 100.16%);margin-left:1rem;border:solid .15rem var(--primary-1);font-family:Exo\\ 2;">
  <img alt="" style="width:2rem;min-width:2rem;height:2rem;margin-right:.9rem;color:var(--white);fill:currentColor;box-sizing:border-box;" src="data:image/png;base64,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" />
  <span id="BKC-dev-tip-text" class="text" style="font-size:1rem;font-weight:600;text-align:center;overflow-wrap:anywhere;">${mMsg}</span></div>`;
}
