CREATE DATABASE votingdb;

USE votingdb;

CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voter_name VARCHAR(100) UNIQUE,
    age INT NOT NULL,
    candidate VARCHAR(100) NOT NULL
);