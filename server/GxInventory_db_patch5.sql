\connect gxinventory_db;

-- Reindex the inventory tables --
REINDEX TABLE equipments;
REINDEX TABLE equipment_types;
REINDEX TABLE campaigns;

-- Add the 'modified' column to all the tables --
ALTER TABLE equipments ADD COLUMN modified_at TIMESTAMP DEFAULT NOW();
ALTER TABLE equipment_types ADD COLUMN modified_at TIMESTAMP DEFAULT NOW();
ALTER TABLE campaigns ADD COLUMN modified_at TIMESTAMP DEFAULT NOW();