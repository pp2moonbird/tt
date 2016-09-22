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


    currentTimeStamp = new Date();
    if(startStr.toLowerCase()==='now'){
        startTime = currentTimeStamp;
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
        
        startTime = currentTimeStamp.setHours(hour);
        startTime = currentTimeStamp.setHours(minute);
    }

    if(endStr.toLowerCase()==='now'){
        endTime = currentTimeStamp;
    }
    else{
        if (endStr.length == 3){
            h = endStr[0]
            m = endStr[1] + endStr[2]
        }
        else{
            h = endStr[0] + endStr[1]
            m = endStr[2] + endStr[3]
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
        
        endTime = currentTimeStamp.setHours(hour);
        endTime = currentTimeStamp.setHours(minute);
    }


    result = new item(rawText, rawText, startTime, endTime, formatTime(startTime), formatTime(endTime), true, true);
    return result;
}

function formatTime(timestamp){
    result = timestamp.getHours() + ":" + timestamp.getMinutes();
    return result;
}