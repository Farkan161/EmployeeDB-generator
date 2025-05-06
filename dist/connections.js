import { pool } from './server.js'; // Use .js if "module": "ESNext" in tsconfig
import inquirer from 'inquirer';
// View all departments
export const viewDepartments = async () => {
    const result = await pool.query('SELECT * FROM department;');
    console.table(result.rows);
};
// View all roles
export const viewRoles = async () => {
    const result = await pool.query(`
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id;
  `);
    console.table(result.rows);
};
// View all employees
export const viewEmployees = async () => {
    const result = await pool.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, 
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
  `);
    console.table(result.rows);
};
// Add a department
export const addDepartment = async () => {
    const { name } = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter the name of the department:' },
    ]);
    await pool.query('INSERT INTO department (name) VALUES ($1);', [name]);
    console.log(`Department "${name}" added successfully.`);
};
// Add a role
export const addRole = async () => {
    const departments = await pool.query('SELECT * FROM department;');
    const { title, salary, departmentId } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the title of the role:' },
        { type: 'input', name: 'salary', message: 'Enter the salary for the role:' },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for the role:',
            choices: departments.rows.map((dept) => ({ name: dept.name, value: dept.id })),
        },
    ]);
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);', [title, salary, departmentId]);
    console.log(`Role "${title}" added successfully.`);
};
// Add an employee
export const addEmployee = async () => {
    const roles = await pool.query('SELECT id, title FROM role;');
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee;');
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        { type: 'input', name: 'firstName', message: 'Enter the first name of the employee:' },
        { type: 'input', name: 'lastName', message: 'Enter the last name of the employee:' },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the role for the employee:',
            choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the manager for the employee:',
            choices: [
                { name: 'None', value: null },
                ...employees.rows.map((emp) => ({
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id,
                })),
            ],
        },
    ]);
    await pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`, [firstName, lastName, roleId, managerId]);
    console.log(`Employee "${firstName} ${lastName}" added successfully.`);
};
// Update an employee role
export const updateEmployeeRole = async () => {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee;');
    const roles = await pool.query('SELECT id, title FROM role;');
    const { employeeId, roleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employees.rows.map((emp) => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id,
            })),
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the new role for the employee:',
            choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
        },
    ]);
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2;', [roleId, employeeId]);
    console.log('Employee role updated successfully.');
};
