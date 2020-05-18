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
            choices:  ["View all departments", "View all roles", "View all employees",  "Add department", "Add role", "Add employee"]
        }
    )
.then(function (response) {
    console.log(response)
    switch(response.initialQuestion) {
        case "View all departments": 
        connection.query ("SELECT * FROM employee_tracker.departments;", function(err, res) {
            if (err) throw err; 
            console.table(res);
            
        })

        break;
        
        case "View all roles": 
        connection.query ("SELECT * FROM employee_tracker.roles;", function(err, res) {
            if (err) throw err; 
            console.table(res);
            
        })

        break;
    
        case "View all employees": 
        connection.query ("SELECT * FROM employee_tracker.employees;", function(err, res) {
            if (err) throw err; 
            console.table(res);
            
        })
        
        break;

        case "Add department": 
        connection.query ("INSERT INTO employee_tracker.departments SET ?", function(err, res) {
            if (err) throw err; 
            console.table(res);
            
        })
        
        break;

        case "Add role": 
        connection.query ("INSERT INTO employee_tracker.roles SET ?", function(err, res) {
            if (err) throw err; 
            console.table(res);
            
        })
        
        break;

        case "Add employee": 
        connection.query ("INSERT INTO employee_tracker.employees SET ?", function(err, res) {
            if (err) throw err; 
            console.table(res);
            
        })
        
        break;

    }

}

)

}


