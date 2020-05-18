var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_tracker"
});

//Make Connection, Run Inquirer
connection.connect(function (err) {
    if (err) throw err;
    askInquirer();
});

function askInquirer() {
    inquirer.prompt(
        {
            name: "initialQuestion",
            type: "list",
            message: "What would you like to do?",
            choices: ["View all departments", "View all roles", "View all employees", "Add department", "Add role", "Add employee"]
        })
        .then(function (response) {
            // console.log(response)
            switch (response.initialQuestion) {
                case "View all departments":
                    viewDepartments();
                    break;

                case "View all roles":
                    viewRoles();
                    break;

                case "View all employees":
                    viewEmployees();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Add employee":
                    addEmployee();
                    break;
            }
        })
};

// Write formulas for each case
function viewDepartments() {
    connection.query("SELECT * FROM employee_tracker.departments;", function (err, res) {
        if (err) throw err;
        console.table(res);
       
});
};

function viewRoles() {
    connection.query("SELECT * FROM employee_tracker.roles;", function (err, res) {
        if (err) throw err;
        console.table(res);
    })
};

function viewEmployees() {
    connection.query("SELECT * FROM employee_tracker.employees;", function (err, res) {
        if (err) throw err;
        console.table(res);
    })
};

function addDepartment() {
    inquirer.prompt(
        {
            name: "dept_name",
            type: "input",
            message: "What is the name of the department?",
        })
        .then(function (response) {
            connection.query("INSERT INTO employee_tracker.departments (dept_name) VALUES (?)", [response.dept_name], function (err, res) {
                if (err) throw err;
                console.table(res);
            })
        })
};



function addRole() {
    //get department names
    var dept_choices = [];
    var dept_ids = [];
    connection.query("SELECT * FROM employee_tracker.departments;", function (err, res) {
        if (err) throw err;
        for (i = 0;i <res.length; i+=1){
        dept_choices.push((res[i].dept_name))
        dept_ids.push((res[i].dept_id));
    }
});

    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the title?",
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary?",
        },
        {
            name: "department",
            type: "list",
            message: "What is the department?",
            choices: dept_choices,
        }]
    )
        .then(function (response) {
            connection.query("INSERT INTO employee_tracker.roles (title, salary, dept_id) VALUES(?,?,?)", [response.title, response.salary, dept_ids[dept_choices.indexOf(response.department)]], function (err, res) {
                if (err) throw err;
                console.table(res);
            })
        })
}

function addEmployee() {
        //get role names
        var role_choices = [];
        var role_ids = [];
        connection.query("SELECT * FROM employee_tracker.roles;", function (err, res) {
            if (err) throw err;
            for (i = 0;i <res.length; i+=1){
            role_choices.push((res[i].title))
            role_ids.push((res[i].role_id));
        }
    });
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the first name?",
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the last name?",
        },
        {
            name: "title",
            type: "list",
            message: "What is the role?",
            choices: role_choices,
        },
        {
            name: "manager_id",
            type: "list",
            message: "Who is the manager?",
            choices: [1, 2, 3],
        }
    ]
    )
        .then(function (response) {
            connection.query("INSERT INTO employee_tracker.employees (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)", [response.first_name, response.last_name, role_ids[role_choices.indexOf(response.title)], response.manager_id], function (err, res) {
                if (err) throw err;
                console.table(res);
            })
        })
}
