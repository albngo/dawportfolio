# Create database script for Fact Stack

# Create the database
CREATE DATABASE IF NOT EXISTS fact_stack;
USE fact_stack;

# Create the app user
CREATE USER IF NOT EXISTS 'fact_stack_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON fact_stack.* TO ' fact_stack_app'@'localhost';

# Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    hashedPassword VARCHAR(255),
    PRIMARY KEY (id)
);

# Create the saved_facts table
CREATE TABLE IF NOT EXISTS saved_facts (
    id INT AUTO_INCREMENT,
    user_id INT,  -- Reference to users table
    fact TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the fact was saved
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  -- Ensure that facts are deleted if the user is deleted
);