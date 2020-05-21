INSERT INTO departments (dept_name) 
VALUES 
	('Marketing'),
    ('Accounting'),
    ('Sales');
    
INSERT INTO roles (title, salary, dept_id) 
VALUES 
	('President', 150000, 1),
    ('Vice President', 125000, 1),
    ('Director', 100000,1);
    
INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES 
	('John', 'Smith', 1, NULL),
    ('Betty', 'Johnson', 2, 1),
    ('Tony', 'Robinson', 3, 2);