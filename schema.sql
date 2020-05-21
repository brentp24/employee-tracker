DROP DATABASE IF EXISTS employee_tracker;
-- Create the database movie_planner_db and specified it for use.
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE departments (
  dept_id INT NOT NULL AUTO_INCREMENT,
  dept_name varchar(30) NOT NULL,
  PRIMARY KEY (dept_id)
);

CREATE TABLE roles (
  role_id INT NOT NULL AUTO_INCREMENT,
  title varchar(30) NOT NULL,
  Salary numeric(10,2),
  dept_id INT,
  PRIMARY KEY (role_id)
);

CREATE TABLE employees (
  emp_id INT NOT NULL AUTO_INCREMENT,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (emp_id)
);