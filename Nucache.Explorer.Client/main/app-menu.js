const { dialog, Menu, shell, app, BrowserWindow } = require('electron');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const updateCheck = require('./update-checker');
const log = require('electron-log');
const openAboutWindow = require('about-window').default;

let child = null;

const template = [
    {
        label: 'File',
        submenu: [
            {
                id:'nucache.open',
                label: 'Open NuCache',
                accelerator: 'CmdOrCtrl+O',
                click: (menuItem, focusedWindow) => {
                    openFileDialog(focusedWindow);
                }
            },
            {
                id:'nucache.close',
                label: 'Close NuCache',
                enabled: false,
                click: (menuItem, focusedWindow) => {

                    //Disable the close menu item & re-activate the open menu item
                    updateMenuEnabledState('nucache.open', true);
                    updateMenuEnabledState('nucache.close', false);
                    updateMenuEnabledState('nucache.export', false);

                    //Resets the UI later to open a new nucache file
                    //By sending a signal/event that we listen for
                    focusedWindow.webContents.send('nucache.closed');
                }
            },
            {
                id: 'nucache.export',
                label: 'Export Documents',
                enabled: false,
                accelerator: 'CmdOrCtrl+S',
                click: (menuItem, focusedWindow) => {
                    //Open Save Dialog
                    dialog.showSaveDialog({
                        title: 'Export Documents',                        
                        filters: [{name: 'JSON', extensions: ['json']}],
                    }, (fileName) => {
                        
                        //fileName = C:\Code-Personal\Nucache.Explorer\Test Files\my-export.json

                        //Send out a message with the path to the file we are saving
                        //The app.js file will get the current status & reply back with its contents
                        //In the reply message - we can then do the physical file save
                        focusedWindow.webContents.send('nucache.savejson', fileName);
                    });
                }
            },
            {
                type: 'separator'
            },
            {
                id: 'nucache.pref',
                label: 'Preferences',
                accelerator: 'CmdOrCtrl+,',
                click: (menuItem, focusedWindow) => {

                    if(!child){
                        child = new BrowserWindow({
                            parent: focusedWindow,
                            width:500,
                            height:400,
                            center:true,
                            enableLargerThanScreen: false,
                            fullscreenable: false,
                            title: 'NuCache Explorer - Preferences',
                            minimizable: false,
                            maximizable: false,                        
                            resizable: true,
                            show: false                     
                        });

                        child.setMenu(null);

                        child.loadFile('preferences.html');

                        child.once('ready-to-show', () => {
                            child.show();
                        });
                        
                        child.once('closed', () => {
                            child = null;
                        });
                    }                    
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                id:'nucache.devtools',
                label: 'Toggle Developer Tools',
                accelerator: (() => {
                    if (process.platform === 'darwin') {
                        return 'Alt+Command+I';
                    } else {
                        return 'Ctrl+Shift+I';
                    }
                })(),
                click: (menuItem, focusedWindow) => {
                    if (focusedWindow) {
                        focusedWindow.webContents.toggleDevTools();
                    }
                }
            }
        ]
    },
    {
        label: 'Help',
        role: 'help',
        submenu: [
            {
                id:'nucache.about',
                label: 'About',
                click: () => {                    
                    openAboutWindow({
                        icon_path: 'icon.png',
                        win_options: {
                            maximizable: false,
                            minimizable: false
                        }
                    });
                }
            },
            {
                id:'nucache.log',
                label: 'View Log File',
                click: () => {

                    //appDirectory C:\Users\warre\AppData\Roaming\NuCache Explorer
                    const appDirectory = app.getPath('userData');
                    var logFile = path.join(appDirectory, 'NuCache.Explorer.log.txt');
                    
                    //Open the folder that contains the log.log file
                    shell.openItem(logFile);
                }
            },
            {
                id:'nucache.updatecheck',
                label: 'Check for Updates',
                click: (menuItem, focusedWindow, event) => {
                    updateCheck.checkForUpdates(menuItem, focusedWindow, event);
                }
            },
            {
                id:'nucache.learn',
                label: 'Learn More',
                click: () => {
                    shell.openExternal('https://github.com/warrenbuckley/Nucache.Explorer');
                }
            }
        ]
    }
];
  
const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);


