create database exampleDatabase;
use exampleDatabase;

create table user (
    user_cpf char(11) primary key,
    user_email varchar(150) unique not null,
    user_password varchar(255) not null,
    user_name varchar(150) not null
);

create table component (
    component_id int auto_increment primary key,
    component_name varchar(200) not null,
    quantity int not null,
    description varchar(255),
    fk_user_cpf char(11) not null,
    foreign key(fk_user_cpf) references user(user_cpf)
);

create table stock_log (
    log_id int auto_increment primary key,
    log_status enum("in", "out") not null,
    data_log datetime default current_timestamp,
    fk_component_id int,
    foreign key(fk_component_id) references component(component_id)
);