const { ipcRenderer } = require('electron'); //Send message back to main.js & app-menu.js that can do the Web API call
const log = require('electron-log');

document.addEventListener('DOMContentLoaded', function() {

    //Select the element in the DOM that is the dropdown
    var themeSelector = document.getElementById('theme-selector');

    //Bind the dropdown element to run a function when the onchange event is emitted
    themeSelector.onchange = changeTheme;

    //Set selected theme from user stored preference
    themeSelector.value = "neat";

});

function changeTheme(event) {

    if(event.target.value){
        log.info(`Theme preference changed to - ${event.target.value}`);

        //Save/persist the change to pref storage

        
        //Send message back to main IPC - which will then proxy/send it back out to the renderer
        //Where we can listen for it in the parent/main window & update the vue js
        ipcRenderer.send('nucache.theme', event.target.value);
    }
};