function updateMenuEnabledState(menuId, enabledState){
    var menuToUpdate = menu.getMenuItemById(menuId);

    if(menuToUpdate){
        menuToUpdate.enabled = enabledState;
    }
};

function openFile(filePath, focusedWindow){
    //Disable the file open menu item & enable the close menu item
    updateMenuEnabledState('nucache.open', false);
    updateMenuEnabledState('nucache.close', true);
    updateMenuEnabledState('nucache.export', true);    
    
    //Send a signal/event to notify the main UI that we are loading
    focusedWindow.webContents.send('nucache.loading', true);

    const baseDomain = 'http://localhost:5698/api/Nucache';
    
    fetch(`${baseDomain}/GetNuCacheData?filePath=${filePath}`).then((response) => {
        if(response.ok) {
            return response.json();
        }

        //404, 500 etc..
        response.text().then((value) =>{

            log.error(`Error from NuCache Server API = ${value}`);

            focusedWindow.webContents.send('nucache.error', value);
            focusedWindow.webContents.send('nucache.loading', false);
        });

    }).then((serverJson)=> {
        if(serverJson){

            log.info(`The file ${filePath} took ${serverJson.StopClock.Hours} Hours, ${serverJson.StopClock.Minutes} Minutes, ${serverJson.StopClock.Seconds} Seconds, ${serverJson.StopClock.Milliseconds} Milliseconds, ${serverJson.StopClock.Ticks} Ticks to read ${serverJson.TotalItems} documents`);

            //Add the file to a recent documents list
            //Lets assume the Electron API here deals with dupes etc
            app.addRecentDocument(filePath);          

            focusedWindow.webContents.send('nucache.data', serverJson);
            focusedWindow.webContents.send('nucache.loading', false);
        }
    });
}

function openFileDialog(focusedWindow){
    dialog.showOpenDialog({
        title: 'Open NuCache',
        filters: [{name: 'NuCache DB', extensions: ['db']}],
        properties: ['openFile']
    }, (filePaths) =>{
        //Check we have something selected
        if(!filePaths) {
            return;
        }

        //Call the Web API with the selected file
        openFile(filePaths[0], focusedWindow);
    });
}

const { ipcMain, webContents } = require('electron');
ipcMain.on('dragged-file', (event, arg) => {
    //arg contains the filepath to the dragged file

    //Get focused window
    var allWindows = webContents.getAllWebContents();
    var currentWindow = allWindows[0];
    
    openFile(arg, currentWindow);

});

ipcMain.on('open-file-dialog', (event, arg) => {
    //arg is empty - we simply wanting to be notified that user trying to open a file dialog

    //Get focused window
    var allWindows = webContents.getAllWebContents();
    var currentWindow = allWindows[0];
    
    openFileDialog(currentWindow);
});

ipcMain.on('nucache.savejson.data', (event, arg) => {

    if(arg.file){
        //arg is a JSON object - raw JSON object to save/export & filepath to save it to
        var jsonData = JSON.stringify(arg.data, null, '\t');

        fs.writeFile(arg.file, jsonData, (err) => {
            if (err)
            {
                log.error(`Error saving/exporting file = ${err}`);

                dialog.showErrorBox({
                    title: 'Error Saving File',
                    content: err
                });
            }

            dialog.showMessageBox({
                title:'File Saved',
                message:`File sucessfully exported at ${arg.file}`
            });
        });
    }

});

//This comes from the preference window & we are going to simply proxy it back out
//So the main window can listen for it & update the Vue properties
//Will contain the string of the theme such as 'monkai' or similar
ipcMain.on('nucache.theme', (event, arg) => {

    log.info('got the message in the main (app-menu.js)', arg);
    
    //Do webContents send in parent browser window
    event.sender.browserWindowOptions.parent.webContents.send('nucache.theme', arg);  
  });


module.exports.openFile = openFile;