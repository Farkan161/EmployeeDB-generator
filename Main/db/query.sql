 SELECT role.id AS role_id,
  role.title AS job_title,
  department.name AS department_name,
  role.salary
FROM role
JOIN department
ON role.department_id = department.id;