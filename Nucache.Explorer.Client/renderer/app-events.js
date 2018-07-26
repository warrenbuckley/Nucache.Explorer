const { ipcRenderer } = require('electron');

//When we are trying to fetch an API response
//We will send a loading with a bool back to toggle UI
ipcRenderer.on('nucache.loading', (event, message) => {

    app.__vue__.isLoading = message;        
});

//This will contain the RAW JSON payload returned from the API
ipcRenderer.on('nucache.data', (event, message) => {

    app.__vue__.$data.nucacheOpen = true;
    app.__vue__.$data.apiData = message;
    app.__vue__.$data.documentPosition = 1;
    app.__vue__.$data.totalDocuments = message.TotalItems;
});


//When the user closes the file from the file menu
//We can update the UI to some kind of reset state
ipcRenderer.on('nucache.closed', (event, message) => {

    app.__vue__.nucacheOpen = false;
    app.__vue__.apiData = null;
    app.__vue__.documentPosition = 0;
    app.__vue__.totalDocuments = 0;
    app.__vue__.codeMirrorString = null;
    app.__vue__.serverError = null;
});


//If we get any errors from the API server returned
//We can then bubble this up into the UI layer
ipcRenderer.on('nucache.error', (event, message) => {

    //Message is a string of JSON
    var json = JSON.parse(message);
    app.__vue__.serverError = json.Message; 
});

//When the application menu - wants to save/export the JSON
ipcRenderer.on('nucache.savejson', (event, message) => {

    //message contains the filename/path
    // C:\Code-Personal\Nucache.Explorer\Test Files\my-export.json
    var filePath = message;
    var jsonData = app.__vue__.apiData;

    //Let's reply back with a new message back so that
    ipcRenderer.send('nucache.savejson.data', { data: jsonData, file: filePath});

});

//On application load - the theme config setting is read and sent here
//So we can update to the correct theme at boot
//Also when the theme dropdown is changed - we will get the chosen theme so we can update
//Code Mirror with the correct theme prop (applies some container class)
//And we also go and load the correct external CSS file into the DOM
ipcRenderer.on('nucache.theme', (event, message) => {
    
    app.__vue__.codeMirrorOptions.theme = message;
});

ipcRenderer.on('nucache.codemirror.command', (event, message) => {

    console.log('Recieved codemirror command to execute', message);
    app.__vue__.$refs.myCm.cminstance.execCommand(message);

});