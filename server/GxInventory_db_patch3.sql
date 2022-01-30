\connect gxinventory_db;

-- Remove fully the agents table --
ALTER TABLE equipments DROP CONSTRAINT fk_agent_id;
DROP TABLE agents;

-- Add new columns to equipments table --
ALTER TABLE equipments ADD COLUMN equipment_campaign integer default 1;
ALTER TABLE equipments ADD COLUMN equipment_serial_number varchar(30) default '';

-- Add the campaign table --
CREATE TABLE campaigns(
    id serial primary key not null,
    campaign_name varchar(20) unique not null,
    campaign_description varchar(100) default '',
    deleted BOOLEAN DEFAULT FALSE
);

INSERT INTO campaigns (campaign_name, campaign_description) VALUES ('None', 'No assopciated campaign.');

CREATE INDEX n_idx ON campaigns USING btree(id);
alter table equipments add constraint fk_campaign_id foreign key (equipment_campaign) references campaigns(id);