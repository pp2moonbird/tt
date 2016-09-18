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
            var pattern1 = /(\d{3,4}|now)-(\d{3,4}|now)/
            if(pattern1.test(value)){
                var result = pattern1.exec(value)
                this.items.push({rawText:value, patternFound: result[0]});
            }
            else{
                this.items.push({rawText:value, patternFound: 'not found'});
                
            }
            this.newText=''
        }
    }
});