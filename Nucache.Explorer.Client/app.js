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
            readOnly: true            
          }
    },
    methods:{
        onDrop: function(e) {
            e.stopPropagation();
            e.preventDefault();

            //Remove some CSS class .is-dragover
            this.isDragging = false;
            
            var allFiles = e.dataTransfer.files;
            var firstFile = allFiles[0];

            //File name does not end with .db
            if(firstFile.name.endsWith('.db') === false){
                console.log('Not a .db file extension');
                return;
            }

            //Send a message
            ipcRenderer.send('dragged-file', firstFile.path);

        },
        addDragOver: function(e){
            console.log('add drag');

            //Add some CSS class .is-dragover
            this.isDragging = true;
        },
        removeDragOver: function(e){
            console.log('remove drag');
            //Remove some CSS class .is-dragover
            this.isDragging = false;
        },
        openFileDialog: function(e){
            //Tell main.js / app-menu.js to open a file dialog window
            ipcRenderer.send('open-file-dialog');
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