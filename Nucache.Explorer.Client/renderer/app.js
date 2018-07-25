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
            extraKeys: {"Alt-F": "findPersistent"}
          }
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