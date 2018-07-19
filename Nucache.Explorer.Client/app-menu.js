const { dialog, Menu, shell, app } = require('electron');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const template = [
    {
        label: 'File',
        submenu: [
            {
                id:'nucache.open',
                label: 'Open NuCache',
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
                    dialog.showMessageBox({
                        type: 'info',
                        title: app.getName(),
                        message: `${app.getName()} uses the following versions`,
                        detail: [
                            'Version ' + app.getVersion(),
                            'Node ' + process.versions.node,
                            'Chrome ' + process.versions.chrome,
                            'Electron ' + process.versions.electron,
                            'V8 ' + process.versions.v8,
                            'Architecture ' + process.arch,
                          ].join('\n')
                    });
                }
            },
            {
                id:'nucache.log',
                label: 'View Log File',
                click: () => {

                    //appDirectory C:\Users\warre\AppData\Roaming\NuCache Explorer
                    const appDirectory = app.getPath('userData');
                    var logFile = path.join(appDirectory, 'logs', 'NuCache.Explorer.log.txt');
                    
                    //Open the folder that contains the log.log file
                    shell.showItemInFolder(logFile);
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
  
const menu = Menu.buildFromTemplate(template)
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
            focusedWindow.webContents.send('nucache.error', value);
            focusedWindow.webContents.send('nucache.loading', false);
        });

    }).then((serverJson)=> {
        if(serverJson){
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
    //arg is a JSON object - raw JSON object to save/export & filepath to save it to
    var jsonData = JSON.stringify(arg.data, null, '\t');

    fs.writeFile(arg.file, jsonData, (err) => {
        if (err)
        {
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
    

});