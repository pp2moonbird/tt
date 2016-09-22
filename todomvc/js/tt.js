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
    startStr = matchPattern[1].trim()
    endStr = matchPattern[2].trim()

    startTime = parseTime(startStr);
    endTime = parseTime(endStr);

    result = new item(rawText, rawText, startTime, endTime, formatTime(startTime), formatTime(endTime), true, true);
    return result;
}


function parseTime(timeStr){
    currentTimeStamp = new Date();
    resultTime = null;
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
        hour = Number(h);
        minute = Number(m);

        if(hour>24 || minute > 60){
            result = new item(rawText, 'invalid text, number format error', null, null, null, null, false, false);
            return result;
        }

        currentHour = currentTimeStamp.getHours();
        if (currentHour>12 && hour<12){
            hour = hour + 12;
        }
        
        resultTime = currentTimeStamp.setHours(hour);
        resultTime = currentTimeStamp.setHours(minute);
    }
    resultTime = new Date(resultTime);
    return resultTime;
}

function formatTime(timestamp){
    result = timestamp.getHours() + ":" + timestamp.getMinutes();
    return result;
}