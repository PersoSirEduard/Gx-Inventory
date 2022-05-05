\connect gxinventory_db;

ALTER TABLE equipment_types ADD COLUMN has_serial_number BOOLEAN DEFAULT FALSE;
ALTER TABLE equipment_types ADD COLUMN has_brand BOOLEAN DEFAULT FALSE;
ALTER TABLE equipment_types ADD COLUMN has_model BOOLEAN DEFAULT FALSE;