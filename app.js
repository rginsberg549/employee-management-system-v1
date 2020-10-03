var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

async function getDepartments() {
    return new Promise((resolve,reject)=> {
        let departmentChoices = [];
        let query = "SELECT department_name FROM departments;"
        connection.query(query, async (err,res) => {
            for (let index = 0; index < res.length; index++) {
                departmentChoices.push(res[index]['department_name']);
            }
            return err ? reject(err) : resolve(departmentChoices);
        })
    })
}

async function getRoles() {
    return new Promise((resolve,reject)=> {
        let roleChoices = [];
        let query = "SELECT title FROM roles;"
        connection.query(query, async (err,res) => {
            for (let index = 0; index < res.length; index++) {
                roleChoices.push(res[index]['title']);
            }
            return err ? reject(err) : resolve(roleChoices);
        })
    })
}

async function getEmployees() {
    return new Promise((resolve,reject)=> {
        let employeeChoices = [];
        let query = "SELECT CONCAT(first_name, ' ', last_name) as employee_name FROM employees;"
        connection.query(query, async (err,res) => {
            for (let index = 0; index < res.length; index++) {
                employeeChoices.push(res[index]['employee_name']);
            }
            return err ? reject(err) : resolve(employeeChoices);
        })
    })
}

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add Employee",
        "Add Department",
        "Add Role",

        "Update Employee Role",
        "Update Employee Manager",

        "Remove Employee",
        "Remove Department",
        "Remove Role",

        "View All Employees",
        "View All Departments",
        "View All Roles",

        "View All Employees By Department",
        "View All Employees By Manager",

      ]
    })
    .then(async function(answer) {
        switch (answer.action) {
            case "View All Employees":
            viewAllEmployees();
            break;

        case "View All Employees By Department":
            viewAllEmployeesByDepartment();
            break;

        case "View All Employees By Manager":
            viewAllEmployeesByManager();
            break;

        case "Add Employee":
            addEmployee();
            break;

        case "Remove Employee":
            removeEmployee();
            break;

        case "Update Employee Role":
            updateEmployeeRole();
            break;
        
        case "Update Employee Manager":
            updateEmployeeManager();
            break;
        
        case "Add Department":
            await createNewDepartment();
            runSearch();
            break;
        
        case "Add Role":
            await createNewRole();
            runSearch();
            break;

        case "View All Departments":
            viewAllDepartments();
            break;

        case "View All Roles":
            viewAllRoles();
            break;

        case "View All Employees":
            viewAllEmployees();
            break;

        case "Remove Department":
            deleteDepartmentPrompt();
            break;
        }
    });
}

function viewAllEmployees() {
    var query = "SELECT * FROM employees;";
    connection.query(query, function(err, res) {
        console.table(res);
        runSearch();
    });
}

function viewAllDepartments() {
    var query = "SELECT * FROM departments;";
    connection.query(query, function(err, res) {
        console.table(res);
        runSearch();
    });
}

function viewAllRoles() {
    var query = "SELECT * FROM roles;";
    connection.query(query, function(err, res) {
        console.table(res);
        runSearch();
    });
}

function viewAllEmployeesByDepartment() {
    var query = "SELECT emp.id, emp.first_name, emp.last_name, dept.department_name FROM  employees as emp JOIN roles as r ON emp.role_id=r.id Join departments as dept ON r.department_id=dept.id";
    connection.query(query, function(err, res) {
        console.table(res);
        runSearch();
    });
}

function viewAllEmployeesByManager() {
    var query = "SELECT emp.id as 'Employee ID', emp.first_name as 'Employee First Name', emp2.first_name as 'Manager First Name' FROM employees as emp  JOIN employees as emp2 ON emp.manager_id=emp2.id;"
    connection.query(query, function(err, res) {
        console.table(res);
        runSearch();
    });
}

