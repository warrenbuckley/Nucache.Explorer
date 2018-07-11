const { dialog, Menu, shell } = require('electron');
const fetch = require('node-fetch');

const template = [
    {
        label: 'File',
        submenu: [
            {
                id:'nucache.open',
                label: 'Open NuCache',
                click: (menuItem, focusedWindow) => {
                    dialog.showOpenDialog({
                        title: "Open NuCache",
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
            },
            {
                id:'nucache.close',
                label: 'Close NuCache',
                enabled: false,
                click: (menuItem, focusedWindow) => {

                    //Disable the close menu item & re-activate the open menu item
                    updateMenuEnabledState('nucache.open', true);
                    updateMenuEnabledState('nucache.close', false);

                    //Resets the UI later to open a new nucache file
                    //By sending a signal/event that we listen for
                    focusedWindow.webContents.send('nucache.closed');
                }
            }   
        ]
    },
    {
        label: 'View',
        submenu: [
            {
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
        submenu: [{
            label: 'Learn More',
            click: () => {
                shell.openExternal('https://github.com/warrenbuckley/Nucache.Explorer');
            }
        }]
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
        });

    }).then((serverJson)=> {
        console.log('server JSON', serverJson);
        if(serverJson){
            focusedWindow.webContents.send('nucache.data', serverJson);
            focusedWindow.webContents.send('nucache.loading', false);
        }
    });
}

const { ipcMain, webContents } = require('electron');
ipcMain.on('dragged-file', (event, arg) => {
    //arg contains the filepath to the dragged file

    //Get focused window
    var allWindows = webContents.getAllWebContents();
    var currentWindow = allWindows[0];
    
    console.log('currentWindow', currentWindow);
    openFile(arg, currentWindow);

});