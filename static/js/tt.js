var pattern1 = /(\d{3,4}|now)\s*-\s*(\d{3,4}|now)/
var pattern2 = /-\s*(\d{3,4}|now)/
var pattern3 = /(\d{3,4}|now)\s*-/
var tagPattern = /#(\w+),*/g
var personPattern = /@(\w+),*/g
var statusPattern = /\$(\d)/
var STORAGE_KEY = 'tt';

todoStorage = {
    fetch: function () {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },
    save: function (todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
};


var app = new Vue({
    el: '#ttapp',

    data: {
        newText: '',
        items: todoStorage.fetch(),
        editedItem : null,
        selectedDate: new Date()
    },

    watch:{
        items:{
            handler: function(items){
                todoStorage.save(items);
            },
            deep: true
        }
    },

    computed:{
        formattedSelectedDate: function(){
            return this.selectedDate.toLocaleDateString();
        },

        isBetweenDate: function(){
            var dayStartTime = null;
            if(this.selectedDate){
                dayStartTime = this.selectedDate;
            }
            else{
                dayStartTime = new Date();
            }
            dayStartTime = new Date(dayStartTime.toLocaleDateString());
            var dayEndTime = new Date(dayStartTime.getTime() + 24 * 3600 * 1000);
            function compare(time){
                var a = new Date(time) >= dayStartTime; //TODO why need this conversion?
                var b = new Date(time) < dayEndTime;
                var result = a && b;
                return result;
            }
            return compare;
        },

        filteredItems: function(){
            var isBetweenDate = this.isBetweenDate;
            var result = this.items.filter(function(item){
                var result = isBetweenDate(item.startTime);
                return result;
            });
            return result;   
        },

        fullJson: function(){
            var result = JSON.stringify(this.items);
            return result;
        }
    },

    methods: {
        saveData: function(){
            this.$http.post('/data', JSON.stringify(this.items));
        },

        loadData: function(){
            this.$http.get('/data').then((response)=>{this.items = response.body})
        },

        addItem: function(){
            var value = this.newText && this.newText.trim();
            var result = parseRawTextToItem(value, this.items);
            this.items.push(result);
            this.newText='';
        },

        editItem: function(item){
            this.beforeEditCache = item.rawText;
            this.editedItem = item;
        },

        cancelEdit: function(item){
            this.editedItem = null;
            item.rawText = this.beforeEditCache;
        },

        doneEdit: function(item){
            if(!this.editedItem){
                return;
            }
            this.editedItem=null;
            var result = parseRawTextToItem(item.rawText, this.items);
            // console.log('result:');
            // console.log(result);

            
            var index = this.items.indexOf(item);
            
            item = result; //value not passed, why
            this.items.splice(index, 1 , item);
            // console.log('item');
            // console.log(item);
        },

        completeItem: function(item){
            var endTime = new Date();
            var endTimeRawText = formatTimeToRawTextFormat(endTime);

            var rawText = item.rawText;
            var pattern3MatchResult = pattern3.exec(rawText)[0];
            rawText = rawText.replace(pattern3, pattern3MatchResult + endTimeRawText);
 
            item = parseRawTextToItem(rawText);

            var index = this.items.indexOf(item);
            this.items.splice(index, 1 , item);
        },

        removeItem: function(item){
            this.items.$remove(item);
        },

        jumpToPreviousDay: function(){
            var selectedDate = this.selectedDate;
            this.selectedDate = new Date(selectedDate.getTime() - 24 * 3600 * 1000);
        },

        jumpToToday: function(){
            this.selectedDate = new Date(new Date().toLocaleDateString());
        },

        jumpToNextDay: function(){
            var selectedDate = this.selectedDate;
            this.selectedDate = new Date(selectedDate.getTime() + 24 * 3600 * 1000);
        }
    },

    directives : {
        'item-focus': function(value){
            if(!value){
                return;
            }
            var el = this.el;
                Vue.nextTick(function () {
                el.focus();
            });
        }
    }
});

// extract all elements
// remove all special syntax and rest is item text
// build item
function parseRawTextToItem(value, items){
    var result = null;
    var duration = extractDuration(value, items);
    var leftOver = duration.leftOver;
    var tagObject = extractTags(leftOver);
    leftOver = tagObject.leftOver;
    var personObject = extractPersons(leftOver);
    leftOver = personObject.leftOver;
    var statusObject = extractStatus(leftOver);
    leftOver = statusObject.leftOver;

    if(duration.isValid){
        result = new item(
            duration.rawText, 
            leftOver, 
            duration.startTime, 
            duration.endTime, 
            tagObject.tags, 
            personObject.persons,
            statusObject.status,
            Boolean(duration.endTime), 
            duration.valid);
    }
    return result;
}

function extractTags(value){
    var tags = [];
    var leftOver = '';
    var regResult;
    //if (tagPattern.test(value)){
        while(true){
            regResult = tagPattern.exec(value);
            if(regResult==null){
                break;
            }
            var tag = regResult[1];
            tags.push(tag);
        }
        leftOver = value;
    //}
    var result = new tagResultObject(tags, leftOver);
    return result;
}

function tagResultObject(tags, leftOver){
    this.tags = tags;
    this.leftOver = leftOver;
}

function extractPersons(value){
    var persons = [];
    var leftOver = '';
    var regResult;
    while(true){
        regResult = personPattern.exec(value);
        if(regResult==null){
            break;
        }
        var person = regResult[1];
        persons.push(person);
    }
    leftOver = value;

    var result = new personResultObject(persons, leftOver);
    return result;
}

function personResultObject(persons, leftOver){
    this.persons = persons;
    this.leftOver = leftOver;
}

function extractStatus(value){
    var status = '';
    var leftOver = '';
    var regResult;

    if(statusPattern.test(value)){
        regResult = statusPattern.exec(value);
        status = regResult[1];
    }

    leftOver = value.replace(statusPattern, '').trim();

    var result = new statusResultObject(status, leftOver);
    return result;
}

function statusResultObject(status, leftOver){
    this.status = status;
    this.leftOver = leftOver;
}


function extractDuration(value, items){
    var result = null;
    if(pattern1.test(value)){
        result = parsePattern1(value);
    }
    else if(pattern2.test(value)){
        result = parsePattern2(value, items);
    }
    else if(pattern3.test(value)){
        result = parsePattern3(value);
    }
    else{

    }
    return result;
}

function formatTimeToRawTextFormat(time){
    if(time){
        var time = new Date(time);
        var hour = time.getHours();
        var minute = time.getMinutes();
        var result = hour + ((minute < 10) ? "0" : "") + minute;
        return result;
    }
    else return '';
}

function item(rawText, itemText, startTime, endTime, tags, persons, status, completed, valid){
    this.rawText = rawText;
    this.itemText = itemText;
    this.startTime = startTime;
    this.endTime = endTime;
    this.tags = tags;
    this.persons = persons;
    this.status = status;
    this.startTimeStr = formatTime(startTime);
    this.endTimeStr = formatTime(endTime);
    this.completed = completed;
    this.valid = valid;

}

function duration(startTime, endTime, isValid, leftOver){
    this.startTime = startTime;
    this.endTime = endTime;
    this.isValid = isValid;
    this.leftOver = leftOver;
    this.rawText = formatTimeToRawTextFormat(startTime) + '-' + formatTimeToRawTextFormat(endTime) + ' ' + leftOver;
}

function parsePattern1(rawText){
    var result = null;

    var matchPattern = pattern1.exec(rawText);
    var startStr = matchPattern[1].trim()
    var endStr = matchPattern[2].trim()

    var startTime = parseTime(startStr);
    var endTime = parseTime(endStr);

    var leftOver = rawText.replace(pattern1, '').trim();
    result = new duration(startTime, endTime, true, leftOver);
    return result;
}

function parsePattern2(rawText, items){
    var result = null;
    var matchPattern = pattern2.exec(rawText);
    var startTime = new Date();
    //calculate the latest time from existing items
    if (items.length == 0){
        startTime = new Date();
    }
    else{
        maxTime = items[0].endTime;

        for(i=0;i<items.length;i++){
            // console.log(maxTime + ", " + items[i].endTime + ", " + (new Date(items[i].endTime) > new Date(maxTime)));
            if(new Date(items[i].endTime) > new Date(maxTime)){
                maxTime = items[i].endTime;
                
            }
        }
        startTime = new Date(maxTime);//TODO, why need this conversion?
    }
    
    var endStr = matchPattern[1].trim();
    var endTime = parseTime(endStr);

    var leftOver = rawText.replace(pattern2, '').trim();
    result = new duration(startTime, endTime, true, leftOver);
    return result;
}

function parsePattern3(rawText){
    var result = null;
    var matchPattern = pattern3.exec(rawText);
    var startTimeStr = matchPattern[1]
    var startTime = parseTime(startTimeStr);

    var leftOver = rawText.replace(pattern3, '').trim();
    result = new duration(startTime, null, true, leftOver);
    return result; 
}

function parseTime(timeStr){
    timeStr = timeStr.trim();
    
    var currentTimeStamp = new Date();
    var resultTime = null;
    var h=null;
    var m=null;
    if(timeStr.toLowerCase()=='now'){
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
        //TODO need replace with new structure
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
    var result = null;
    if(timestamp){
        var hour = timestamp.getHours();
        var minute = timestamp.getMinutes();
        
        result = timestamp.getHours() + ((minute < 10) ? ":0" : ":") + minute;
    }
    return result;
}