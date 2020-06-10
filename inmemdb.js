let Tasks = Array();
var IdCounter = 0;

var db = {
    list_all_tasks: function () {
        return Tasks;
    },
    create_task: function (desc) {
        IdCounter = IdCounter + 1;
        Tasks.push({ id: IdCounter, description: desc, complete: false });
    },
    delete_task: function (taskid) {
        Tasks.forEach(function (item, index, array) {
            if (item.id == taskid) {
                Tasks.splice(index, 1);
            }
        });
    },
    toggle_task: function (taskid) {
        Tasks.forEach(function (item, index, array) {
            if (item.id == taskid) {
                item.complete = !item.complete;
            }
        });
    }
};

db.create_task("Wake-up early");
db.create_task("Train at lightsaber and force-crushing objects");
db.create_task("Record a fake sos message in R2D2 for fun");
db.create_task("Destroy an innocent planet for the example");
db.create_task("Identify rebels planet and send the troops");
db.create_task("Invest in prosthesis startups and cut Luke's right hand");
db.create_task("Retire early");

module.exports = db;
