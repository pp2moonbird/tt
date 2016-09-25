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
                var result = parsePattern1(value);
                this.items.push(result);
            }
            else if(pattern2.test(value)){

            }
            else if(pattern3.test(value)){

            }
            //invalid string
            else{
                result = new item(value, 'no match', null, null, null, null, false, false);
                //return result;
            }
            this.newText=''
        }
    }
});


function item(rawText, itemText, startTime, endTime, startTimeStr, endTimeStr, completed, valid){
    this.rawText = rawText;
    this.itemText = itemText;
    this.startTime = startTime;
    this.endTime = endTime;
    this.startTimeStr = formatTime(startTime);
    this.endTimeStr = formatTime(endTime);
    this.completed = completed;
    this.valid = valid;

}

function parsePattern1(rawText){
    var matchPattern = pattern1.exec(rawText);
    var startStr = matchPattern[1].trim()
    var endStr = matchPattern[2].trim()

    console.log('---start parse start time');
    startTime = parseTime(startStr);
    console.log('---start parse end time');
    endTime = parseTime(endStr);

    var itemText = rawText.replace(pattern1, '').trim();
    result = new item(rawText, itemText, startTime, endTime, formatTime(startTime), formatTime(endTime), true, true);
    return result;
}


function parseTime(timeStr){
    var currentTimeStamp = new Date();
    var resultTime = null;
    var h=null;
    var m=null;
    if(timeStr.toLowerCase()==='now'){
        resultTime = currentTimeStamp;
    }
    else{
        if (timeStr.length == 3){
            h = timeStr[0]
            m = timeStr[1] + timeStr[2]
        }
        else{
            h = timeStr[0] + timeStr[1]
            m = timeStr[2] + timeStr[3]
        }

        var hour = Number(h);
        var minute = Number(m);
        console.log('h' + hour);
        console.log('m' + minute)
        if(hour>24 || minute > 60){
            result = new item(rawText, 'invalid text, number format error', null, null, null, null, false, false);
            return result;
        }

        var currentHour = currentTimeStamp.getHours();
        console.log('current hour is' + currentHour);
        if (currentHour>12 && hour<12){
            hour = hour + 12;
        }
        
        console.log('currentTimeStamp: ' + currentTimeStamp)
        resultTime = currentTimeStamp.setHours(hour);
        resultTime = currentTimeStamp.setMinutes(minute);
        console.log('currentTimeStamp modified: ' + currentTimeStamp)
    }
    resultTime = new Date(resultTime);
    return resultTime;
}

function formatTime(timestamp){
    hour = timestamp.getHours();
    minute = timestamp.getMinutes();
    
    var result = timestamp.getHours() + ((minute < 10) ? ":0" : ":") + minute;
    return result;
}