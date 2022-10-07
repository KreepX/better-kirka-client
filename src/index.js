/* eslint-disable semi */
/* eslint-disable no-shadow */
/* eslint-disable no-path-concat */
/* eslint-disable no-return-assign */
/* eslint-disable no-promise-executor-return */
/* eslint-disable arrow-parens */
/* eslint-disable no-confusing-arrow */
// const {app, BrowserWindow, clipboard, ipcMain, dialog, session, protocol} = require('electron');
const {app, BrowserWindow, clipboard, ipcMain, session, protocol} = require('electron');
const fs = require('fs');
const shortcuts = require('electron-localshortcut');
const Store = require('electron-store');
let fetch = require('node-fetch');
const prompt = require('electron-prompt'); 
/*
const {autoUpdater} = require('electron-updater');

let updateLoaded = false;
let updateNow = false;
*/

let created = false;

const _fetch = fetch;

function checkCreateFolder(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {recursive: true});
    }
    return folder;
}

let swapperFolder = app.getPath('documents') + "\\BetterKirkaClient\\swapper";
checkCreateFolder(app.getPath('documents') + "\\BetterKirkaClient\\swapper\\assets\\img");
checkCreateFolder(app.getPath('documents') + "\\BetterKirkaClient\\swapper\\assets\\glb");
checkCreateFolder(app.getPath('documents') + "\\BetterKirkaClient\\swapper\\assets\\media");

const ingameIds = [];
const badgeLinks = {default: "https://cdn.discordapp.com/attachments/738010330780926004/1017163938993020939/Untitled-finalihope.png"};

let valid = false;

const clientId = '984501931273752577';
const DiscordRPC = require('discord-rpc');
const url = require("url");

const RPC = new DiscordRPC.Client({transport: 'ipc'});

DiscordRPC.register(clientId);

Store.initRenderer();

const settings = new Store();

if (!settings.get('fpsCap')) {
    app.commandLine.appendSwitch('disable-frame-rate-limit');
    app.commandLine.appendSwitch('disable-gpu-vsync');
}

if (settings.get('capture')) {
    app.commandLine.appendSwitch('use-angle', 'd3d9');
    app.commandLine.appendSwitch('enable-webgl2-compute-context');
    app.commandLine.appendSwitch('renderer-process-limit', 100);
    app.commandLine.appendSwitch('max-active-webgl-contexts', 100);
}

app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.allowRendererProcessReuse = true;

fetch = (a, b) => a.includes(String.fromCharCode(...[52, 50, 105, 110, 102, 105])) ? _fetch(a, b) : new Promise(p => setTimeout(p, 1000));

ipcMain.on('docs', (event) => event.returnValue = app.getPath('documents'));
ipcMain.on('discord', (event) => event.returnValue = valid);
ipcMain.on('ids', (event) => event.returnValue = ingameIds);
ipcMain.on('badges', (event) => event.returnValue = badgeLinks);

ipcMain.on('pricePrompt', async (event) => {
    event.returnValue = await prompt({
        title: 'Custom List Price',
        label: 'Enter custom price (leave blank for previously selected price)',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
        icon: __dirname + "/icon.ico",
        width: 500,
        height: 180,
        alwaysOnTop: true,
    });
});

