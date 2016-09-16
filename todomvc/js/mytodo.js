var filters = {
    all: function(todos){
        return todos;
    },
    active: function(todos){
        return todos.filter(function (todo){
            return !todo.completed;
        });
    },
    completed: function(todos){
        return todos.filter(function (todo){
            return todo.completed;
        });
    }
};

var app = new Vue({
    el: '.todoapp',

    data: {
        newTodo: '',
        todos: [],
        visibility: 'all',
        editedTodo: null
    },

    computed: {
        filteredTodos: function() {
            return filters[this.visibility](this.todos);
        }
    },

    methods: {
        addTodo: function(){
            var value = this.newTodo && this.newTodo.trim();
            if(!value){
                return;
            }
            this.todos.push({title: value, completed: false});
            this.newTodo = '';
        },

        editTodo: function(todo){
            this.beforeEditCache = todo.title;
            this.editedTodo = todo;
        }


    },

    directives: {
        'todo-focus': function(value){
            if(!value){
                return;
            }
            var el = this.el;
            Vue.nextTick(function(){
                el.focus();
            });
        }
    }

})