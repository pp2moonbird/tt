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

            var pattern1 = /(\d{3,4}|now)\s*-\s*(\d{3,4}|now)/
            var pattern2 = /-\s*now/
            var pattern3 = /now\s*-/

            if(pattern1.test(value)){
                var result = pattern1.exec(value)
                this.items.push({rawText:value, patternFound: result[0]});
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