const createWindow = () => {

    created = true;

    let win = new BrowserWindow({
        width: 1900,
        height: 1000,
        title: `Better Kirka Client`,
        backgroundColor: '#222946',
        icon: __dirname + "/icon.ico",
        webPreferences: {
            preload: __dirname + '/preload/ingame.js',
            nodeIntegration: false,
            enableRemoteModule: false,
            webSecurity: false
        },
    });
    win.removeMenu();

    if (settings.get('fullScreen') === undefined) settings.set('fullScreen', true);

    win.setFullScreen(settings.get('fullScreen'));

    shortcuts.register(win, "Escape", () => win.webContents.executeJavaScript('document.exitPointerLock()', true));
    shortcuts.register(win, "F4", () => win.loadURL('https://kirka.io/'));
    shortcuts.register(win, "F5", () => win.reload());
    shortcuts.register(win, "F6", () => win.loadURL(clipboard.readText()));
    shortcuts.register(win, 'F11', () => {
        win.setFullScreen(!win.isFullScreen());
        settings.set('fullScreen', win.isFullScreen());
    });
    shortcuts.register(win, 'F12', () => win.webContents.openDevTools());

    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = decodeURIComponent(request.url.replace('file:///', ''));
        callback(pathname);
    });
    initResourceSwapper();

    win.loadURL('https://kirka.io/');

    win.webContents.on('new-window', (e, url) => {
        e.preventDefault();
        win.loadURL(url);
    });

    win.on('page-title-updated', (e) => {
        e.preventDefault();
    });

    /*
    autoUpdater.checkForUpdates();

    autoUpdater.on('update-available', () => {

        const options = {
            title: "Client Update",
            buttons: ["Now", "Later"],
            message: "Client Update available, do you want to install it now or after the next restart?",
            icon: __dirname + "/icon.ico"
        }

        dialog.showMessageBox(options).then((result) => {
            if (result.response === 0) {
                updateNow = true;
                if (updateLoaded) {
                    autoUpdater.quitAndInstall();
                }
            }
        });

    });

    autoUpdater.on('update-downloaded', () => {
        updateLoaded = true;
        if (updateNow) {
            autoUpdater.quitAndInstall();
        }
    });
    */

}

app.on('ready', discRpc);

app.on('window-all-closed', app.quit);

//improved swapper from here https://github.com/McSkinnerOG/Min-Client/blob/main/src/main.js#L194
const initResourceSwapper = () => {
    let swap = {filter: {urls: []}, files: {}};
    const allFilesSync = (dir) => {
        fs.readdirSync(dir).forEach(file => {
            const filePath = dir + '/' + file
            let useAssets = !(/BetterKirkaClient\\swapper\\(css|docs|img|libs|pkg|sound)/.test(dir));
            if (fs.statSync(filePath).isDirectory()) {
                allFilesSync(filePath);
            } else {
                let kirk = '*://' + (useAssets ? 'kirka.io' : '') + filePath.replace(swapperFolder, '').replace(/\\/g, '/') + '*';
                swap.filter.urls.push(kirk);
                swap.files[kirk.replace(/\*/g, '')] = url.format({
                    pathname: filePath,
                    protocol: '',
                    slashes: false
                });
            }
        });
    };
    allFilesSync(swapperFolder);
    if (swap.filter.urls.length) {
        session.defaultSession.webRequest.onBeforeRequest(swap.filter, (details, callback) => {
            let redirect = swap.files[details.url.replace(/https|http|(\?.*)|(#.*)/gi, '')] || details.url;
            callback({cancel: false, redirectURL: redirect});
        });
    }
}

let startTime = Date.now();

async function setActivity() {
    if (!RPC) return;
    await RPC.setActivity({
        startTimestamp: startTime,
        largeImageKey: `rosenowhite`,
        largeImageText: 'BKC',
        buttons: [
            {
                label: `Download`,
                url: `https://github.com/42infi/better-kirka-client/releases`
            },
            {
                label: `Discord`,
                url: `https://discord.gg/cNwzjsFHpg`
            }
        ]
    });
}

function discRpc() {

    RPC.on('ready', async () => {

        let donatorJson;
        const discordIds = [];

        try {

            donatorJson = await fetch('https://raw.githubusercontent.com/42infi/better-kirka-client/master/donators.json', {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                referrerPolicy: 'no-referrer'
            });

            donatorJson = await donatorJson.json();

            for (let donator of donatorJson.donators) {
                if (donator.tier > 1) {
                    discordIds.push(donator.discordId);

                    for (let ingameId of donator.ids) {
                        badgeLinks[ingameId] = donator.customBadge;
                        ingameIds.push(ingameId);
                    }
                }
            }

        } catch (e) {
            console.log(e);
            if (!created) createWindow();
        }

        valid = discordIds.includes(RPC.user.id);

        if (!created) createWindow();
        await setActivity();

        setInterval(() => {
            setActivity();
        }, 30 * 1000);
    });

    RPC.login({clientId}).catch(err => {
        if (!created) createWindow();
        console.log("error");
        console.error(err);
    });
}
