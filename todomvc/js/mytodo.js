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
        }, 
        remaining: function (){
            return filters.active(this.todos).length;
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
        },

        doneEdit: function(todo) {
            if(!this.editedTodo){
                return;
            }
            this.editedTodo = null;
            todo.title = todo.title.trim();
            if(!todo.title){
                this.removeTodo(todo);
            }
        },

        removeTodo: function (todo){
            this.todos.$remove(todo);
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