async function addEmployee() {
    let deptChoices = await getDepartments();
    let roleChoices = await getRoles()
    let employeeChoices = await getEmployees();

    inquirer.prompt([{ 
            name: "firstName",
            type: "input",
            message: "What is the employees first name?"
        },{
            name: "lastName",
            type: "input",
            message: "What is the employees last name?"
        },{
            name: "employees",
            type: "rawlist",
            message: "Select the employees manager.  If manager does not exist, please add the manager first.",
            choices: employeeChoices
        },{
            name: "department",
            type: "rawlist",
            message: "Choose a department or create a new department",
            choices: deptChoices
        },{
            name: "role",
            type: "rawlist",
            message: "Choose a role or create a new role",
            choices: roleChoices
        }]).then(function (answer) {
            handleAnswers(answer);
        })
}

async function handleAnswers(answers) {
    
    if (!answers.managerId) {
        answers.managerId = await getEmployeeId(answers);
    }

    if(answers.department === "Create New Department"){
        answers.departmentId = await createNewDepartment()
        } else {
            answers.departmentId = await getDepartmentId(answers);
        }
        
    if (answers.role === "Create New Role") {
        answers.roleId = await createNewRole(answers);
    } else if (!answers.roleId) {
        answers.roleId = await getRoleId(answers);
    }

    createEmployee(answers);
}

async function createNewDepartment() {
    return inquirer.prompt({
            name: "departmentName",
            type: "input",
            message: "What is the name of the new department?"
        }).then(function(departmentAnswers) {
            return new Promise((resolve,reject)=> {
                let query = "INSERT INTO departments (department_name) VALUES (?);"
                connection.query(query,[departmentAnswers.departmentName], function(err,res){
                    console.log("New Department Has Been Created")
                    return err ? reject(err) : resolve(res.insertId);
                })
            })
        })                   
}

async function createNewRole(answers) {
    departmentChoices = await getDepartments();

    return inquirer.prompt([{
        name: "roleTitle",
        type: "input",
        message: "What is the title of the new role?"
    },
    {
        name: "roleSalary",
        type: "input",
        message: "What is the salary of this new role?"
    },{
        name: "department",
        type: "rawlist",
        message: "Which department does this role belong to?",
        choices: departmentChoices
    }]).then(function(roleAnswers) {
        return new Promise(async (resolve,reject)=> {
            let departmentId = await getDepartmentId(roleAnswers)
            console.log(departmentId)
            let query = "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);"
            connection.query(query,[roleAnswers.roleTitle, roleAnswers.roleSalary, departmentId], (err,res)=>{
                console.log("New Role Has Been Created")
                return err ? reject(err) : resolve(res.insertId);
            })
        })
    })        
}
           
async function getEmployeeId(answers) {
    return new Promise((resolve,reject)=> {
        let fullName = answers.employees.split(" ");
        let firstName = fullName[0];
        let lastName = fullName[1];
        let query = "Select id from employees where first_name = (?) AND last_name = (?);"
        connection.query(query,[firstName,lastName], (err,res) => {
            return err ? reject(err) : resolve(res[0].id);
        }) 
    })
}

async function getManagerId(answers) {
    return new Promise((resolve,reject)=> {
        let fullName = answers.manager.split(" ");
        let firstName = fullName[0];
        let lastName = fullName[1];
        let query = "Select id from employees where first_name = (?) AND last_name = (?);"
        connection.query(query,[firstName,lastName], (err,res) => {
            return err ? reject(err) : resolve(res[0].id);
        }) 
    })
}

async function getRoleId(answers) {
    return new Promise((resolve,reject)=>{
        let query = "Select id from roles where title=(?)"
        connection.query(query,[answers.role], (err,res)=> {
            return err ? reject(err) : resolve(res[0].id);
        })
    })  
}

function getDepartmentId(answers) {
    return new Promise((resolve,reject)=> {
        let query = "Select id from departments where department_name=(?);"
        connection.query(query,[answers.department],(err,res)=>{
            return err ? reject(err) : resolve(res[0].id)
        })
    })
}

