create database tramadev;
use tramadev;

create table USER(
	id int primary key auto_increment,
    name varchar(50),
    active tinyint default 1
);

create table AUTH(
	id int primary key,
    username varchar(20) unique,
    password varchar(60),
    foreign key (id) references USER (id)
);

create table SESSION(
	id int primary key auto_increment,
    idAuth int,
    startDate timestamp default current_timestamp,
    foreign key (idAuth) references AUTH(id)
);

