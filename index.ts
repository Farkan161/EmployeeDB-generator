const inquirer = require('inquirer');
const pool = require('./src/connections').default; // Import the connection pool
require('dotenv').config();

// Test the database connection
pool.connect()
  .then(() => console.log('Connected to the database.'))
  .catch(err => console.error('Connection error', err.stack));

// Main menu
function mainMenu() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit',
      ],
    },
  ]).then(answer => {
    switch (answer.action) {
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add a Department':
        addDepartment();
        break;
      case 'Add a Role':
        addRole();
        break;
      case 'Add an Employee':
        addEmployee();
        break;
      case 'Update an Employee Role':
        updateEmployeeRole();
        break;
      case 'Exit':
        pool.end();
        console.log('Goodbye!');
        break;
    }
  });
}


function viewAllDepartments() {
  pool.query('SELECT id AS department_id, name AS department_name FROM department;', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu();
  });
}

mainMenu();