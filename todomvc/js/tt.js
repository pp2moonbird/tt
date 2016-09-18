var pattern1 = /(\d{3,4}|now)\s*-\s*(\d{3,4}|now)/
var pattern2 = /-\s*now/
var pattern3 = /now\s*-/

var app = new Vue({
    el: '#ttapp',

    data: {
        newText: '',
        items: []
    },

    methods: {
        addItem: function(){
            var value = this.newText && this.newText.trim();
            if(!value){
                return;
            }


            if(pattern1.test(value)){
                var result = pattern1.exec(value)
                this.items.push({rawText:value, patternFound: convertToDate(result[0])});
            }
            else if(pattern2.test(value)){
                var result = pattern2.exec(value)
                this.items.push({rawText:value, patternFound: result[0]});
            }
            else if(pattern3.test(value)){
                var result = pattern3.exec(value)
                this.items.push({rawText:value, patternFound: result[0]});
            }
            else{
                this.items.push({rawText:value, patternFound: 'not found'});
                
            }
            this.newText=''
        }
    }
});


function parsePattern1(rawText){
    var result = pattern1.exec(rawText);
    startStr = result[1].trim()
    endStr = result[2].trim()

    if(startStr.toLowerCase()==='now'){
        startTime = new Date()
    }
    else{
        if (startStr.length == 3){
            h = startStr[0]
            m = startStr[1] + startStr[2]
        }
        else{
            h = startStr[0] + startStr[1]
            m = startStr[2] + startStr[3]
        }
    }




    return rawText + '!'
}