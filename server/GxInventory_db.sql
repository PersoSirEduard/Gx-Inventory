drop database if exists gxinventory_db;
drop user if exists gxinventory;

create user gxinventory with password 'G3x3l678';
create database gxinventory_db with template=template0 owner=gxinventory;
\connect gxinventory_db;

alter default privileges grant all on tables to gxinventory;
alter default privileges grant all on sequences to gxinventory;

create table equipment_types(
    id serial primary key not null,
    equipment_type_name varchar(20) unique not null,
    equipment_type_description varchar(100)
);

create table equipments(
    id serial primary key not null,
    equipment_name varchar(20) unique not null, -- ID of the equipment
    equipment_type integer not null, -- e.g. "Laptop", "PC", "Monitor", etc.
    equipment_status varchar(20) not null, -- Equipment status in the inventory
    equipment_location varchar(30), -- Equipment location in the inventory or outside
    equipment_description varchar(100), -- Equipment description
    agent_id integer -- ID of the agent who owns the equipment
);

alter table equipments add constraint fk_equipment_id foreign key (equipment_type) references equipment_types(id);

create table agents(
    id serial primary key not null,
    agent_firstname varchar(20) not null, -- Firstname of the agent
    agent_lastname varchar(20) not null, -- Lastname of the agent
    agent_email varchar(30) -- Email of the agent
);

alter table equipments add constraint fk_agent_id foreign key (agent_id) references agents(id);

-- create table transactions(
--     transaction_id serial primary key not null,
--     equipment_id integer not null, -- ID of the equipment
--     agent_id integer not null, -- ID of the agent who owns the equipment
--     transaction_date bigint not null, -- Date of the transaction
--     transaction_type varchar(20) not null, -- Type of the transaction (e.g. "Return", "Hand out", "Replacement", etc.)
--     note varchar(100) -- Additional note
-- );

-- alter table transactions add constraint trans_equipments_fk foreign key (equipment_id) references equipments(equipment_id);
-- alter table transactions add constraint trans_agents_fk foreign key (agent_id) references agents(agent_id);