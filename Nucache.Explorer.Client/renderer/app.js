var _ = require('lodash');
const { ipcRenderer } = require('electron'); //Send message back to main.js & app-menu.js that can do the Web API call

var VueCodemirror = require('vue-codemirror');
Vue.use(VueCodemirror);

var app = new Vue({
    el: '#app',
    data: {
        isLoading: false,
        apiData: null,
        nucacheOpen: false,
        documentPosition: 0,
        hasPrevious:false,
        hasNext: true,
        totalDocuments: 0,
        isDragging: false,
        wrongFileType: false,
        serverError: null,
        documentToFind: null,
        findBy: 'Id',
        codeMirrorString: null,
        codeMirrorOptions: {
            tabSize: 4,
            lineNumbers: true,
            line: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],    
            mode: 'application/json',                  
            matchBrackets: true,
            showCursorWhenSelecting: true,
            theme: 'monokai',
            readOnly: true,
            keyMap: 'basic'
          }
    },
     //Magic VUE Lifecycle method - created
     //This is where we register alot of ipc message listeners to update our vue properties
    created: function(e){

        //When we are trying to fetch an API response
        //We will send a loading with a bool back to toggle UI
        ipcRenderer.on('nucache.loading', (event, message) => {

            this.isLoading = message; 
        });

        //This will contain the RAW JSON payload returned from the API
        ipcRenderer.on('nucache.data', (event, message) => {

            this.nucacheOpen = true;
            this.apiData = message;
            this.documentPosition = 1;
            this.totalDocuments = message.TotalItems;
        });

        //When the user closes the file from the file menu
        //We can update the UI to some kind of reset state
        ipcRenderer.on('nucache.closed', (event, message) => {

            this.nucacheOpen = false;
            this.apiData = null;
            this.documentPosition = 0;
            this.totalDocuments = 0;
            this.codeMirrorString = null;
            this.serverError = null;
        });


        //If we get any errors from the API server returned
        //We can then bubble this up into the UI layer
        ipcRenderer.on('nucache.error', (event, message) => {

            //Message is a string of JSON
            var json = JSON.parse(message);
            this.serverError = json.Message; 
        });

        //When the application menu - wants to save/export the JSON
        ipcRenderer.on('nucache.savejson', (event, message) => {

            //message contains the filename/path
            // C:\Code-Personal\Nucache.Explorer\Test Files\my-export.json
            var filePath = message;
            var jsonData = this.apiData;

            //Let's reply back with a new message back so that
            ipcRenderer.send('nucache.savejson.data', { data: jsonData, file: filePath});

        });

        //On application load - the theme config setting is read and sent here
        //So we can update to the correct theme at boot
        //Also when the theme dropdown is changed - we will get the chosen theme so we can update
        //Code Mirror with the correct theme prop (applies some container class)
        //And we also go and load the correct external CSS file into the DOM
        ipcRenderer.on('nucache.theme', (event, message) => {
            
            this.codeMirrorOptions.theme = message;
        });

        ipcRenderer.on('nucache.codemirror.command', (event, message) => {

            this.$refs.myCm.cminstance.execCommand(message);
        });
    },
    methods:{             
        onDrop: function(e) {
            //Remove some CSS class .is-dragover
            this.isDragging = false;
            
            //reset file type check (until we recheck it in a sec)
            this.wrongFileType = false;

            var allFiles = e.dataTransfer.files;
            var firstFile = allFiles[0];

            //File name does not end with .db
            if(firstFile.name.endsWith('.db') === false){
                this.wrongFileType = true;
                return;
            }

            //Send a message
            ipcRenderer.send('dragged-file', firstFile.path);

        },
        addDragOver: function(e){
            //Add some CSS class .is-dragover
            this.isDragging = true;
        },
        removeDragOver: function(e){
            //Remove some CSS class .is-dragover
            this.isDragging = false;
        },
        openFileDialog: function(e){
            //Tell main.js / app-menu.js to open a file dialog window
            ipcRenderer.send('open-file-dialog');
        },
        findDocument: function(e){
            //Get the value in the textbox
            var docId = this.documentToFind;
            
            //Get the value in the dropdown
            var idType = this.findBy;

            //Do a lodash _.findIndex
           var findDocPosition = _.findIndex(this.apiData.Items, function(obj) {

                if(idType === 'Id'){
                    //Id is a native JS Number - so remember to parse the string back to number
                    return obj.Node.Id === Number(docId);
                }
                else if(idType === 'Uid'){
                    return obj.Node.Uid === docId;
                }
            });

            if(findDocPosition === -1){
                //Did not find the item
                //Display something in the UI?!
            } else{
                //Found it's location
                //Update documentPosition number - the watch will then kick in
                //and load the correct document
                this.documentPosition = findDocPosition + 1;
            }
        }
    },
    watch: {
        documentPosition: _.debounce(function (val) {

            var currentDoc = this.apiData.Items[val-1];
            var docString = JSON.stringify(currentDoc, null, '\t');
            this.codeMirrorString = docString;

            //Ensure you can't type less than 1 & update prev/next buttons 
            if(val <= 1){
                this.hasPrevious = false;
                this.hasNext = true;
                this.documentPosition = 1;
                return;
            }

            //Ensure the number cant be more than total docs
            if(val >= this.totalDocuments){
                this.hasPrevious = true;
                this.hasNext = false;
                this.documentPosition = this.totalDocuments;
                return;
            } else{
                //All other cases is that you are betwen the upper & lower limit
                //Enable both previous & next
                this.hasPrevious = true;
                this.hasNext = true;                
            }
        }, 300)
    }
});