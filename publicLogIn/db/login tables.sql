create database privateLogin;
use privateLogin;

create table USER(
	id int primary key auto_increment,
    name varchar(30) not null,
    patLastName varchar(30) not null,
    matLastName varchar(30) null,
    phone varchar(15) not null,
    type enum('admin','general') not null,
    active tinyint not null default 1
);

create table AUTH(
	id int primary key,
    username varchar(20) unique not null,
    password varchar(60) not null,
    foreign key (id) references USER (id)
);

create table SESSION(
	id int primary key auto_increment,
    idAuth int not null,
    startDate timestamp  not null default current_timestamp,
    foreign key (idAuth) references AUTH(id)
);

