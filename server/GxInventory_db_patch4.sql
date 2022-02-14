\connect gxinventory_db;

-- Add new columns to equipments table --
ALTER TABLE equipments ADD COLUMN equipment_brand varchar(30) default '';
ALTER TABLE equipments ADD COLUMN equipment_model varchar(30) default '';
ALTER TABLE equipments ADD COLUMN equipment_agent varchar(50) default '';
