'use strict';
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const child = require('child_process');
const log = require('electron-log');
const {autoUpdater} = require('electron-updater');
const isDev = require('electron-is-dev');

// Live reload magic
require('electron-reload')(__dirname);

//Our Application Menu Items & logic
const appMenu = require('./app-menu');

//-------------------------------------------------------------------
// Logging
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------

const appDirectory = app.getPath('userData');
var logFile = path.join(appDirectory, 'NuCache.Explorer.log.txt');

autoUpdater.autoDownload = false
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.logger.transports.file.file = logFile;

log.info(`App starting - Version:${app.getVersion()}`);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = BrowserWindow;

let apiProcess = child.spawn;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800, 
    height: 600,
    center: true,
    show: false,
    minWidth: 800,
    minHeight: 600
  });

  // and load the index.html of the app.
  win.loadFile('index.html');
  
  win.once('ready-to-show', () => {

    log.info('Application Ready to Show...');

    //Register nucache:// url type - may help with file assocation stuff
    app.setAsDefaultProtocolClient('nucache');
    
    var result = app.setJumpList([      
      { type: 'frequent' }
    ]);

    log.info(`Result of adding jumplist = ${result}`);

    let currentTitle = win.getTitle();
    win.setTitle(`${currentTitle} - Version ${app.getVersion()}`);
    win.show();

    if(process.argv.length === 2){
      //Second arg
      //DEV it will be '.' otherwise release app it will be the file to open
      if(process.argv[1] !== '.'){
        var fileToOpen = process.argv[1];
  
        appMenu.openFile(fileToOpen, win);
      }
    }

  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.once('ready', () => {  

  log.info('Application Ready...');
  log.info(`Process Platform ${process.platform}`);

  let apipath = path.join(__dirname, '..\\..\\Nucache.Explorer.Server\\bin\\debug\\Nucache.Explorer.Server.exe');
  apiProcess = child.spawn(apipath);
  log.info(`Booting NuCache Server - ${apipath}`);

  apiProcess.stdout.on('data', (data) => {
    log.info(`NuCache Server - stdout ${data}`);
  });

  apiProcess.stderr.on('data', (data) => {
    log.info(`NuCache Server - stderr ${data}`);
  });

  apiProcess.on('error', (err) => {
    log.info(`NuCache Server - General Error ${err}`);
  });

  apiProcess.on('close', (code) => {
    log.info(`NuCache Server - Recieved Close Code ${code}`);
  });

  //Create Window
  createWindow();

});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    log.info('All windows are closed - Quit NuCache Explorer');
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
})

  
app.on('quit', () => {
  log.info('NuCache Explorer Quit - Kill NuCache Server Process');
  apiProcess.kill();
});



  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.