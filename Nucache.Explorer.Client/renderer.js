const { ipcRenderer } = require('electron');

//When we are trying to fetch an API response
//We will send a loading with a bool back to toggle UI
ipcRenderer.on('nucache.loading', (event, message) => {

    console.log('nucache.loading', message);
    app.__vue__.$data.isLoading = message;        
});

//This will contain the RAW JSON payload returned from the API
ipcRenderer.on('nucache.data', (event, message) => {

    console.log('nucache.data', message);
    app.__vue__.$data.nucacheOpen = true;
    app.__vue__.$data.apiData = message;
    app.__vue__.$data.documentPosition = 1;
    app.__vue__.$data.totalDocuments = message.TotalItems;
});


//When the user closes the file from the file menu
//We can update the UI to some kind of reset state
ipcRenderer.on('nucache.closed', (event, message) => {

    console.log('nucache.closed', message);
    app.__vue__.$data.nucacheOpen = false;
    app.__vue__.$data.apiData = null;
    app.__vue__.$data.documentPosition = 0;
    app.__vue__.$data.totalDocuments = 0;
    app.__vue__.$data.codeMirrorString = null;
});


//If we get any errors from the API server returned
//We can then bubble this up into the UI layer
ipcRenderer.on('nucache.error', (event, message) => {

    console.log('nucache.error', message);
});