function createEmployee(answers) {
    let rawData = JSON.stringify(answers)
    let JSONdata = JSON.parse(rawData)
    let query = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?,?);"
    connection.query(query,[JSONdata.firstName,JSONdata.lastName, JSONdata.roleId, JSONdata.managerId], function(err,res){
        console.log("New Employee Has Been Created");
        runSearch();
    })
}

async function removeEmployee(){
    employeeChoices = await getEmployees()

    inquirer.prompt([{
        name:"employees",
        type: "rawlist",
        message: "Which employee would you like to remove?",
        choices: employeeChoices
    }]).then(async function(answer){
        let employeeId = await getEmployeeId(answer);
        let query = "DELETE FROM employees where id=(?);"
        connection.query(query,[employeeId], function(err,res){
            runSearch();
        })
    })
}

async function updateEmployeeRole(){
    employeeChoices = await getEmployees()
    roleChoices = await getRoles()

    inquirer.prompt([{
        name:"employees",
        type: "rawlist",
        message: "Which employee would you like to update?",
        choices: employeeChoices
    }, {
        name: "role",
        type: "rawlist",
        message: "What role would you like to assign to this employee?",
        choices: roleChoices
    }]).then(async function(answer){
        let employeeId = await getEmployeeId(answer);
        let roleId = await getRoleId(answer);
        let query = "UPDATE employees SET role_id=(?) WHERE id=(?);"
        connection.query(query,[roleId, employeeId], (err,res)=> {
            console.log("Employee Has Been Updated");
            runSearch();
        })
    })
}

async function updateEmployeeManager(){
    employeeChoices = await getEmployees()
    inquirer.prompt([{
        name:"employees",
        type: "rawlist",
        message: "Which employee would you like to update?",
        choices: employeeChoices
    }, {
        name: "manager",
        type: "rawlist",
        message: "Who is the new manager for this employee?",
        choices: employeeChoices
    }]).then(async function(answer){
        let employeeId = await getEmployeeId(answer);
        let managerId = await getManagerId(answer);
        let query = "UPDATE employees SET manager_id=(?) WHERE id=(?);"
        connection.query(query,[managerId, employeeId], (err,res)=> {
            console.log("Employee Has Been Updated");
            runSearch();
        })
    })
}


//Currently not working but will revisit later - need to submit so I can get going on other HW
async function deleteDepartmentPrompt() {
    departmentChoices = await getDepartments();

    inquirer.prompt([{
        name: "department",
        type: "rawlist",
        message: "Which department whould you like to delete?",
        choices: departmentChoices
    }]).then(async function(answer){
        departmentId = await getDepartmentId(answer);
        let query = "SELECT Count(*) as roles_to_update from roles where department_id=(?);";
        connection.query(query,[departmentId], async function(err,res){
            let countOfRolesToUpdate = await res[0]['roles_to_update'];
            if (countOfRolesToUpdate > 0) {
                let query = "SELECT id as id_to_update from roles where department_id=(?);";
                connection.query(query,[departmentId], async function(err,res){
                    idsOfRolesToUpdate = []
                    for (let index = 0; index < res.length; index++) {
                        idsOfRolesToUpdate.push(await res[index]['id_to_update'])
                    }
                    updateRoleDepartment(idsOfRolesToUpdate);
                })
            } else {
                deleteDepartmentPrompt();
            }
        })
    })
}

function updateRoleDepartment(roleIds) {
    let idsOfRolesToUpdate = roleIds
    console.log(idsOfRolesToUpdate)
    for (let index = 0; index < idsOfRolesToUpdate.length; index++) {
        console.log(idsOfRolesToUpdate[index])
        return new Promise((resolve,reject)=> {
            console.log(idsOfRolesToUpdate[index])
            let query = "Select id From roles where department_id=(?);"
            connection.query(query,[idsOfRolesToUpdate[index]],async (err,res)=>{
                console.log(res);
                return err ? reject(err) : resolve(console.log(err));
            });
        })
    
    }
}


//Which department do you want to delete
//Check which roles are assigned to this department
//Check which employees are assigned these roles
//Individually update each employees role?
//Bulk update all employees role?
//Create new role and then update
//delete department after employees are updated




