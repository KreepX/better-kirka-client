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
    let tipchilds = document.querySelectorAll('.vue-notification-wrapper');
    let span = document.getElementsByClassName('vue-notification-group')[0].getElementsByTagName('span')[0];
    if (tipchilds.length >= DevTooltipsMaxTips) {
      let trimLen = tipchilds.length - DevTooltipsMaxTips;
      for (let i = -1; i < trimLen; i++) {
        span.removeChild(tipchilds[i]);
      }
    }
    let newtip = document.createElement('div');
    newtip.setAttribute('data-id', tipchilds ? tipchilds.length + 1 : '1');
    newtip.className = 'vue-notification-wrapper vn-fade-move';
    newtip.style = 'transition-timing-function:ease;transition-delay:0s;transition-property:all;';
    newtip.id = `BKC-dev-tip${++devid}`;
    newtip.innerHTML = `<div class="alert-default error" style="white-space:break-spaces;display:flex;align-items:center;padding:.9rem 1.1rem;margin-bottom:.5rem;color:var(--white);cursor:pointer;box-shadow:0 0 .7rem rgba(0,0,0,.25);border-radius:.2rem;background:linear-gradient(262.54deg,#202639 9.46%,#223163 100.16%);margin-left:1rem;border:solid .15rem var(--primary-1);font-family:Exo\\ 2;">
                        <img alt="" style="width:2rem;min-width:2rem;height:2rem;margin-right:.9rem;color:var(--white);fill:currentColor;box-sizing:border-box;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAABfGlDQ1BpY2MAACiRfZE9SMNAHMVfU6UqlSJ2EHHIUJ0siIo4ShWLYKG0FVp1MLn0C5o0JCkujoJrwcGPxaqDi7OuDq6CIPgB4ujkpOgiJf4vKbSI8eC4H+/uPe7eAUKjwlSzawJQNctIxWNiNrcqBl7RixAGMIiAxEw9kV7MwHN83cPH17soz/I+9+foV/ImA3wi8RzTDYt4g3hm09I57xOHWUlSiM+Jxw26IPEj12WX3zgXHRZ4ZtjIpOaJw8RisYPlDmYlQyWeJo4oqkb5QtZlhfMWZ7VSY6178hcG89pKmus0RxDHEhJIQoSMGsqowEKUVo0UEynaj3n4hx1/klwyucpg5FhAFSokxw/+B7+7NQtTk25SMAZ0v9j2xygQ2AWaddv+Prbt5gngfwautLa/2gBmP0mvt7XIERDaBi6u25q8B1zuAENPumRIjuSnKRQKwPsZfVMOGLwF+tbc3lr7OH0AMtTV8g1wcAiMFSl73ePdPZ29/Xum1d8PNwFyj5nJsJ8AAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YJDxEhI2qmjc4AAAHBelRYdFJhdyBwcm9maWxlIHR5cGUgaWNjAAA4jaVTW44cIQz85xQ5gvGzOU4PNFLuf4EYDPPa2UibWEKIMrbLpki/a02/hqlhgmF4glYlbUbANCFtehkbCrIxIsghRU4EsEvdXXx1gJx9jQBLmpWMDLgJsQrDP1j3qoNR3kAjbHdmP7T0w/tNnbaRRqGMC2ZI3hgYWrSUdTlIzXxCsPFyBJ7Z+R4+joWfNXCsycc5xxiO9gh4wa96x+0J34QcH4nYXyaoYl7DRvCAz/g399OgaqgtzrQd7LNwAawWnN0Lzhu33Ronh6uJvr/SfsmqopeI0A5Ybk/gIwR2PbGTkPFqo1EdShPf3aF+aQwZ2zpfcWdIQnAlwHcC6e8M8vlgILCKYRSbRSiKMHsi7eND+MoPBvD4Ek82FAxvAnZNKRHhsyAzVI5IaVcfRijzbGUy7K3AxG9nnntblajVmag6i08MtEdndPRISOUjU+TSg1E/5mvctPLHhFhs+u2Yez6aA5pdNvc2R6I9eVS3mRdPiyFImYEUMoNTbi+6C6OdCE5qM1A4BMa1zoullHNViMRd6ne628N+e3bYf+6L8P4j0asQ0x8VmCA0X5Y6uAAADAdJREFUWMPtmF2MXdV1x39r733OuffO3Lkz4/GMPWbsMcYxxnwPBZuP2EmhQCgVoShJVdKnKooqqqpV1YcqUlVVearUpyRtKqVpWtRUpVGilJJCAoTYJGDADsQf2Aab8cfYnrHn+36cc/beqw93DDhQqWnzmCUd6ZyHc85vr73W+q+94Ff2i5n8oi9M1G8mgnEwAKwXYQzoBTqqnDYix4adzL3cDqyy4vKoerxVBOcs3r/xywO7qX4zpntbBbakIjtqhu09ItetsrJ+tTN9VcGWSpwJujzl46H5oN8xQl+PyDYE34y6v1T9bo8xhwpV3b3w2v8d7Pa+CQoUgQEHDzSs+czGxNy6LbNDVyZG1jih14CoElAsQlvhnxdLznnVj/UksjnpLulQHni2VU6eKfWvEuEby1FVQKzBo/DS4r7/HdhHGxOsTmCq4PYBK39xS8Xu+nhPkm5NDTUjLMXI6bLkgvcUGlEFD7zSESKO3+9PGbLQ1ohF6DGGw0Xkb+fy2bfL+PUEhgXqufK8CI8rzDrghfd58gNgOxsTdCIY4f6NifnKZxvp+K1Vx1kfea3jOV5ELoRIK0YcMOyUTQkcL2ExOj4/kFKqZ6r05BqJKlSNYWuW8XapfGUu57fqCaut4YVWGfe2w7+U8EcWZt8PZn8ebH1lFA9Xb0rM1x4bzDZvTC2PLxQ80/QYEa7NLDuqCbdVE9anjvNB2NuB6SDc05NwMC95rlky5ZXzAV4vhNdz5dVOABHmorK9Yrm96ri56mTK67UnfVxwwp4N2SiT+dkPgu1sTPCjhYtsrdb+7LON9KHNqeHv5gvqVnik7pioGK6vOEacYSYoR4rIYlSmgzIXleNlpG4M2yopYHg1V65KHY/2Z1yZWN4plcN5pKMei2fIGcYSK6+0w8h81O84keUPBRuvjFJLqsM3Ze4v768nI99cLLi2YvlYTVgMngHrWIiRby4WPNsKjDjDptSwMTGscYYSqBnhusyyLXNsSS378sDmBDYmwvaqY9AZXu0ERqySirApS/hZHhqnfNyTiBwdr3S99gEwDx+5LrOPXYxarYpwd81wNC9YkyQ0Y+C7SwVvl/CHAxUGrbCn5ZksI0tRqQg0IzzV9OxpezIR6lb4absgwbMYIzdUUvbnEUdkxApjacrFoO5neVzyyvesoJP52Usl6j2rivSf8rFyNA/c02M5XZYUqsx4z9G84GgBD/QmnPeev5/PWesMY4mhJlBqYC5GBIiq7Ot4Bo2wqIIHlmNEUWoilAqFKl6VO2qODYl5OMKuuBJS7tcbE7apelMqcl9F5Aoruvm8j5WttYQ+A2+FQFBl2ntmAijCgFG+vVRwfZbQjsqBvKTXKBeCcFUSQYVJD1Uj9FkhKkSFXmuICHMxsi6BlirzITDmHA/1Jqu/Op9/YTnyeipccDl86qrU/vW9Pcm6isAPmp6qgY2JoRMjpSoAhwt4Ixd6jNCMkfkAO6qGZ5olOypKn4FvL8PRUriroiy0hBsrFgFSASewJnEcKyLtGBm04FU5U5ascpZdPQl7O+HO3S3/oMLXTU3kD36nka77TF9CIl2gQSPUjVCgKKDAGS9MVJKVOFKMQK5QFWEmwms5VI0BhKkAQ1Z4oDdhsowMWqXXGKpiebrpGU+UbKWCzoTA+dLTa2Bnzbkewyc7qlWTCJVVRojAyTIy5ITMCOWKzMhKFU4FvAYCysUQ2eCUPS1Pwwq72wLiuKPmaEblzcLw230ZDQMnisCwhSFnOVB0Y/UjSXexAEGVE0VBM0a2pIbV1lwXlfVmKeqLb3QCQaFQ6DXCKitMe6VqBLMCNmiUMz7SK8qhXNmSwmrrOZx7AJwIzzY9hQqP9KVcm8GLrQ6LK9vWbyz7O4ENTqm+T28EWIqRk0VJ3QgNI/3AiMlVv7Wn7aeng5KIkIgwnhhOlpFUDD3WosAVDhYjDFrljIcjBYwncHOm9Ajsbnnmo/K5gZRbK8KhTodpH7BAjwg1Y+nE97bw/abAWe9pxoh2H9UY5JVTZXxhX8czYGEhKptTy2JUznm4InEADFpYa2HKCzdlyrFS+H5LOFgIaxwMW/h0PeHOquVYntOO+m4tEuk2a4tROekhfEgnUcTIW4XnYtBpI5w2qdBpK0/8uB2KNc7wVhHoNcKW1PLDVslalzDkunA3ZkpHYSYKH68q99WUT/QoVyfKamu4tzdhPgSWYyQAmXS7jvMevrGQUygsR0MzXt49CFACzzQ9MyH+J8qk6bpSX3gzDwdWHvhpx3Nvj+PNPHIwj2zNMurGUDPw0aoyH2B3W1iO3Z/nChH4SdvzxJLn2VbXm3vawsUAT7egVMPnB1J6jdDR94AMsBzhx23hQK4xwnSvFex4ZRRnpNmMrBt2snNH1fHkcsmOqmPAGv59qWTYWTZnjnaMGJSxBBYi7O0Ip71wIQgt7YL2GcMqa/EYznilbg339Sb8biOl1MjulmeDU2oGliK8WcBLuZAJfKLuZDZw04zXU3YyP8t4NkqBtiM8/FA9qZ73gedbkd/oTRhywj8tFBwtlGUV3iqVyRKWVDAiZGLpd5Yh1y0581FZiMqANdzd4/hUX8o1mXDOF+xrFxwrYcjBwUI4WBg6amlHZVdNGbUwnLjawSKut5fEOyDzuepdV2d2020Vy+t5wZ525NeqjiFreL7lWessI84xniaMOktQoaVKjxHWJ4YtmXBDZpioGK7NhIaJXPQlk2XJfAhMlnC4EGaCUDXwSD3lwXrGq53AkFVWOeFcEA4V8cS7YE4o20p/Jtz/0Z5EeiUyFzxPNwNOhESgauDTfSnnfGRPOzCWGB6qp2yvGlaZAOppx8DF4HmrCLzaiezPleNlNwne8d2Q31lVtmVwZeoYdo6X2p4RZ5gOhu81w4GlyJ86VnrtnY0JBJ55pRNOH8zj2NZKSqGRERs5UBRMeeFADifKSN0Iv9dI2eDgVFlyJPd0VFmKcMbDaS94FcYSy0TVEIHnm57ZELm/poy6brKIdLffA8+31M+E+INm1D9vRfa799cTJ7SXoxaPLxT8yWDG9dUKieT028BMUN4shINF5MHeBNXIc82CCyFyMcCFIJQIo85yf6/lmsxSN8JsUI4UAbNSpEdWoDIRBq1hISjTXhfeKeMXDXxNYbZh4TKwdlQdTw1jifDluZxHGyk3VKpM+ZLesmSVjczFrvT8sNUV84iwxhquySzjiaHHCAtR+dZiyZSPLMVIRZSNiTLu3isRG9KUhrHsbXsuhPgjRb+UiLQvHUguAwvQ9Mr8rqrlxVbOl2c73Fx13FVzXF2xNENgyntOeeHe3oQDncDhosRr5HgRebsAK1AR6DfKVQkMGOgx3R4+AqkIG9OUDWnKbFCeaZbtZuTxTKR92e79nGYtLkY9eiEycWfNMGgDR4qCL3U8/daw1hm8Wt4pPaus8LmBlNfakamyK+SGLtgl4WcFRlfiacRaNqQpg9ZSKPzbUsGBPDwh8KRw+bny3Z5/vDJKJqIdpV4x8pvbq84UGljnYCxRMokshsByDBTAhQC3VhIGrX23oRR5T5R1Ba4iwkiSsDlNGV9RkJYq/7pY8h/L5XMd5Y+tMCPw7tHtMrDJ/OxKPWNqNuqdGxK7fktmWQjdHr7fwFoHYw7WOdifK0POsDm1DDpHzRgSESrGUDeG1c4xliRcmWWsSxLqxmCAd8rIP8wX4b+a5ZPtyGPACSeXe+sysEteQ2h2IpMnyrhrXeIa11VSnKwcHLiUUd3rJx1lLLGsdYY+axl2jjVJwtokYbVzNKylYrpuPO+Vp5ZL/nGhOL+/E/6mVL4AnEk+BOqSjl5mOxsTjGVwvMPdDSNfvKVqb7mr5swVTkAjbY3kGikUXm4rhwt4tJFyS8WRSveD2k0kmlE5VnRHC/s6YfpkGZ/qKF9NhFeiEl5c/J+nPh86VNnZN8G8KjWRUeDhuuGTo85cv9aZ/oYVFxXmYixPl3r+jI+7+43031ixd4w6U68YkVZUZoMWUz7OTpbxyFzQZz36pEUOKJQvLf4/xlDQHUW9eNs9bH/5+71RdZMIVxlkuJtteg44nIm8vRg0S4QbE5FtBvoiLHnV0x5OCEz2OVluBWXvh4ybfmW/LPtvINcVpo5Q7cwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDktMTVUMTc6MzA6NDcrMDA6MDA5A5WhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA5LTE1VDE3OjI5OjUzKzAwOjAwTSD9mgAAABt0RVh0aWNjOmNvcHlyaWdodABQdWJsaWMgRG9tYWlutpExWwAAACJ0RVh0aWNjOmRlc2NyaXB0aW9uAEdJTVAgYnVpbHQtaW4gc1JHQkxnQRMAAAAVdEVYdGljYzptYW51ZmFjdHVyZXIAR0lNUEyekMoAAAAOdEVYdGljYzptb2RlbABzUkdCW2BJQwAAAABJRU5ErkJggg==" />
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
    permcrossstyle.innerHTML = 'img#crosshair-static{opacity:1!important;}';
  } else {
    permcrossstyle.innerHTML = '';
  }
}

function playerHighLightFunc() {
  if (ShouldHiglight) {
    let localPlayerClass = scene['children']['0']['parent']['entity']['_entityManager']['mWnwM']['systemManager']['_systems']['0']['_queries']['player']['entities']['0']['_components']['38'].wnWmN;
    let qNum = 2;

    if (!scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems'][qNum]['_queries'].players 
    && !scene['entity']['_entityManager']['mWnwM']['systemManager']['_systems'][++qNum]['_queries'].players) return;

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
  // adds checkboxes beside server lobby join buttons
  // to attenmpt to join them when they become unlocked

  let children = document.querySelector('html body div#app div#view div.background div.container div.content div.servers div.container-games div.list-cont div.list')?.children;
  if (children) {
    for (var i = 0; i < children.length; i++) {
      if (!children[i].classList.contains('available-rooms') && !children[i].classList.contains('no-free')) {
        if (!children[i]?.querySelector('#JWF-cb') && children[i].getElementsByClassName('right')?.[0]) {
          var x = document.createElement('INPUT');
          x.type = 'checkbox';
          x.className = 'input-checkbox  button';
          x.id = 'JWF-cb';
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
            children[i].querySelector('#JWF-cb').checked = true;
            if (!children[i].classList.contains('locked')) {
              children[i].getElementsByClassName('button join')[0].click();
            }
          } else {
            children[i].querySelector('#JWF-cb').checked = false;
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
    }
  }
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
  } else if (event.target.className === 'POINT-checkbox') {
    GameModesShowPOINT = event.target.checked;
    settings.set('GameModesShowPOINT', GameModesShowPOINT);
  } else if (event.target.className === 'PHY-checkbox') {
    GameModesShowPHY = event.target.checked;
    settings.set('GameModesShowPHY', GameModesShowPHY);
  }
  ShowHideGameModes();
}

const gamemodesobserver = new MutationObserver(() => {
  ShowHideGameModes();
  JoinLobbyWhenUnlocked();
});

function SetGameModesCheckBoxes() {
  let p = document.querySelector('#view > div > div > div.content > div.servers > div > div.list-cont > div.tabs');
  if (p && !p.querySelector('div.mods.tabmods')) {
    let modesCont = document.createElement('div');
    modesCont.className = 'mods tabmods';
    modesCont.setAttribute('style', 'display:flex;font-size:1rem!important;margin:0 0 0 auto;');
    modesCont.innerHTML = `
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
    
    <div class="PHY" style="margin-right:.5rem!important;height:3.1vh;margin:auto;">
    <label class="custom-checkbox checkbox-size">
    <input type="checkbox" class="PHY-checkbox">
    <span> Physics </span>
    </label>
    </div>
    `;
    modesCont = p.appendChild(modesCont);
    modesCont.getElementsByClassName('DM-checkbox')[0].checked = GameModesShowDM;
    modesCont.getElementsByClassName('TDM-checkbox')[0].checked = GameModesShowTDM;
    modesCont.getElementsByClassName('P-checkbox')[0].checked = GameModesShowP;
    modesCont.getElementsByClassName('POINT-checkbox')[0].checked = GameModesShowPOINT;
    modesCont.getElementsByClassName('PHY-checkbox')[0].checked = GameModesShowPHY;
    modesCont.addEventListener('change', GameModesCheckBoxChangeHandler);

    gamemodesobserver.observe(document.querySelector('#view > div > div > div.content > div.servers > div > div.list-cont > div.list'), {
      childList: true,
      attributes: true,
      subtree: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
    });
  }
}

if (typeof settings.get('pendingImport') !== 'undefined') {
  let savedStorage = settings.get('pendingImport');
  Object.assign(localStorage, savedStorage);
  settings.delete('pendingImport');
  window.location.reload();
}

let DevToolTips = true;
let DevTooltipsTimeout = 10000;
let DevTooltipsMaxTips = 5;
let devid = 0;
let EnemyhighlightColor = typeof settings.get('EnemyhighlightColor') === 'undefined' ? settingsSetGit('EnemyhighlightColor', '#ff00ff') : settings.get('EnemyhighlightColor');
let TeamhighlightColor = typeof settings.get('TeamhighlightColor') === 'undefined' ? settingsSetGit('TeamhighlightColor', '#0000ff') : settings.get('TeamhighlightColor');
let GameModesShowPOINT = typeof settings.get('GameModesShowPOINT') === 'undefined' ? settingsSetGit('GameModesShowPOINT', true) : settings.get('GameModesShowPOINT');
let GameModesShowTDM = typeof settings.get('GameModesShowTDM') === 'undefined' ? settingsSetGit('GameModesShowTDM', true) : settings.get('GameModesShowTDM');
let GameModesShowPHY = typeof settings.get('GameModesShowPHY') === 'undefined' ? settingsSetGit('GameModesShowPHY', true) : settings.get('GameModesShowPHY');
let GameModesShowDM = typeof settings.get('GameModesShowDM') === 'undefined' ? settingsSetGit('GameModesShowDM', true) : settings.get('GameModesShowDM');
let GameModesShowP = typeof settings.get('GameModesShowP') === 'undefined' ? settingsSetGit('GameModesShowP', true) : settings.get('GameModesShowP');
let TwitchHeight = typeof settings.get('TwitchHeight') === 'undefined' ? settingsSetGit('TwitchHeight', 'auto') : settings.get('TwitchHeight');
let TwitchWidth = typeof settings.get('TwitchWidth') === 'undefined' ? settingsSetGit('TwitchWidth', 'auto') : settings.get('TwitchWidth');
let TwitchLeft = typeof settings.get('TwitchLeft') === 'undefined' ? settingsSetGit('TwitchLeft', '-65vw') : settings.get('TwitchLeft');
let ShowTwitch = typeof settings.get('ShowTwitch') === 'undefined' ? settingsSetGit('ShowTwitch', true) : settings.get('ShowTwitch');
let TwitchTop = typeof settings.get('TwitchTop') === 'undefined' ? settingsSetGit('TwitchTop', '40vw') : settings.get('TwitchTop');
let guiHeight = typeof settings.get('guiHeight') === 'undefined' ? settingsSetGit('guiHeight', '95%') : settings.get('guiHeight');
let guiWidth = typeof settings.get('guiWidth') === 'undefined' ? settingsSetGit('guiWidth', '51%') : settings.get('guiWidth');
let capture = typeof settings.get('capture') === 'undefined' ? false : settings.get('capture');
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
let livestreamers;
let notificationsonclick;
let GuiResizeObserver;
let TwitchResizeObserver;
let cssLinkElem;
let QuestInterval;
let permcrossstyle;
let claimedQuest = false;
let gamemodee = false;
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

  if (TwitchHead.getElementsByClassName('head')[0]) {
    TwitchHead.getElementsByClassName('head')[0].onmousedown = TwitchDrag;
  } else {
    TwitchHead.onmousedown = TwitchDrag;
  }

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
    window.requestAnimationFrame(() => {
      TwitchHead.style.top = `${TwitchHead.offsetTop - lsmpos2}px`;
      TwitchHead.style.left = `${TwitchHead.offsetLeft - lsmpos1}px`;
    });
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
  }
  if (TwitchHeight !== streamsmenu.style.height) {
    TwitchHeight = settingsSetGit('TwitchHeight', streamsmenu.style.height);
  }
}

function SetTwitchLinks() {
  for (let link of streamsmenu.querySelectorAll('div.list>div.item')) {
    let l = link.querySelector('.name')?.innerHTML;
    if (l) {
      link.onclick = () => {
        shell.openExternal(`https://www.twitch.tv/${l}`);
      };
    }
  }
}

