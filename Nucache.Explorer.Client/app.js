var _ = require('lodash');

var app = new Vue({
    el: "#app",
    data: {
        isLoading: false,
        apiData: null,
        nucacheOpen: false,
        documentPosition: 1,
        hasPrevious:false,
        hasNext: true,
        totalDocuments: 0

    },
    watch: {
        documentPosition: _.debounce(function (val) {
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