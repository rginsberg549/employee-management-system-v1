DROP DATABASE IF EXISTS company_employeesDB;
CREATE database company_employeesDB;

USE company_employeesDB;

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE departments (
      id INT NOT NULL AUTO_INCREMENT,
      department_name VARCHAR(30) NOT NULL,
      PRIMARY KEY (id)
);

-- Insert a set of records.

INSERT INTO departments (id, department_name) VALUES (1,'Owner');
INSERT INTO departments (id, department_name) VALUES (2,'Finance Team');
INSERT INTO departments (id, department_name) VALUES (3,'Tehcnical Team');
INSERT INTO departments (id, department_name) VALUES (4,'HR Team');
INSERT INTO departments (id, department_name) VALUES (5,'Administrative Team');

ALTER TABLE departments AUTO_INCREMENT=6;

INSERT INTO roles (title, salary, department_id) VALUES ('CEO', 100000, 1);

INSERT INTO roles (title, salary, department_id) VALUES ('Financial Manager', 100000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Senior Manager', 100000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Assistant Manager', 100000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Staff', 100000, 2);

INSERT INTO roles (title, salary, department_id) VALUES ('Tehcnical Manager', 100000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Senior Manager', 100000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Assistant Manager', 100000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Staff', 100000, 3);

INSERT INTO roles (title, salary, department_id) VALUES ('Human Resources Manager', 100000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Senior Manager', 100000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Assistant Manager', 100000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Staff', 100000, 4);

INSERT INTO roles (title, salary, department_id) VALUES ('Administration Manager', 100000, 5);
INSERT INTO roles (title, salary, department_id) VALUES ('Senior Manager', 100000, 5);
INSERT INTO roles (title, salary, department_id) VALUES ('Assistant Manager', 100000, 5);
INSERT INTO roles (title, salary, department_id) VALUES ('Staff', 100000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('CEO', 'CEO', '1','1');

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName1', 'TestLastName1', '2','1');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName2', 'TestLastName2', '3','2');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName3', 'TestLastName3', '4','2');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName4', 'TestLastName4', '5','2');

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName5', 'TestLastName5', '6','1');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName6', 'TestLastName6', '7','6');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName7', 'TestLastName7', '8','6');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName8', 'TestLastName8', '9','6');

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName9', 'TestLastName9', '10','1');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName10', 'TestLastName10', '11','10');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName11', 'TestLastName11', '12','10');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirstName12', 'TestLastName12', '13','10');

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirst Name13', 'TestLastName13', '14','1');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirst Name14', 'TestLastName14', '15','14');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirst Name15', 'TestLast Name15', '16','14');
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('TestFirst Name16', 'TestLastName16', '17','14');

SELECT * FROM employees;

SELECT * FROM departments;

SELECT * FROM roles;



