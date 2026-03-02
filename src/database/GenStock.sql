create database genstock;
use genstock;

create table users (
    user_id char (36) primary key,
    user_cpf char(11) unique not null,
    user_email varchar(150) unique not null,
    user_password varchar(255) not null,
    user_name varchar(150) not null,
    user_type enum("admin", "regular") not null default 'regular'
);

create table components (
    component_id int auto_increment primary key,
    is_active tinyint default 1,
    component_name varchar(200) not null,
    quantity int not null,
    description varchar(255),
    fk_user_id char(36) not null,
    foreign key(fk_user_id) references users(user_id) on delete cascade,
    unique(component_name, fk_user_id)
);

create table stock_logs (
    log_id int auto_increment primary key,
    log_status enum("in", "out", "deleted") not null,
    quantity_changed int not null,
    quantity_after int not null,
    updated_at datetime default current_timestamp,
    fk_component_id int not null,
    fk_user_id char(36) not null,
    foreign key(fk_component_id) references components(component_id) on delete cascade,
    foreign key(fk_user_id) references users(user_id)
);