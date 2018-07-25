const { ipcMain, webContents, dialog } = require('electron');
const appMenu = require('./app-menu');
const fs = require('fs');

ipcMain.on('dragged-file', (event, arg) => {
    //arg contains the filepath to the dragged file

    //Get focused window
    var allWindows = webContents.getAllWebContents();
    var currentWindow = allWindows[0];
    
    appMenu.openFile(arg, currentWindow);

});

ipcMain.on('open-file-dialog', (event, arg) => {
    //arg is empty - we simply wanting to be notified that user trying to open a file dialog

    //Get focused window
    var allWindows = webContents.getAllWebContents();
    var currentWindow = allWindows[0];
    
    appMenu.openFileDialog(currentWindow);
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

    //Do webContents send in parent browser window
    event.sender.browserWindowOptions.parent.webContents.send('nucache.theme', arg);  
});