TwitchResizeObserver = new ResizeObserver(SaveTwitchSize);

function ShowliveStreams() {
  let defStremzMenu = document.querySelector('.live-streams');
  if (defStremzMenu) {
    if (!document.querySelector('#live-streams-menu')) {
      streamsmenu = document.getElementsByClassName('live-streams')[0].cloneNode(true);
      streamsmenu.style = `position:absolute;resize:both;overflow: auto hidden!important;opacity:1!important;z-index:3!important;min-height:5vh!important;pointer-events:all!important;
      top:${TwitchTop};left:${TwitchLeft};width:${TwitchWidth};height:${TwitchHeight};${ShowTwitch ? 'display:block!important;' : 'display:none!important;'}`;
      for (let crap of streamsmenu.getAttributeNames()) {
        if (/data-v/.test(crap)) {
          streamsmenu.removeAttribute(crap);
        }
      }
      streamsmenu.id = 'live-streams-menu';
      streamsmenu = document.querySelector('#right-interface').appendChild(streamsmenu);
      livestreamers = defStremzMenu.querySelectorAll('[target="_blank"]').length;
      TwitchResizeObserver.observe(streamsmenu);
      MoveTwitchMenu(streamsmenu);
      SetTwitchLinks();
    } else {
      let currentlen = defStremzMenu.querySelectorAll('[target="_blank"]').length;
      if (currentlen > livestreamers) {
        livestreamers = currentlen;
        streamsmenu.innerHTML = defStremzMenu.innerHTML;
        MoveTwitchMenu(streamsmenu);
        SetTwitchLinks();
      }
    }
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

async function CheckQuest() {
  if (localStorage.token === '') return true;

  let quests = await fetch('https://api.kirka.io/api/quests', {
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
    body: '{}',
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });

  if (quests.status >= 400) return false;

  quests = await quests.json();

  for (let quest of quests) {
    if (quest.progress.completed && !quest.progress.rewardTaken) {
      //prettier-ignore
      BKC.tip(`${toTitleCase(quest.type)} Quest Completed:
${quest.amount} ${toTitleCase(quest.name)} ${quest.weapon !== 'undefined' ? quest.weapon : ''}
XP:  ${quest['rewards'][0].amount}   COINS:  ${quest['rewards'][1].amount}`);

      await fetch('https://api.kirka.io/api/rewards/take', {
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
    }
  }
  return true;
}

function checkclaimQuest() {
  CheckQuest()
    .then((result) => {
      if (!result) {
        QuestInterval = setTimeout(() => {
          checkclaimQuest();
        }, 15000);
        BKC.tip(`Failed Claiming Quest Trying Again In 15 Seconds`);
      }
    })
    .catch((error) => {
      BKC.tip(error);
    });
}

const Questobserver = new MutationObserver(() => {
  let remElement;
  let notis = document.querySelectorAll('html body div#app div#notifications span div.vue-notification-wrapper div span.text');
  for (let i = 0; i < notis.length; i++) {
    remElement = notis[i].parentElement.parentElement;
    if (/you completed a quest/i.test(notis[i]?.innerHTML)) {
      if (remElement.style.display !== 'none') {
        remElement.setAttribute('style', 'display: none!important');
      }
      if (!claimedQuest) {
        claimedQuest = true;
        checkclaimQuest();
      }
    } else if (/Failed to connect to the room/i.test(notis[i]?.innerHTML) && !window.location.href.startsWith('https://kirka.io/servers/')) {
      if (remElement.style.display !== 'none') {
        remElement.setAttribute('style', 'display: none!important');
        document.querySelector('.icon-btn.text-1.SERVERS').click();
      }
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

const SomeObserver = new MutationObserver(() => {
  if (window.location.href === 'https://kirka.io/') {
    ShowliveStreams();
  } else if (/kirka[.]io[/]servers/.test(window.location.href) && !document.querySelector('#view > div > div > div.content > div.servers > div > div.list-cont > div.tabs > div.mods.tabmods')) {
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

  if (!discclick && document.querySelector('.soc-icon.svg-icon.svg-icon--discord')) {
    let p = (document.querySelector('.soc-icon.svg-icon.svg-icon--discord').parentElement.onclick = () => shell.openExternal('https://discord.com/invite/cNwzjsFHpg'));
    discclick = !!p;
  }

  if (!gitclick && document.querySelector('.soc-icon.svg-icon.svg-icon--gamepad2')) {
    let p = (document.querySelector('.soc-icon.svg-icon.svg-icon--gamepad2').parentElement.onclick = () => shell.openExternal('https://github.com/42infi/better-kirka-client/releases'));
    gitclick = !!p;
  }
});

SomeObserver.observe(document, { childList: true, subtree: true });

const MainObserverr = new MutationObserver(() => {
  if (!gamemodee && /kirka[.]io[/]game/.test(window.location.href) && !document.querySelector('.end-modal')) {
    gamemodee = true;
    SomeObserver.disconnect();
    if (!animate) animateState('true');
    if (TwitchResizeObserver) TwitchResizeObserver.disconnect();
    if (QuestInterval) QuestInterval = clearTimeout(QuestInterval);

    document.removeEventListener('keyup', keyup);
  } else if (gamemodee && (!/kirka[.]io[/]game/.test(window.location.href) || document.querySelector('.end-modal'))) {
    ShouldHiglight = false;
    if (animate) {
      animateState();
    }
    gamemodee = false;
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
    Sessionids = [];
    document.addEventListener('keyup', keyup);
  }
});

window.addEventListener('load', () => {
  if (document.querySelector('html body div#app')) {
    MainObserverr.observe(document.querySelector('html body div#app'), {
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
  if (customCss && !document.querySelector('#custom-css')) {
    cssLinkElem = document.createElement('link');
    cssLinkElem.id = 'custom-css';
    cssLinkElem.href = settings.get('cssLink');
    cssLinkElem.rel = 'stylesheet';
    cssLinkElem = document.head.appendChild(cssLinkElem);
  }

  gui.id = 'gui';

  let guistyles = `

  #gui {
    border: 0!important;
    background-color: rgba(24,25,28,0.95);
    box-shadow: 0 0 8px 2px #000;
    position: absolute;
    left: 5%;
    top: 2.5%;
    z-index: 300;
    color: #fff;
    font-family: "Titillium Web",serif;
    line-height: 1.6;
    border-radius: 3px;
    max-height: 95%;
    max-width: 90%;
    min-width: 21%;
    min-height: 45%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    place-content: stretch space-between;
    align-items: stretch;
    resize: both;
    overflow: auto;
    margin: auto;
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
  padding: 0 0.5rem;
}

.module {
  overflow-wrap: anywhere;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  place-content: center;
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

.footer {
  min-height: 2.3rem;
  max-height: 3.3rem;
  justify-content: center;
  align-items: center;
  margin: 0px 0px 0px 0;
  min-width: 100%;
  overflow: hidden;
  display: flex;
  padding: 0.1rem 0;
  font-size: 11px;
  border-top: 2px solid #8c8c8c;
}

.autojoin-hr {
  width: 100%;
  min-width: 10%;
  height: 1px;
  background-color: #8c8c8c;
  margin: .5rem .3rem .5rem 0;
  pointer-events: none;
}

input:disabled {
  background: #fff;
  border: 1px solid #000;
  width: 50px
}

.module:hover {
  background-color: rgb(0, 0, 0, .1)
}

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
  border: .15rem solid #3c4b68;
  border-radius: .25em;
  margin-right: .5em;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 50% 50%;
  background-color: #2f3957;
}

div#live-streams-menu>div.list{
  max-height:95vh!important;
  overflow:hidden hidden!important;
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
    border-radius: .4rem !important;
  }
  
  input.gui-color-input::-webkit-color-swatch-wrapper {
    padding: 0 !important;
    border-radius: calc(var(--b-radius) - 0.1rem)!important;
  }
  
  input.gui-color-input::-webkit-color-swatch {
    border: none !important;
    border-radius: calc(var(--b-radius) - 0.2rem)!important;
    box-shadow: rgba(0,0,0,0.5) 2px 1px 6px!important;
  }

  div.module-wrapper div.module input[type=checkbox] {
    margin: auto;
  }

  div.module label {
    margin: 0 0.5rem;
  }
  html>body>div#app>div#view{user-select:text!important;}

  .loading-scene,
  #qc-cmp2-container,
  #cmpPersistentLink {
    display:none!important;
  }
`;

  gui.innerHTML = `
    <style id="BKC-permcrosshair"></style><style id="BKC-Styles">@import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap');${guistyles}</style>

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
               <input type="checkbox" id="hideflag" name="hideflag">
               <label for="hideflag">Hide Flag ADS</label>
           </div>

           <div class="module autojoin autojoin-hr"></div>
       
           <div class="module">
               <input type="checkbox" id="highlight" name="highlight">
               <label for="highlight">Highlight Players</label>
           </div>
       
           <div class="module">
           <label for="customColor">Custom Enemy Highlight Color:  </label>
           <input type="color" id="EnemyhighlightColor" class="gui-color-input">
           </div>

           <div class="module autojoin autojoin-hr"></div>

           <div class="module">
           <label for="customColor">Custom Team Highlight Color:  </label>
           <input type="color" id="TeamhighlightColor" class="gui-color-input">
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
           <input type="checkbox" id="ShowTwitch" name="ShowTwitch">
           <label title="Show Live Kirka Twitch Streams &#013; Click And Drag The Titlebar To Move The Menu  &#013; Click And Drag The Bottom Right Corner To Resize The Menu" for="ShowTwitch">Show Live Kirka Twitch Streams Menu</label>
           </div>

           <div class="module autojoin autojoin-hr"></div>

      </div><div class="footer">Toggle With "PageUp" Key</div>
`;

  gui.onclick = (e) => {
    if (e.target.id === 'ShowTwitch') {
      ShowTwitch = e.target.checked;
      settings.set('ShowTwitch', ShowTwitch);
      let stremz = document.querySelector('#live-streams-menu');
      if (stremz) {
        stremz.style = `position:absolute;resize:both;overflow: auto hidden!important;opacity:1!important;z-index:3!important;min-height:5vh!important;pointer-events:all!important;top:${TwitchTop};left:${TwitchLeft};width:${TwitchWidth};height:${TwitchHeight};${ShowTwitch ? 'display:block!important;' : 'display:none!important;'}`;
      }
    }

    if (e.target.id === 'crosshair') {
      permCrosshair = e.target.checked;
      settings.set('permCrosshair', permCrosshair);
      permCrosshairToggleFunc();
    }

    if (e.target.id === 'hideflag') {
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

    if (e.target.id === 'highlight') {
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

    if (e.target.id === 'customCSS') {
      customCss = e.target.checked;
      settings.set('customCss', customCss);

      if (customCss) {
        if (cssField.value !== '') {
          if (!cssLinkElem) {
            cssLinkElem = document.createElement('link');
            cssLinkElem.rel = 'stylesheet';
            cssLinkElem.id = 'custom-css';
          }
          cssLinkElem.href = settings.get('cssLink');
          cssLinkElem = document.head.appendChild(cssLinkElem);
        }
      } else if (document.head.querySelector('#custom-css')) {
        cssLinkElem = document.head.removeChild(cssLinkElem);
      }
    }

    if (e.target.id === 'fpsCap') {
      fpsCap = e.target.checked;
      settings.set('fpsCap', fpsCap);
      BKC.tip('setting will apply after client restart');
    }

    if (e.target.id === 'capture') {
      capture = e.target.checked;
      settings.set('capture', capture);
      BKC.tip('setting will apply after client restart');
    }
  };

  gui.style = `display:none;width:${guiWidth};height:${guiHeight};`;

  gui = document.body.appendChild(gui);

  permcrossstyle = gui.querySelector('#BKC-permcrosshair');

  if (permCrosshair) {
    permcrossstyle.innerHTML = 'img#crosshair-static{opacity:1!important;}';
  }

  if (settings.get('menuOpen') === undefined || settings.get('menuOpen')) {
    toggleGui();
  }

  let cssField = document.getElementById('cssLink');
  if (settings.get('cssLink') === undefined) settings.set('cssLink', '');
  cssField.value = settings.get('cssLink');

  cssField.oninput = () => {
    if (customCss && cssField.value !== '') {
      if (!cssLinkElem) {
        cssLinkElem = document.createElement('link');
        cssLinkElem.rel = 'stylesheet';
        cssLinkElem.id = 'custom-css';
      }

      cssLinkElem.href = cssField.value;
      cssLinkElem = document.head.appendChild(cssLinkElem);
    } else if (document.head.querySelector('#custom-css')) {
      cssLinkElem = document.head.removeChild(cssLinkElem);
    }
    settings.set('cssLink', cssField.value);
  };

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

function toggleGui() {
  menuVisible = !menuVisible;
  if (menuVisible) {
    document.exitPointerLock();
    gui.style.display = 'flex';
    if (!GuiResizeObserver) {
      GuiResizeObserver = new ResizeObserver(SaveGuiSize);
    }
    GuiResizeObserver.observe(gui);
  } else {
    gui.style.display = 'none';
    GuiResizeObserver.disconnect();
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
