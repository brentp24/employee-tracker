var mysql = require("mysql");
var inquirer = require("inquirer");
var emp_choices = [];
var emp_ids = [];
var role_choices = [];
var role_ids = [];
var dept_choices = [];
var dept_ids = [];

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
    getRoleList();
    getEmployeeList();
    getDepartmentList();
    askInquirer();
});

function getRoleList() {
    //get role names
    connection.query("SELECT * FROM employee_tracker.roles;", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i += 1) {
            role_choices.push((res[i].title))
            role_ids.push((res[i].role_id));
        }
    });
}

function getEmployeeList() {
    connection.query("SELECT * FROM employee_tracker.employees;", function (err, res2) {
        if (err) throw err;
        for (i = 0; i < res2.length; i += 1) {
            emp_choices.push(res2[i].first_name + " " + res2[i].last_name)
            emp_ids.push((res2[i].emp_id));
        }
        emp_choices.push("None"); // if no manager. 
    });
}

function getDepartmentList() {
    connection.query("SELECT * FROM employee_tracker.departments;", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i += 1) {
            dept_choices.push((res[i].dept_name))
            dept_ids.push((res[i].dept_id));
        }
    });
}


function askInquirer() {
    inquirer.prompt(
        {
            name: "initialQuestion",
            type: "list",
            message: "What would you like to do?",
            choices: ["View all departments", "Add department", "Delete department", "View all roles", "Add role", "Delete role", "View all employees", "Add employee", "Update employee", "Delete employee"]
        })
        .then(function (response) {
            // console.log(response)
            switch (response.initialQuestion) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "Add department":
                    addDepartment();
                    break;
                case "Delete department":
                    deleteDepartment();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Delete role":
                    deleteRole();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "Update employee":
                    updateEmployee();
                    break;
                case "Delete employee":
                    deleteEmployee();
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
            })
            askAgain();
        })
};

function addRole() {
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
            })
            askAgain();
        })
}

function addEmployee() {
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
            choices: emp_choices,
        }
    ]
    )
        .then(function (response) {
            connection.query("INSERT INTO employee_tracker.employees (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)",
                [
                    response.first_name,
                    response.last_name,
                    role_ids[role_choices.indexOf(response.title)],
                    emp_ids[emp_choices.indexOf(response.manager_id)]
                ], function (err, res) {
                    if (err) throw err;
                })
            askAgain();
        })
}

function updateEmployee() {
    inquirer.prompt([
        {
            name: "updated_emp",
            type: "list",
            message: "Which employee would you like to update?",
            choices: emp_choices,
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
            choices: emp_choices,
        }
    ]
    )
        .then(function (response) {

            connection.query("UPDATE employee_tracker.employees SET role_id = (?), manager_id = (?) WHERE emp_id = (?)",
                [
                    role_ids[role_choices.indexOf(response.title)],
                    emp_ids[emp_choices.indexOf(response.manager_id)],
                    emp_ids[emp_choices.indexOf(response.updated_emp)]
                ], function (err, res) {
                    if (err) throw err;
                })
            askAgain();
        })
}

function askAgain() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Would you like to do anything else?",
                name: "addMoreEmployees",
                choices: [
                    "Yes",
                    "No"
                ]
            }])
        .then(function (response) {
            if (response.addMoreEmployees === "Yes") {
                getRoleList();
                getEmployeeList();
                getDepartmentList();
                askInquirer();
            }
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
            })
            askAgain();
        })
};

function addRole() {
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
            })
            askAgain();
        })
}

function addEmployee() {
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
            choices: emp_choices,
        }
    ]
    )
        .then(function (response) {
            connection.query("INSERT INTO employee_tracker.employees (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)",
                [
                    response.first_name,
                    response.last_name,
                    role_ids[role_choices.indexOf(response.title)],
                    emp_ids[emp_choices.indexOf(response.manager_id)]
                ], function (err, res) {
                    if (err) throw err;
                })
            askAgain();
        })
}

function deleteEmployee() {
    inquirer.prompt([
        {
            name: "deleted_emp",
            type: "list",
            message: "Which employee would you like to delete?",
            choices: emp_choices,
        }
    ]
    )
        .then(function (response) {
            connection.query("DELETE FROM employee_tracker.employees WHERE emp_id = (?)",
                [
                    emp_ids[emp_choices.indexOf(response.deleted_emp)]
                ], function (err, res) {
                    if (err) throw err;
                })

            askAgain();
        })

};


function deleteDepartment() {
    inquirer.prompt([
        {
            name: "deleted_dept",
            type: "list",
            message: "Which department would you like to delete?",
            choices: dept_choices,
        }
    ]
    )
        .then(function (response) {
            connection.query("DELETE FROM employee_tracker.departments WHERE dept_id = (?)",
                [
                    dept_ids[dept_choices.indexOf(response.deleted_dept)]
                ], function (err, res) {
                    if (err) throw err;
                })

            askAgain();
        })

};


function deleteRole() {
    inquirer.prompt([
        {
            name: "deleted_role",
            type: "list",
            message: "Which role would you like to delete?",
            choices: role_choices,
        }
    ]
    )
        .then(function (response) {
            connection.query("DELETE FROM employee_tracker.roles WHERE role_id = (?)",
                [
                    role_ids[role_choices.indexOf(response.deleted_role)]
                ], function (err, res) {
                    if (err) throw err;
                })

            askAgain();
        })

};

