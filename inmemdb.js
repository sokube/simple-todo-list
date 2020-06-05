let Tasks = Array();
var IdCounter = 0;

var db = {
    list_all_tasks: function () { 
        return Tasks;
    },
    create_task:function (desc) { 
        IdCounter = IdCounter+1;
        Tasks.push({id: IdCounter, description: desc, complete: false});
    },
    delete_task:function (taskid)  {
        Tasks.forEach(function(item, index, array) {
            if (item.id == taskid) {
                Tasks.splice(index,1);
            }
        });
        },
    toggle_task:function (taskid) {
        Tasks.forEach(function(item, index, array) {
            if (item.id == taskid) {
                item.complete = !item.complete;
            }
        });
    }    
};

module.exports = db;
